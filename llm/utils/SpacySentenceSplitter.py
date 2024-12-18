
from typing import List
from utils.Splitter import Splitter

import spacy


class SpacySentenceSplitter(Splitter):

    def __init__(self, spacy_model: str = "en_core_web_sm"):
        self.nlp = spacy.load(spacy_model)

    def split(self, text: str) -> List[str]:
        doc = self.nlp(text)
        return [str(sent).strip() for sent in doc.sents]
