# Offline fictional FAQ retrieval

An independently authored, runnable Python demonstration for the fictional **Cloudberry Moon Library**. All documents, policies and example questions were invented for this project. No private notebook code, datasets, customer records or employer policies were copied or adapted. This is a retrieval exercise, not an AI service or a production assistant.

## Run locally

Use Python 3.12+ from the repository root. No installation, credentials, network access, external AI service or model download is required. `requirements.txt` deliberately contains no third-party dependencies.

```sh
python3 projects/fictional-faq-retrieval/faq.py 'When is the moon library open?'
python3 projects/fictional-faq-retrieval/faq.py 'Is the moon library open on Sunday?'
python3 projects/fictional-faq-retrieval/faq.py 'When is the moon library open?' --max-chars 20
python3 -m unittest discover -s tests/python -p test_faq_retrieval.py -v
# Equivalent focused suite:
npm run test:faq
```

The first command returns `answered`, the verbatim fictional opening-hours answer, and `answer_source: {"document_id": "cloudberry-handbook", "section": "opening-hours"}`. The second returns `unsupported` and a null answer even though related sources may be suggested. The third returns `retrieval_limited` and a null answer because the complete evidence cannot fit. Non-answer outcomes are valid results (exit 0); invalid input, unreadable files and malformed JSON produce a minimal `invalid_input` JSON error on stderr and exit 2. Argparse usage errors also exit 2.

## Architecture and contract

1. Load local UTF-8 `documents.json` and validate the entire schema. IDs must be unique; sections are unique within each document. Missing or blank answers, malformed records and invalid question aliases fail validation rather than disappearing silently. An empty corpus is valid and cannot answer a question.
2. Normalise the question and curated aliases to ordered Unicode word tokens with case folding. Punctuation and case are ignored; word order and negation remain significant. Input is limited to 500 characters.
3. Search **every entry**, without concatenating or cutting off the knowledge base. Rank exact normalised alias matches first, then the maximum Jaccard overlap between question-token sets and each alias. Exact rational scores avoid floating-point tie differences. Document ID and section break ties, independently of input order. Zero-overlap entries are omitted.
4. Select whole excerpts (title, section, newline and complete answer) within `top_k` (default 3, range 1–20) and `max_chars` (default 2,000, range 1–20,000). Oversized entries are skipped without truncation; smaller later entries may still fit. Character counts use Python string length, not model tokens, bytes or JSON encoding size. `retrieval_limited` indicates that some ranked candidates were omitted.
5. Return an answer **only** for a single exact normalised question/alias match whose complete excerpt was selected. Keyword similarity alone never authorises an answer. The answer is copied verbatim from that entry, with a document ID and section that resolve to a returned source. Related `sources` are navigation suggestions, not citations supporting an otherwise unsupported answer.

| Status | Meaning |
| --- | --- |
| `answered` | One curated question matched and its whole evidence fitted. |
| `unsupported` | No curated question matched; `answer` and `answer_source` are null. |
| `retrieval_limited` | A unique match exists but its whole evidence did not fit. |
| `ambiguous` | Multiple entries match the question; no answer is selected, even when a budget hides a conflicting entry. |

The boolean `retrieval_limited` field is independent of status: an answered question can still have omitted related candidates. Ambiguity is checked over the full corpus, conservatively including duplicate matching entries even if their answers agree. Sources contain the exact authored title and excerpt, never invented URLs.

## Differences from the notebook experiments

| Reviewed limitation | Demonstrated engineering choice |
| --- | --- |
| First 1,000 characters supplied to GPT-2 | Search all structured FAQ entries first, then apply explicit limits to complete retrieved evidence. Regression test finds a later document after more than 1,000 characters of preceding text. |
| Incompatible document-QA model and pipeline | No model or pipeline: Python standard-library retrieval and verbatim answer selection. This avoids the dependency mismatch rather than repairing that notebook. |
| No reliable source-grounded retrieval | Deterministic ranked records, resolvable document/section attribution and explicit abstention. |
| Missing reproducibility controls | Fictional committed fixtures, documented Python version, no third-party FAQ requirements, unittest coverage and existing repository CI integration. |

See the [original static review](../python-notebook-review) for context. This project does not claim to execute, reproduce or fix the private notebooks and does not benchmark GPT-2 or any other model.

## Tests and limitations

[The automated suite](../../tests/python/test_faq_retrieval.py) covers verbatim answer attribution, aliases, missing answers, lexical false positives, negation, empty corpora, deterministic ties, result counts, exact character-budget boundaries, late-document retrieval, hidden conflicts, malformed questions/limits/documents, malformed JSON, missing files and CLI output. It runs with the existing CSV-merger suite in CI; `npm run test:python` additionally needs the merger's Pandas requirements. The focused FAQ suite needs only the standard library.

This intentionally conservative method cannot understand arbitrary paraphrases, infer facts, combine multiple sources, reconcile conflicting policies or answer new questions from incidental answer text. Curated aliases need human review. Lexical suggestions can be irrelevant. Punctuation normalisation can collapse distinctions, and source attribution proves provenance, not factual correctness. Full scans are suitable for small authored corpora; there is no large-corpus performance guarantee, streaming ingestion, upload interface or untrusted-document resource sandbox. Retrieval budgets bound returned excerpts, not corpus file size or processing work. A production assistant would need stronger ingestion controls, versioned sources, evaluation and a deliberate semantic retrieval design.

The [Python automation page](../../app/python-automation/page.tsx), [repository README](../../README.md#python-automation) and [portfolio index](../../PORTFOLIO_INDEX.md) link this demonstration. It runs locally; the portfolio page does not execute Python on the hosting platform.
