export const isCodeLike = (text?: string) => {
    if (!text) return false
    const codeIndicators = ['`', 'function ', 'const ', 'let ', 'var ', 'def ', 'class ', '=>', ';', '{', '}']
    const hasNewline = text.includes('\n')
    const indicators = codeIndicators.some((k) => text.includes(k))
    return hasNewline || indicators
}

export const getLogoName = (logo?: string) => {
    if (!logo) return null
    const parts = logo.split(':')
    return parts.length > 1 ? parts[1] : parts[0]
}

export const getLogoFilename = (logo?: string) => {
    const name = getLogoName(logo)

    if (!name) return null
    return name.replaceAll(/[^a-z0-9_-]/gi, '').toLowerCase()
}
