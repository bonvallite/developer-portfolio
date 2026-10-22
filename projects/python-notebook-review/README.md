# Python notebooks: learning progression and technical review

A portfolio-safe overview of four original Jupyter notebooks, with no raw notebook or organisational data copied.

- **Python essentials**: variables, type conversion, string methods, formatted output and inputs.
- **Day 2**: maths, conditionals, iteration, dictionaries, lists and sets. Some example output comments are stale.
- **Day 3**: functions, return values, scopes and recursion. Add handling for factorial(0), negative values and countdown bounds.
- **Day 4**: OOP, CSV inventory, Hugging Face sentiment analysis and two FAQ assistant prototypes.

## Technical findings

- One Day 4 notebook cell uses shell-style `pip install transformers torch` where Jupyter `%pip install transformers torch` is needed.
- Its document-question-answering pipeline specifies a text SQuAD model; use a compatible question-answering pipeline when passing `question` and `context`.
- Its GPT-2 FAQ prototype only injects the first 1,000 characters of the assembled knowledge base. It is not a reliable, source-grounded retrieval-augmented generation system.
- Class definitions are repeated and error handling should be improved.
- Dependency versions, automated tests and anonymised fixture data are needed for reliable public examples.

This review used static inspection. No claim is made that all notebooks or downloaded AI models were run. Raw source and underlying CSVs remain private.

## Independent follow-on demonstration

[Offline fictional FAQ retrieval](../fictional-faq-retrieval) is a new, independently authored Python CLI, not a copy or runnable export of these notebooks. It uses fictional documents, full-corpus deterministic retrieval, verbatim answers and document/section attribution, with explicit unsupported, ambiguous and budget-limited outcomes. Its automated tests require only the Python standard library. The project README explains the architecture, limitations and differences from the experiments above. These review notes remain static findings, not evidence that the original prototypes were repaired or executed.
