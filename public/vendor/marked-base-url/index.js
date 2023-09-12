export function baseUrl(base) {
  // extension code here

  base = base.trim().replace(/\/+$/, '/'); // if multiple '/' at the end, just keep one
  const reIsAbsolute = /^[\w+]+:\/\//;
  const isBaseAbsolute = reIsAbsolute.test(base);
  const dummyUrl = 'http://__dummy__';
  const dummyBaseUrl = new URL(base, dummyUrl);
  const dummyUrlLength = dummyUrl.length + (base.startsWith('/') ? 0 : 1);

  return {
    walkTokens(token) {
      if (!['link', 'image'].includes(token.type)) {
        return;
      }

      if (reIsAbsolute.test(token.href)) {
        // the URL is absolute, do not touch it
        return;
      }

      if (isBaseAbsolute) {
        try {
          token.href = new URL(token.href, base).href;
        } catch (e) {
          // ignore
        }
      } else {
        // base is not absolute
        if (token.href.startsWith('/')) {
          // the URL is from root
          return;
        }
        try {
          const temp = new URL(token.href, dummyBaseUrl).href;
          token.href = temp.slice(dummyUrlLength);
        } catch (e) {
          // ignore
        }
      }
    }
  };
}
