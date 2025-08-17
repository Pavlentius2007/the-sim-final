declare module 'translate-google-api' {
  interface TranslateOptions {
    from?: string
    to?: string
    tld?: string
    timeout?: number
  }

  function translate(
    text: string | string[],
    options?: TranslateOptions
  ): Promise<string[][]>

  export { translate }
} 