"""Tests for the Samsung Health CSV merger, using small synthetic CSV files.

No real health export is used or committed. Run from the repository root:
    python -m unittest discover -s tests/python
"""
import importlib.util
import tempfile
import unittest
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "projects" / "samsung-health-csv-merger" / "merge_samsung_health.py"
SKILL_COPY = ROOT / "skills" / "python-automation-portfolio" / "scripts" / "merge_health.py"

spec = importlib.util.spec_from_file_location("merge_samsung_health", SCRIPT)
merger = importlib.util.module_from_spec(spec)
spec.loader.exec_module(merger)


class MergeSamsungHealthTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def write(self, name, text):
        (self.dir / name).write_text(text, encoding="utf-8")

    def test_merges_files_and_skips_the_samsung_title_row(self):
        # Samsung exports often start with a title line such as "com.samsung.health.step_count.1".
        self.write("com.samsung.health.step_count.csv", "com.samsung.health.step_count.1\nday,count\n2026-01-01,1000\n2026-01-02,2000\n")
        self.write("com.samsung.health.sleep.csv", "start,end\n22:00,06:00\n")
        output = self.dir / "out" / "master.csv"

        self.assertEqual(merger.merge(self.dir, output), 2)
        merged = pd.read_csv(output, encoding="utf-8-sig")
        self.assertEqual(len(merged), 3)
        self.assertEqual(merged.columns[0], "Merge_Source")
        self.assertIn("count", merged.columns)  # header read correctly, not the title line
        self.assertEqual(sorted(merged["Merge_Source"].unique()), ["com.samsung.health.sleep.csv", "com.samsung.health.step_count.csv"])

    def test_reports_failed_files_without_stopping(self):
        self.write("com.samsung.health.good.csv", "a,b\n1,2\n")
        self.write("com.samsung.health.empty.csv", "a,b\n,\n")
        self.write("notes.csv", "ignored,file\n1,2\n")  # not a Samsung export name
        output = self.dir / "master.csv"

        self.assertEqual(merger.merge(self.dir, output), 1)
        report = pd.read_csv(self.dir / "master_report.csv")
        statuses = dict(zip(report["file"], report["status"]))
        self.assertEqual(statuses, {"com.samsung.health.empty.csv": "failed", "com.samsung.health.good.csv": "ok"})

    def test_never_reads_its_own_output_back_in(self):
        self.write("com.samsung.health.good.csv", "a\n1\n")
        output = self.dir / "com.samsung.merged.csv"  # matches the input pattern on purpose
        merger.merge(self.dir, output)
        self.assertEqual(merger.merge(self.dir, output), 1)
        self.assertEqual(len(pd.read_csv(output, encoding="utf-8-sig")), 1)

    def test_raises_when_nothing_valid_is_found(self):
        with self.assertRaises(RuntimeError):
            merger.merge(self.dir, self.dir / "master.csv")

    def test_skill_copy_matches_the_project_script(self):
        self.assertEqual(SKILL_COPY.read_text(encoding="utf-8"), SCRIPT.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
