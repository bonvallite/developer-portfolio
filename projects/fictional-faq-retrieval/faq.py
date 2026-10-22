"""Offline FAQ retrieval over authored fictional records; never generate answers."""
import argparse
import json
import re
import sys
from fractions import Fraction
from pathlib import Path

DEFAULT_DOCUMENTS = Path(__file__).with_name('documents.json')
MAX_QUESTION_CHARS = 500


def tokens(text):
    """Normalise case and punctuation, preserving word order and negation."""
    return tuple(re.findall(r"\w+", text.casefold()))


def validate_documents(documents):
    """Reject the entire corpus on malformed records; never silently skip evidence."""
    if not isinstance(documents, list):
        raise ValueError('Documents must be a list')
    seen = set()
    for doc in documents:
        if not isinstance(doc, dict) or set(doc) != {'id', 'title', 'entries'}:
            raise ValueError('Each document needs id, title and entries')
        for key in ('id', 'title'):
            if not isinstance(doc[key], str) or not doc[key].strip():
                raise ValueError('Document identifiers and titles must be non-empty text')
        if doc['id'] in seen:
            raise ValueError('Duplicate document id')
        seen.add(doc['id'])
        if not isinstance(doc['entries'], list) or not doc['entries']:
            raise ValueError('Document entries must be a non-empty list')
        sections = set()
        for entry in doc['entries']:
            if not isinstance(entry, dict) or set(entry) != {'section', 'questions', 'answer'}:
                raise ValueError('Each entry needs section, questions and answer')
            for key in ('section', 'answer'):
                if not isinstance(entry[key], str) or not entry[key].strip():
                    raise ValueError('Sections and answers must be non-empty text')
            if entry['section'] in sections:
                raise ValueError('Duplicate section in document')
            sections.add(entry['section'])
            if not isinstance(entry['questions'], list) or not entry['questions']:
                raise ValueError('Questions must be a non-empty list')
            if any(not isinstance(q, str) or not tokens(q) or len(q) > MAX_QUESTION_CHARS
                   for q in entry['questions']):
                raise ValueError('Questions must contain words and be at most 500 characters')
    return documents


def load_documents(path=DEFAULT_DOCUMENTS):
    """Load local UTF-8 JSON only; no network or model dependencies."""
    return validate_documents(json.loads(Path(path).read_text(encoding='utf-8')))


def retrieve(question, documents, *, top_k=3, max_chars=2000):
    """Rank all entries, then budget whole excerpts and select only exact FAQ matches.

    Keyword overlap is navigation evidence, never proof that an answer is supported.
    Exact normalised question/alias matches rank first. Fraction scores and source IDs
    make ties independent of corpus order. Conflicting exact matches fail closed.
    """
    if not isinstance(question, str) or not tokens(question) or len(question) > MAX_QUESTION_CHARS:
        raise ValueError('Question must contain words and be at most 500 characters')
    for name, value, ceiling in [('top_k', top_k, 20), ('max_chars', max_chars, 20000)]:
        if type(value) is not int or not 1 <= value <= ceiling:
            raise ValueError(f'{name} must be an integer from 1 to {ceiling}')
    validate_documents(documents)
    query = tokens(question)
    query_set = set(query)
    ranked = []
    for doc in documents:
        for entry in doc['entries']:
            variants = [tokens(q) for q in entry['questions']]
            exact = query in variants
            score = max(Fraction(len(query_set & set(v)), len(query_set | set(v))) for v in variants)
            if not score:
                continue
            # The public excerpt is both the answer and its complete source label.
            excerpt = f"{doc['title']} / {entry['section']}\n{entry['answer']}"
            ranked.append({'document_id': doc['id'], 'title': doc['title'],
                           'section': entry['section'], 'excerpt': excerpt,
                           'answer': entry['answer'], 'exact': exact, 'score': score})
    ranked.sort(key=lambda r: (-r['exact'], -r['score'], r['document_id'], r['section']))
    exact_matches = [r for r in ranked if r['exact']]
    sources, used = [], 0
    for row in ranked:
        if len(sources) < top_k and used + len(row['excerpt']) <= max_chars:
            sources.append({k: row[k] for k in ('document_id', 'title', 'section', 'excerpt')})
            used += len(row['excerpt'])
    limited = len(sources) < len(ranked)
    result = {'status': 'unsupported', 'answer': None, 'answer_source': None,
              'sources': sources, 'retrieval_limited': limited}
    # Check ambiguity across the full corpus, even if the budget hides a conflict.
    if len(exact_matches) > 1:
        result['status'] = 'ambiguous'
    elif exact_matches:
        match = exact_matches[0]
        citation = {'document_id': match['document_id'], 'section': match['section']}
        if any(s['document_id'] == citation['document_id'] and s['section'] == citation['section']
               for s in sources):
            result.update(status='answered', answer=match['answer'], answer_source=citation)
        else:
            result['status'] = 'retrieval_limited'
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('question')
    parser.add_argument('--documents', type=Path, default=DEFAULT_DOCUMENTS)
    parser.add_argument('--top-k', type=int, default=3)
    parser.add_argument('--max-chars', type=int, default=2000)
    args = parser.parse_args(argv)
    try:
        result = retrieve(args.question, load_documents(args.documents),
                          top_k=args.top_k, max_chars=args.max_chars)
    except (OSError, UnicodeError, ValueError) as exc:
        # Do not echo malformed documents, paths or arbitrary input into public logs.
        print(json.dumps({'status': 'invalid_input', 'error_type': type(exc).__name__}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
