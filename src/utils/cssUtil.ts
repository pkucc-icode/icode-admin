/** 工具函数：获取 CSS 变量的实际值（带缓存） */
const cssVariableCache = {} as Record<string, string>;

export function getCSSVariable(variable: string): string {
    if (typeof window === 'undefined') return '#FFFFFF'

    if (cssVariableCache[variable]) {
        return cssVariableCache[variable]
    }

    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    cssVariableCache[variable] = value
    return value
}