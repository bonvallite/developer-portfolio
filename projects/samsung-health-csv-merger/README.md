# Samsung Health CSV Merger

A Python/Pandas automation project demonstrating multi-file ingestion, conservative detection of Samsung export title rows, error reporting and source provenance.

## Run

Python 3.10+:

```bash
pip install "pandas>=2,<3"
python merge_samsung_health.py --input /path/to/private/samsung-export --output /path/to/private/Samsung_Health_Fixed_Master.csv
```

Outputs a master CSV and a separate `*_report.csv` ingestion report. This is a union of different source schemas, **not** a clinically valid time-series join. Verify headers for each export version. Do not commit real health exports or report outputs. This repository includes no real personal or medical data.

## Related Python learning

The owner's Jupyter training covered variables, loops, functions, object-oriented programming, CSV processing, sentiment classification and FAQ chatbots. Raw notebooks are intentionally **not** published because they include personal details and potentially organisation-specific material. See [review notes](../python-notebook-review/README.md).
