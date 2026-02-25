/**
 * Preprocesses raw Markdown content to insert appropriate newlines,
 * ensuring proper spacing without relying on external plugins like remark-breaks.
 *
 * Rules:
 * - Code blocks: Keep inner newlines intact.
 * - Tables: Ensure single newline between rows.
 * - Lists: Ensure single newline between items.
 * - Headings: Ensure single newline.
 * - Normal paragraphs: Add double newlines for proper spacing.
 */
export function preprocessMarkdownContent(rawMarkdown: string): string {
    if (!rawMarkdown) return '';

    const lines = rawMarkdown.split('\n');
    const processedLines: string[] = [];

    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Toggle code block state
        if (trimmedLine.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            processedLines.push(line);
            continue;
        }

        if (inCodeBlock) {
            // Inside code block: preserve exact formatting
            processedLines.push(line);
            continue;
        }

        if (trimmedLine === '') {
            // Preserve empty lines
            processedLines.push('');
            continue;
        }

        // Logic for tables, lists, blockquotes, and headings
        const isTable = trimmedLine.startsWith('|');
        const isList = /^(?:[-*+]|\d+\.)\s/.test(trimmedLine);
        const isHeading = trimmedLine.startsWith('#');
        const isBlockquote = trimmedLine.startsWith('>');
        const isHTML = trimmedLine.startsWith('<') && trimmedLine.endsWith('>');

        if (isTable || isList || isHeading || isBlockquote || isHTML) {
            // Single newline for structural elements to keep them grouped
            processedLines.push(line);
        } else {
            // For normal textual paragraphs, add a double newline (Markdown paragraph break)
            // But only if the next line isn't empty and isn't a structural element
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
                // We add an empty line to force a paragraph break in standard markdown
                processedLines.push('');
            }
        }
    }

    return processedLines.join('\n');
}
