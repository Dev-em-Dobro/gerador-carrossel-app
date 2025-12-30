export function parseTopics(input: string, max = 3): string[] {
    if (!input) return []
    return input
        .split(',')
        .map(t => t.trim())
        .filter((t, i, a) => t.length > 0 && a.indexOf(t) === i)
        .slice(0, max)
}

export default parseTopics
