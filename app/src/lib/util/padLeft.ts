export function padLeft(str: string, n: number, pad: string = " ") {
    return str.length >= n ? str : pad.repeat(Math.ceil((n - str.length) / pad.length)) + str
}
