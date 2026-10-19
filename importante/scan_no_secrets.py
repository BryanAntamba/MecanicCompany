import os
import re
import json
from pathlib import Path

class OWASPScanner:

    def __init__(self, path):
        self.path = Path(path)
        self.issues = []

    def add(self, owasp, file, line, issue, fix):
        self.issues.append({
            "owasp": owasp,
            "file": str(file),
            "line": line,
            "issue": issue,
            "fix": fix
        })

    def scan_file(self, file_path):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()

            for i, line in enumerate(lines, 1):

                # XSS
                if "dangerouslySetInnerHTML" in line:
                    self.add(
                        "A03 - XSS",
                        file_path, i,
                        "Uso inseguro de HTML dinamico",
                        "Usar DOMPurify o evitar HTML directo"
                    )

                # Injection
                if "eval(" in line:
                    self.add(
                        "A03 - Injection",
                        file_path, i,
                        "Uso de eval() peligroso",
                        "Eliminar eval() o usar JSON.parse"
                    )

                # HTTP inseguro
                if "http://" in line:
                    self.add(
                        "A02 - Crypto Failure",
                        file_path, i,
                        "Uso de HTTP inseguro",
                        "Cambiar a HTTPS"
                    )

                # localStorage tokens
                if "localStorage" in line and "token" in line:
                    self.add(
                        "A01 - Access Control",
                        file_path, i,
                        "Token almacenado en localStorage",
                        "Usar cookies HttpOnly"
                    )

        except Exception as e:
            print("Error:", file_path, e)

    def scan(self):
        for root, _, files in os.walk(self.path):
            if "node_modules" in root or ".git" in root:
                continue
            for file in files:
                if file.endswith((".js", ".jsx", ".ts", ".tsx")):
                    self.scan_file(Path(root) / file)

    def report(self):
        total = len(self.issues)
        types = {}
        for issue in self.issues:
            types[issue["owasp"]] = types.get(issue["owasp"], 0) + 1

        print("\n==============================")
        print(" OWASP SECURITY REPORT")
        print(" (sin deteccion de secrets/tokens)")
        print("==============================\n")
        print("TOTAL VULNERABILIDADES:", total)
        print("\nPOR TIPO:\n")
        for k, v in types.items():
            print(f"  - {k}: {v}")
        print("\nDETALLE:\n")
        for issue in self.issues:
            print(f"  [{issue['owasp']}] {issue['file']} (linea {issue['line']})")
            print(f"    Problema : {issue['issue']}")
            print(f"    Solucion : {issue['fix']}")
            print()

        # Guardar JSON
        result = {"total": total, "by_type": types, "issues": self.issues}
        with open("owasp_report.json", "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print("Reporte guardado en owasp_report.json")


if __name__ == "__main__":
    scanner = OWASPScanner(".")
    scanner.scan()
    scanner.report()
