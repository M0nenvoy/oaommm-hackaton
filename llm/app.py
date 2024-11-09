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


import requests


SYSTEM_PROMPT = "Ты — Сайга, русскоязычный автоматический ассистент. Ты разговариваешь с людьми и помогаешь им."
SYSTEM_TOKEN = 1788
USER_TOKEN = 1404
BOT_TOKEN = 9225
LINEBREAK_TOKEN = 13

ROLE_TOKENS = {
    "user": USER_TOKEN,
    "bot": BOT_TOKEN,
    "system": SYSTEM_TOKEN
}

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
chunk_size = 600
chunk_overlap = 30
k_documents = 7
top_p = 0.9
top_k = 30
temp = 0.1
chatbot = []

client = PersistentClient(path="test", settings=Settings(allow_reset=True))
client.reset()
embedder_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
snapshot_download(repo_id=embedder_name, local_dir="data/paraphrase-multilingual-mpnet-base-v2", cache_dir="data/cache")
embeddings = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="data/paraphrase-multilingual-mpnet-base-v2")
url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

# Заголовки
headers = {
    'Authorization': 'Bearer t1.9euelZqOlcrPyZicjZSWk5qMisuPze3rnpWamc6MkZjHl8zMx5mbj8iQxpLl8_dRGUJG-e8NUDwv_t3z9xFIP0b57w1QPC_-zef1656VmsqemcmLysmLkYubns_Nm8mS7_zF656VmsqemcmLysmLkYubns_Nm8mS.ud-kuGF_AkCTanUYu_J2_8U_bkOBR1bxbh7EJH5RapYTcDwSdxVWh8aRtAHFudKnMGtxVHstXJ3gS-Ydx68ECQ',
    'Content-Type': 'application/json'
}


def add_file_to_db(file_paths, collection, chunk_size, chunk_overlap):
    if file_paths:
        documents = [load_single_document(path) for path in file_paths]
        print(documents)
        tmp = []
        for doc in documents:
            if doc != None:
                if isinstance(doc, list):
                    tmp.extend(doc)
                else:
                    tmp.append(doc)
        documents = tmp
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        documents = text_splitter.split_documents(documents)
        fixed_documents = []
        metadatas = []
        try:
            last_id = int(collection.get()["ids"][-1][2:])
        except Exception:
            last_id = -1
        ids = []
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


def retrieve(history, collection, k_documents):
    retrieved_docs = ""
    if collection:
        last_user_message = history[-1]["text"]
        res = collection.query(
                query_texts=[last_user_message],
                n_results=k_documents,
            )
        retrieved_docs = res['documents'][0]
        metadatas = res['metadatas'][0]
    return retrieved_docs, metadatas


def load_single_document(file_path: str) -> Document:
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
    lines = text.split("\n")
    lines = [line for line in lines if len(line.strip()) > 2]
    text = "\n".join(lines).strip()
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
    if not history:
        return

    last_user_message = history[-1]["text"]
    if retrieved_docs:
        
        rank_result = reranker_model.rank(last_user_message, retrieved_docs)

        relevant_doc = retrieved_docs[rank_result[0]["corpus_id"]]

        last_user_message = f"Используя контекст ниже ответь на запрос.\n\nКонтекст:{relevant_doc}\n\nЗапрос:{last_user_message}\n\nОтвет:"

    history[-1]["text"] = last_user_message
    print(history)
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
    print(retrieved_docs[rank_result[0]["corpus_id"]])
    print(metadatas[rank_result[0]["corpus_id"]])
    file_answer = metadatas[rank_result[0]["corpus_id"]]['file_path']
    return response.json()['result']['alternatives'][0]['message']['text'], metadatas[rank_result[0]["corpus_id"]]


reranker_model = CrossEncoder('DiTy/cross-encoder-russian-msmarco', max_length=512, device='cuda')


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
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    collection = add_file_to_db(data["msg"], collection, chunk_size, chunk_overlap)
    return 'Файлы добавлены'


@app.delete("/del_files")
def del_files(data=Body()):
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    chatbot = []
    for doc in data['msg']:
        collection.delete(
            ids=collection.get()["ids"],
            where={"file_path": doc},
        )
    return 'Файлы удалены'


@app.post("/answer")
def question_answering(data=Body()):
    global chatbot, k_documents
    collection = client.get_or_create_collection(data['username'],embedding_function=embeddings)
    retrieved_docs, metadatas = retrieve(data['messages'], collection, k_documents)
    result, metadata = bot(data['messages'], retrieved_docs, top_p, top_k, temp, metadatas)
    chatbot = []
    return {'msg': result,
            'metadata': metadata}

