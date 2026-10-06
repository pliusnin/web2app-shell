export const TEXTS = {
  retry: 'Retry',
  noConnectionTitle: 'No internet connection',
  noConnectionMessage:
    'Check your connection. The page will reload when the internet is back.',
  httpErrorTitle: 'Page could not be loaded',
  httpErrorMessage: (status: number) => `The server responded with ${status}.`,
  serverErrorToast: 'Something went wrong',
  serverErrorToastMessage: 'Please try again later',
  offlineToast: 'No internet connection',
  cantOpenLinkTitle: "Can't open the link",
  cantOpenLinkMessage: 'No app is installed to open it.',
};
