// __MG_Native.fetch: a request through the app, its server needs no CORS
// headers. The site gets the response as if it made the request itself
export const FETCH_SCRIPT = `
  // FileReader gives a data URL, base64 is the part after the comma
  const readAsBase64 = blob =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const toBytes = base64 =>
    Uint8Array.from(atob(base64), char => char.charCodeAt(0));

  // Like fetch itself: a failed request is a TypeError, an HTTP error is a
  // response with its own status
  const toResponse = result => {
    if (!result.resolve) {
      throw new TypeError('Network request failed: ' + result.body);
    }
    const response = new Response(result.body ? toBytes(result.body) : null, {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
    });
    // The Response created here has no url, but the site may read where it was
    // redirected
    Object.defineProperty(response, 'url', { value: result.url });
    return response;
  };

  // Request encodes the body (a form with a boundary, a file) and sets its
  // Content-Type like the browser does. The app sends these bytes and headers
  // as is
  bridge.fetch = async (input, init) => {
    const request = new Request(input, init);
    const body = await request.blob();
    const result = await callApp(
      'FETCH',
      {
        url: request.url,
        options: {
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          // By default, 'same-origin' does not send cookies to other origins
          credentials: request.credentials === 'include' ? 'include' : 'omit',
          body: body.size ? await readAsBase64(body) : undefined,
        },
      },
      request.signal,
    );
    return toResponse(result);
  };
`;
