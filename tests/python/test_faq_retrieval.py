"""Independently authored FAQ tests; every source and question is fictional."""
import copy
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / 'projects/fictional-faq-retrieval/faq.py'
spec = importlib.util.spec_from_file_location('fictional_faq', SCRIPT)
faq = importlib.util.module_from_spec(spec)
spec.loader.exec_module(faq)


class FAQRetrievalTest(unittest.TestCase):
    def setUp(self):
        self.docs = faq.load_documents()
        self.question = 'When is the moon library open?'

    def test_exact_answer_is_verbatim_with_resolvable_attribution(self):
        result = faq.retrieve(self.question, self.docs)
        self.assertEqual(result['status'], 'answered')
        source = result['answer_source']
        doc = next(d for d in self.docs if d['id'] == source['document_id'])
        entry = next(e for e in doc['entries'] if e['section'] == source['section'])
        self.assertEqual(result['answer'], entry['answer'])
        excerpt = next(s for s in result['sources'] if s['section'] == source['section'])
        self.assertIn(result['answer'], excerpt['excerpt'])
        self.assertEqual(excerpt['title'], doc['title'])

    def test_curated_alias_and_case_punctuation_normalisation(self):
        result = faq.retrieve('WHAT are the moon library opening hours!!!', self.docs)
        self.assertEqual(result['status'], 'answered')
        self.assertEqual(result['answer_source']['section'], 'opening-hours')

    def test_missing_answers_and_lexical_false_positives_abstain(self):
        for question in ['Can I park a spaceship?', 'Is the moon library open on Sunday?',
                         'When is the moon library not open?', 'How much do star maps cost?']:
            with self.subTest(question=question):
                result = faq.retrieve(question, self.docs)
                self.assertEqual(result['status'], 'unsupported')
                self.assertIsNone(result['answer'])
                self.assertIsNone(result['answer_source'])

    def test_empty_corpus_and_no_overlap(self):
        self.assertEqual(faq.retrieve(self.question, [])['sources'], [])
        self.assertEqual(faq.retrieve('Zebras?', self.docs)['sources'], [])

    def test_ranking_is_deterministic_under_reordered_documents(self):
        reversed_docs = copy.deepcopy(list(reversed(self.docs)))
        for doc in reversed_docs:
            doc['entries'].reverse()
        self.assertEqual(faq.retrieve('moon library', self.docs), faq.retrieve('moon library', reversed_docs))

    def test_top_k_and_character_budget_keep_whole_sources(self):
        self.docs[0]['entries'][1]['questions'].append('When is the moon library borrowing desk open?')
        full = faq.retrieve(self.question, self.docs)
        first_size = len(full['sources'][0]['excerpt'])
        bounded = faq.retrieve(self.question, self.docs, top_k=1, max_chars=first_size)
        self.assertEqual(bounded['status'], 'answered')
        self.assertEqual(len(bounded['sources']), 1)
        self.assertTrue(bounded['retrieval_limited'])
        self.assertEqual(bounded['sources'][0], full['sources'][0])
        too_small = faq.retrieve(self.question, self.docs, max_chars=first_size - 1)
        self.assertEqual(too_small['status'], 'retrieval_limited')
        self.assertIsNone(too_small['answer'])
        self.assertLessEqual(sum(len(s['excerpt']) for s in too_small['sources']), first_size - 1)

    def test_answer_after_first_thousand_characters_is_found(self):
        self.docs[0]['entries'][0]['answer'] = 'Fictional background. ' * 100
        result = faq.retrieve('Are lantern workshop materials supplied?', self.docs, top_k=1)
        self.assertEqual(result['status'], 'answered')
        self.assertEqual(result['answer_source']['document_id'], 'cloudberry-workshops')

    def test_conflicting_matches_cannot_be_hidden_by_limits(self):
        duplicate = copy.deepcopy(self.docs[0])
        duplicate['id'] = 'another-fictional-handbook'
        duplicate['entries'][0]['answer'] = 'The fictional library is closed.'
        self.docs.append(duplicate)
        result = faq.retrieve(self.question, self.docs, top_k=1)
        self.assertEqual(result['status'], 'ambiguous')
        self.assertIsNone(result['answer_source'])
        self.assertIsNone(result['answer'])

    def test_malformed_queries_and_limits(self):
        for question in [None, 5, [], '', '   ', '???', 'x' * 501]:
            with self.subTest(question=question), self.assertRaises(ValueError):
                faq.retrieve(question, self.docs)
        for key in ['top_k', 'max_chars']:
            for value in [0, -1, True, 1.5, '2', None, 20001]:
                with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                    faq.retrieve(self.question, self.docs, **{key: value})

    def test_malformed_corpus_is_rejected(self):
        variants = [None, {}, [None], [{'id': 'missing-fields'}]]
        for key, value in [('id', ''), ('title', 7), ('entries', []), ('entries', {})]:
            docs = copy.deepcopy(self.docs)
            docs[0][key] = value
            variants.append(docs)
        for key, value in [('answer', ''), ('section', None), ('questions', []),
                           ('questions', ['???']), ('questions', [4])]:
            docs = copy.deepcopy(self.docs)
            docs[0]['entries'][0][key] = value
            variants.append(docs)
        variants.append(self.docs + [self.docs[0]])
        docs = copy.deepcopy(self.docs)
        docs[0]['entries'].append(docs[0]['entries'][0])
        variants.append(docs)
        for docs in variants:
            with self.subTest(documents=docs), self.assertRaises(ValueError):
                faq.retrieve(self.question, docs)

    def test_cli_success_and_clean_input_errors(self):
        run = subprocess.run([sys.executable, str(SCRIPT), self.question], capture_output=True, text=True)
        self.assertEqual(run.returncode, 0)
        self.assertEqual(json.loads(run.stdout)['status'], 'answered')
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'fictional.json'
            for content in ['{bad json', '{}']:
                path.write_text(content)
                run = subprocess.run([sys.executable, str(SCRIPT), self.question, '--documents', str(path)],
                                     capture_output=True, text=True)
                self.assertEqual(run.returncode, 2)
                self.assertEqual(json.loads(run.stderr)['status'], 'invalid_input')
                self.assertEqual(run.stdout, '')
        run = subprocess.run([sys.executable, str(SCRIPT), self.question, '--documents', str(path)],
                             capture_output=True, text=True)
        self.assertEqual(run.returncode, 2)
        self.assertEqual(json.loads(run.stderr)['error_type'], 'FileNotFoundError')


if __name__ == '__main__':
    unittest.main()
