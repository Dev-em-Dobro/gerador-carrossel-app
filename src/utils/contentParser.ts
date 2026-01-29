import { isCodeLike } from "./logoUtils"

export interface ParsedContent {
    text: string
    code?: string
}

function processEscapeSequences(str: string): string {
    return str
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\r/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
}

function normalizeIndentation(code: string): string {
    const lines = code.split('\n')
    const nonEmptyLines = lines.filter(line => line.trim().length > 0)

    if (nonEmptyLines.length === 0) return code

    const minIndent = Math.min(
        ...nonEmptyLines.map(line => {
            const match = line.match(/^(\s*)/)
            return match ? match[1].length : 0
        })
    )

    return lines
        .map(line => line.substring(minIndent))
        .join('\n')
        .trim()
}

export function parseContentWithCode(content: string): ParsedContent {
  const processed = processEscapeSequences(content);

  // 1. Bloco markdown ``` ```
  const mdMatch = processed.match(/```([\s\S]*?)```/);
  if (mdMatch) {
    const code = normalizeIndentation(mdMatch[1]);
    const text = processed.replace(mdMatch[0], "").trim();
    return { text, code };
  }

  // 2. Padrão Exemplo:
  const exampleIndex = processed.toLowerCase().indexOf("exemplo:");
  if (exampleIndex !== -1) {
    const text = processed.slice(0, exampleIndex).trim();
    const code = normalizeIndentation(processed.slice(exampleIndex + 8).trim());
    return { text, code };
  }

  // 3. Detecção automática de código (NOVA PARTE 🔥)
  if (isCodeLike(processed)) {
    const lines = processed.split("\n");

    // tenta separar texto de código
    const codeStart = lines.findIndex(
      (line) =>
        line.includes("{") ||
        line.includes("const ") ||
        line.includes("function ") ||
        line.includes("=>"),
    );

    if (codeStart !== -1) {
      const text = lines.slice(0, codeStart).join("\n").trim();
      const code = normalizeIndentation(lines.slice(codeStart).join("\n"));

      return { text, code };
    }

    // se não achar separação clara, tudo vira código
    return { text: "", code: normalizeIndentation(processed) };
  }

  return { text: processed };
}

