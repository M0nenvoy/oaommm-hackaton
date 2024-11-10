from sentence_transformers import CrossEncoder
from uuid import uuid4
from huggingface_hub import snapshot_download
from langchain.document_loaders import (
    CSVLoader,
    EverNoteLoader,
    PyPDFLoader,
    TextLoader,
    UnstructuredEmailLoader,
    UnstructuredEPubLoader,
    UnstructuredHTMLLoader,
    UnstructuredMarkdownLoader,
    UnstructuredODTLoader,
    UnstructuredPowerPointLoader,
    UnstructuredWordDocumentLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from chromadb.config import Settings
from chromadb import PersistentClient
from chromadb.utils import embedding_functions

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

import re
import requests

# Сопоставление типов файлов с загрузчиками для обработки
LOADER_MAPPING = {
    ".csv": (CSVLoader, {}),
    ".doc": (UnstructuredWordDocumentLoader, {}),
    ".docx": (UnstructuredWordDocumentLoader, {}),
    ".enex": (EverNoteLoader, {}),
    ".epub": (UnstructuredEPubLoader, {}),
    ".html": (UnstructuredHTMLLoader, {}),
    ".md": (UnstructuredMarkdownLoader, {}),
    ".odt": (UnstructuredODTLoader, {}),
    ".pdf": (PyPDFLoader, {}),
    ".ppt": (UnstructuredPowerPointLoader, {}),
    ".pptx": (UnstructuredPowerPointLoader, {}),
    ".txt": (TextLoader, {"encoding": "utf8"}),
}

# Константы для обработки текста и поиска
chunk_size = 600
chunk_overlap = 30
k_documents = 7
top_p = 0.9
top_k = 30
temp = 0.1
chatbot = []

# Инициализация клиента ChromaDB для работы с базой данных
client = PersistentClient(path="test", settings=Settings(allow_reset=True))

# Загрузка модели эмбеддингов для текстов
embedder_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
snapshot_download(repo_id=embedder_name, local_dir="data/paraphrase-multilingual-mpnet-base-v2", cache_dir="data/cache")
embeddings = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="data/paraphrase-multilingual-mpnet-base-v2")

# URL API для генерации текста и заголовки авторизации
url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
headers = {
    'Authorization': 'Bearer ...',  # Укажите токен авторизации
    'Content-Type': 'application/json'
}


def add_file_to_db(file_paths, collection, chunk_size, chunk_overlap):
    """
    Загружает файлы в базу данных, разбивая на блоки текста и добавляя в коллекцию.
    
    :param file_paths: список путей к файлам
    :param collection: коллекция документов в базе данных
    :param chunk_size: размер блока текста
    :param chunk_overlap: количество перекрытия текста между блоками
    """
    if file_paths:
        # Загружает каждый файл, обрабатывая по типу и сохраняет результат
        documents = [load_single_document(path) for path in file_paths]
        tmp = []
        for doc in documents:
            if doc != None:
                if isinstance(doc, list):
                    tmp.extend(doc)
                else:
                    tmp.append(doc)
        documents = tmp

        # Разделение текста на части
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        documents = text_splitter.split_documents(documents)
        
        fixed_documents = []
        metadatas = []
        try:
            last_id = int(collection.get()["ids"][-1][2:])
        except Exception:
            last_id = -1
        ids = []
        
        # Обработка и добавление каждого документа в коллекцию
        for i in range(len(documents)):   
            documents[i].page_content = process_text(documents[i].page_content)
            if not documents[i].page_content:
                continue
            
            fixed_documents.append(documents[i].page_content)
            metadatas.append({'file_path': documents[i].metadata['source']})
            if 'page' in documents[i].metadata:
                metadatas[i]['page'] = documents[i].metadata['page'] + 1

            ids.append(f"id{last_id + 1 + i}")
        collection.add(
            documents=fixed_documents,
            metadatas=metadatas,
            ids=ids
        )
        return collection
    return None


def retrieve(history, collection, default_collection, k_documents):
    """
    Извлекает релевантные документы для последнего сообщения пользователя.

    :param history: список сообщений
    :param collection: коллекция с документами пользователя
    :param default_collection: коллекция по умолчанию
    :param k_documents: количество релевантных документов для извлечения
    :return: список релевантных документов и их метаданных
    """
    last_user_message = history[-1]["text"]
    retrieved_docs = []
    metadatas = []
    
    # Запрос в коллекцию по умолчанию
    if default_collection:
        res = default_collection.query(
                query_texts=[last_user_message],
                n_results=k_documents,
            )
        retrieved_docs.extend(res['documents'][0])
        metadatas.extend(res['metadatas'][0])
    
    # Запрос в пользовательскую коллекцию
    if collection:
        res = collection.query(
                query_texts=[last_user_message],
                n_results=k_documents,
            )
        retrieved_docs.extend(res['documents'][0])
        metadatas.extend(res['metadatas'][0])
    return retrieved_docs, metadatas


