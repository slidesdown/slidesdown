declare module 'marked-base-url' {
  /**
   * prepend base url to the href attribute of 'link' and 'image'
   *
   * @param baseUrl Base Url
   * @return A MarkedExtension to be passed to `marked.use()`
   */
  export function baseUrl(
    baseUrl: string
  ): import('marked').MarkedExtension;
}
