"""Merge local Samsung Health CSV exports. Never commit personal health exports."""
import argparse
from pathlib import Path
import pandas as pd

def merge(input_dir: Path, output: Path):
    sources = sorted(input_dir.glob("com.samsung.*.csv"))
    report_path = output.with_name(output.stem + "_report.csv")
    own_files = {output.resolve(), report_path.resolve()}  # never read our own output back in
    frames, report = [], []
    for path in sources:
        if path.resolve() in own_files:
            continue
        try:
            with path.open(encoding="utf-8-sig") as stream:
                first = stream.readline().strip()
            skip = 1 if first.startswith("com.samsung.") and "," not in first else 0
            df = pd.read_csv(path, skiprows=skip, encoding="utf-8-sig", low_memory=False)
            df = df.dropna(how="all").dropna(axis=1, how="all")
            if df.empty:
                raise ValueError("No records")
            df.insert(0, "Merge_Source", path.name)
            frames.append(df)
            report.append((path.name, "ok", len(df), ""))
        except (OSError, UnicodeError, ValueError, pd.errors.ParserError) as exc:
            report.append((path.name, "failed", 0, str(exc)))
    output.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(report, columns=["file", "status", "rows", "error"]).to_csv(report_path, index=False)
    if not frames:
        raise RuntimeError("No valid Samsung Health CSV exports found")
    pd.concat(frames, ignore_index=True, sort=False).to_csv(output, index=False, encoding="utf-8-sig")
    return len(frames)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("Samsung_Health_Fixed_Master.csv"))
    args = parser.parse_args()
    print(f"Merged {merge(args.input, args.output)} CSV files.")
