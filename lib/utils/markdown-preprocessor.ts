/**
 * rawのMarkdownコンテンツに適切な改行を挿入する前処理を行い、
 * remark-breaks のような外部プラグインに依存せずに適切な余白を確保します。
 *
 * ルール:
 * - コードブロック: 内部の改行をそのまま維持。
 * - テーブル: 行の間に単一の改行を確保。
 * - リスト: アイテム間に単一の改行を確保。
 * - 見出し: 単一の改行を確保。
 * - 通常の段落: 適切な余白のために二重の改行を追加。
 */
export function preprocessMarkdownContent(rawMarkdown: string): string {
    if (!rawMarkdown) return '';

    const lines = rawMarkdown.split('\n');
    const processedLines: string[] = [];

    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // コードブロックの状態を切り替え
        if (trimmedLine.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            processedLines.push(line);
            continue;
        }

        if (inCodeBlock) {
            // コードブロック内: 正確なフォーマットを維持
            processedLines.push(line);
            continue;
        }

        if (trimmedLine === '') {
            // 空行を維持
            processedLines.push('');
            continue;
        }

        // テーブル、リスト、引用、および見出しのロジック
        const isTable = trimmedLine.startsWith('|');
        const isList = /^(?:[-*+]|\d+\.)\s/.test(trimmedLine);
        const isHeading = trimmedLine.startsWith('#');
        const isBlockquote = trimmedLine.startsWith('>');
        const isHTML = trimmedLine.startsWith('<') && trimmedLine.endsWith('>');

        if (isTable || isList || isHeading || isBlockquote || isHTML) {
            // 構造的要素をグループ化しておくため単一の改行とする
            processedLines.push(line);
        } else {
            // 通常の段落の場合、二重の改行（Markdownの段落区切り）を追加
            // ただし、次の行が空行でなく、かつ構造的要素でない場合のみ
            processedLines.push(line);

            const nextLine = lines[i + 1]?.trim();
            if (
                nextLine !== undefined &&
                nextLine !== '' &&
                !nextLine.startsWith('|') &&
                !/^(?:[-*+]|\d+\.)\s/.test(nextLine) &&
                !nextLine.startsWith('#') &&
                !nextLine.startsWith('>') &&
                !nextLine.startsWith('```')
            ) {
                // 標準的なMarkdownで段落区切りを強制するために空行を追加
                processedLines.push('');
            }
        }
    }

    return processedLines.join('\n');
}
