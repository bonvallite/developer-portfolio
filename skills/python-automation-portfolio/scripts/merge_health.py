"""Local-only CSV merger for Samsung Health; never upload personal records."""
import argparse
from pathlib import Path
import pandas as pd

def merge(source_dir: Path, output_file: Path):
    frames = []
    errors = []
    for path in sorted(source_dir.glob("com.samsung.*.csv")):
        if path.resolve() == output_file.resolve():
            continue
        try:
            with path.open(encoding="utf-8-sig") as f:
                first_line = f.readline().strip()
            skiprows = 1 if first_line.startswith("com.samsung.") and "," not in first_line else 0
            frame = pd.read_csv(path, skiprows=skiprows, encoding="utf-8-sig", low_memory=False)
            frame = frame.dropna(axis=0, how="all").dropna(axis=1, how="all")
            if frame.empty:
                raise ValueError("Empty data")
            frame.insert(0, "Merge_Source_File", path.name)
            frames.append(frame)
        except (OSError, ValueError, UnicodeError, pd.errors.ParserError) as err:
            errors.append({"file": path.name, "error": str(err)})
    if not frames:
        raise ValueError("No usable Samsung CSVs found")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    combined = pd.concat(frames, ignore_index=True, sort=False)
    combined.to_csv(output_file, index=False, encoding="utf-8-sig")
    pd.DataFrame(errors, columns=["file", "error"]).to_csv(output_file.with_name(output_file.stem + "_errors.csv"), index=False)
    return len(frames), len(combined)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    print("Merged files and rows:", merge(args.input, args.output))