def load_single_document(file_path: str) -> Document:
    """
    Загружает документ на основе его расширения.
    
    :param file_path: путь к файлу
    :return: объект документа или None в случае ошибки
    """
    try:
        ext = "." + file_path.rsplit(".", 1)[-1]
        assert ext in LOADER_MAPPING
        loader_class, loader_args = LOADER_MAPPING[ext]
        loader = loader_class(file_path, **loader_args)
        if ext == ".pdf": return loader.load_and_split()
        return loader.load()[0]
    except Exception as ex:
        print(ex)
        return None  


def process_text(text):
    """
    Очищает текст от лишних символов и форматирования.
    
    :param text: текст для обработки
    :return: обработанный текст или None, если текст слишком короткий
    """
    text = text.replace(' \n', '').replace('\n\n', '\n').replace('\n\n\n', '\n').strip()
    text = re.sub(r"(?<=\n)\d{1,2}", "", text)
    text = re.sub(r"\b(?:the|this)\s*slide\s*\w+\b", "", text, flags=re.IGNORECASE)
    if len(text) < 10:
        return None
    return text


def bot(
        history,
        retrieved_docs,
        top_p,
        top_k,
        temp, 
        metadatas
):
    """
    Генерирует ответ на основе последних сообщений и релевантных документов.
    
    :param history: список сообщений
    :param retrieved_docs: релевантные документы для ответа
    :param top_p: параметр для фильтрации токенов
    :param top_k: ограничение на количество рассматриваемых токенов
    :param temp: температура генерации текста
    :param metadatas: метаданные документов
    :return: ответ на вопрос и метаданные
    """
    if not history:
        return

    last_user_message = history[-1]["text"]
    if retrieved_docs:
        
        rank_result = reranker_model.rank(last_user_message, retrieved_docs)
        relevant_doc = retrieved_docs[rank_result[0]["corpus_id"]]

        last_user_message = f"Используя контекст ниже ответь на запрос.\n\nКонтекст:{relevant_doc}\n\nЗапрос:{last_user_message}\n\nОтвет:"

    history[-1]["text"] = last_user_message
    data = {
        "modelUri": "gpt://b1gjp5vama10h4due384/yandexgpt/latest",
        "completionOptions": {
            "stream": False,
            "temperature": temp,
            "top_p": top_p,
            "top_k": top_k,
            "maxTokens": 2000
        },
        "messages": history
    }
    response = requests.post(url, headers=headers, json=data)
    file_answer = metadatas[rank_result[0]["corpus_id"]]['file_path']
    return response.json()['result']['alternatives'][0]['message']['text'], metadatas[rank_result[0]["corpus_id"]]


# Инициализация модели для ранжирования документов
reranker_model = CrossEncoder('DiTy/cross-encoder-russian-msmarco', max_length=512, device='cuda')

# Инициализация приложения FastAPI и настройка CORS
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/uploadfiles")
def create_upload_files(data=Body()):
    """
    API-метод для загрузки файлов в коллекцию пользователя.
    
    :param data: данные с именем пользователя и файлами для загрузки
    :return: статус операции
    """
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    collection = add_file_to_db(data["msg"], collection, chunk_size, chunk_overlap)
    return 'Файлы добавлены'


@app.delete("/del_files")
def del_files(data=Body()):
    """
    API-метод для удаления файлов из коллекции пользователя.
    
    :param data: данные с именем пользователя и списком файлов для удаления
    :return: статус операции
    """
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    for doc in data['msg']:
        collection.delete(
            ids=collection.get()["ids"],
            where={"file_path": doc},
        )
    return 'Файлы удалены'


@app.post("/answer")
def question_answering(data=Body()):
    """
    API-метод для генерации ответа на вопрос пользователя на основе коллекции документов.
    
    :param data: данные с именем пользователя и сообщениями для анализа
    :return: ответ на вопрос и метаданные
    """
    global k_documents
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    default_collection = client.get_or_create_collection("default",embedding_function=embeddings)
    retrieved_docs, metadatas = retrieve(data['messages'], collection, default_collection, k_documents)
    result, metadata = bot(data['messages'], retrieved_docs, top_p, top_k, temp, metadatas)
    return {'msg': result, 'metadata': metadata}
