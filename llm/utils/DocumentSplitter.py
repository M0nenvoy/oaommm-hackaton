from utils.Splitter import Splitter
from typing import List, Dict
from langchain.docstore.document import Document
from utils.SimilarSentenceSplitter import SimilarSentenceSplitter
from collections import defaultdict

class DocumentSplitter:
    def __init__(self, splitter: Splitter):
        """
        Инициализирует сплиттер документов с указанным стратегическим сплиттером.

        :param splitter: Экземпляр класса Splitter для разбиения текста
        """
        self.splitter = splitter

    def split_documents(self, documents: List[Document], group_max_sentences=5) -> List[Document]:
        """
        Объединяет фрагменты одного файла и разбивает текст на более мелкие фрагменты.

        :param documents: Список объектов Document для разбиения
        :param group_max_sentences: Максимальное количество предложений в группе (только для SimilarSentenceSplitter)
        :return: Список объектов Document с разбитыми фрагментами текста
        """
        # Шаг 1: Группируем документы по источнику (файлу)
        documents_by_source = defaultdict(list)
        for document in documents:
            source = document.metadata.get("source")
            documents_by_source[source].append(document)

        split_documents = []

        # Шаг 2: Обрабатываем каждый файл отдельно
        for source, docs in documents_by_source.items():
            # Объединяем текст из всех страниц одного файла, сохраняя метаинформацию о страницах
            full_text = ""
            page_ranges = []
            for doc in docs:
                start_idx = len(full_text)
                full_text += doc.page_content + " "
                end_idx = len(full_text)
                page_ranges.append((start_idx, end_idx, doc.metadata.get("page")))

            # Шаг 3: Разбиваем объединённый текст на группы предложений
            if isinstance(self.splitter, SimilarSentenceSplitter):
                sentence_groups = self.splitter.split(full_text, group_max_sentences=group_max_sentences)
            else:
                sentence_groups = self.splitter.split(full_text)

            # Шаг 4: Создаем новые объекты Document для каждого фрагмента
            current_position = 0  # Позиция для отслеживания начала следующего чанка
            for group in sentence_groups:
                group_text = " ".join(group)
                group_length = len(group_text)
                
                # Определяем страницы, к которым относится данный фрагмент
                pages_in_group = []
                group_start = current_position
                group_end = current_position + group_length
                
                for start, end, page in page_ranges:
                    if start < group_end and end > group_start:
                        pages_in_group.append(page)
                
                # Обновляем позицию для следующего чанка
                current_position += group_length + 1  # Учитываем пробел между группами

                # Создаем новый объект Document с объединённым текстом и страницами, откуда взяты предложения
                split_documents.append(Document(
                    page_content=group_text,
                    metadata={"source": source, "pages": pages_in_group}
                ))

        return split_documents
    