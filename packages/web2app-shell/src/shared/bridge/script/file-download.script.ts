// WebView не может скачать файл, созданный сайтом в браузере, поэтому его
// сохраняет приложение и открывает в системном просмотрщике
export const FILE_DOWNLOAD_SCRIPT = `
  // Сайты часто отзывают blob URL сразу после клика, поэтому каждый blob
  // сохраняется с момента создания его URL
  const blobs = new Map();
  const { createObjectURL, revokeObjectURL } = URL;

  URL.createObjectURL = object => {
    const url = createObjectURL.call(URL, object);
    if (object instanceof Blob) {
      blobs.set(url, object);
    }
    return url;
  };
  URL.revokeObjectURL = url => {
    blobs.delete(url);
    revokeObjectURL.call(URL, url);
  };

  // Возвращает true, если ссылка скачивает сохранённый blob: его берёт
  // приложение
  const interceptDownload = anchor => {
    const blob = anchor && anchor.hasAttribute('download') && blobs.get(anchor.href);
    if (!blob) {
      return false;
    }
    const fileName = anchor.getAttribute('download') || 'download';
    readAsBase64(blob).then(base64 => {
      post({
        cmd: 'DOWNLOAD_FILE',
        args: { fileName, mimeType: blob.type, base64 },
      });
    });
    return true;
  };

  // Сайты скачивают и через link.click(), часто на ссылке вне документа,
  // и по ссылке, которую нажимает пользователь
  const anchorClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (!interceptDownload(this)) {
      anchorClick.call(this);
    }
  };
  document.addEventListener(
    'click',
    event => {
      const anchor = event.target instanceof Element && event.target.closest('a');
      if (interceptDownload(anchor)) {
        event.preventDefault();
      }
    },
    true,
  );
`;
