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
