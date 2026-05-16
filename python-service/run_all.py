#!/usr/bin/env python3
"""Master runner — generates all articles in sequence. Skips existing files.
  1. guides (zh)  2. compares (zh)  3. guides (en)  4. compares (en)
"""
import subprocess
import sys
from pathlib import Path

STEPS = [
    ("guides-zh", ["python", "generate_guide.py"]),
    ("compares-zh", ["python", "generate_compare.py"]),
    ("guides-en", ["python", "generate_guide.py", "--lang=en"]),
    ("compares-en", ["python", "generate_compare.py", "--lang=en"]),
]

HERE = Path(__file__).resolve().parent


def run_step(name, args):
    print(f"\n{'='*60}")
    print(f"  STEP: {name}")
    print(f"{'='*60}")
    result = subprocess.run(args, cwd=str(HERE))
    if result.returncode != 0:
        print(f"  {name} exited with code {result.returncode}")
        return False
    print(f"  {name} completed OK")
    return True


def main():
    for name, args in STEPS:
        if not run_step(name, args):
            print(f"Aborting after {name} failure")
            sys.exit(1)
    print("\n" + "=" * 60)
    print("  ALL DONE — guides + compares in zh + en")
    print("=" * 60)


if __name__ == "__main__":
    main()
