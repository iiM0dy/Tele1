import json
import sys

def fix_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to parse it. If it fails, it might be due to the missing comma.
    try:
        data = json.loads(content)
        print(f"{file_path} is valid JSON")
    except json.JSONDecodeError as e:
        print(f"{file_path} is invalid: {e}")
        # Very specific fix for the commas I might have missed
        # Replace '}\n        "fixNames"' with '},\n        "fixNames"'
        content = content.replace('}\n        "fixNames"', '},\n        "fixNames"')
        try:
            data = json.loads(content)
            print(f"Fixed {file_path}")
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
        except Exception as e2:
            print(f"Failed to fix {file_path}: {e2}")

if __name__ == "__main__":
    fix_json(sys.argv[1])
