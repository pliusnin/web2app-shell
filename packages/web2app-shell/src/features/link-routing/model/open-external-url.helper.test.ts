import { Alert, Linking } from 'react-native';

import { TEXTS } from '../../../shared/config';
import { openExternalUrlHelper } from './open-external-url.helper';

const URL = 'tel:+123456789';

// Хелпер не возвращает свой промис, поэтому тест ждёт, пока цепочка завершится
const flushPromises = () =>
  new Promise<void>(resolve => setTimeout(() => resolve(), 0));

// В типах RN Promise<void>, но нативный модуль резолвит, открылся ли URL
const openURL = Linking.openURL as unknown as jest.Mock<
  Promise<boolean>,
  [string]
>;

describe('openExternalUrlHelper', () => {
  let alert: jest.SpiedFunction<typeof Alert.alert>;

  beforeEach(() => {
    alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    openURL.mockReset();
  });

  it('opens the URL outside the app without an alert', async () => {
    openURL.mockResolvedValueOnce(true);

    openExternalUrlHelper(URL);
    await flushPromises();

    expect(openURL).toHaveBeenCalledWith(URL);
    expect(alert).not.toHaveBeenCalled();
  });

  it('shows an alert when no app opened the URL', async () => {
    openURL.mockResolvedValueOnce(false);

    openExternalUrlHelper(URL);
    await flushPromises();

    expect(alert).toHaveBeenCalledWith(
      TEXTS.cantOpenLinkTitle,
      TEXTS.cantOpenLinkMessage,
    );
  });

  it('shows an alert when opening the URL fails', async () => {
    openURL.mockRejectedValueOnce(new Error('No activity found'));

    openExternalUrlHelper(URL);
    await flushPromises();

    expect(alert).toHaveBeenCalledWith(
      TEXTS.cantOpenLinkTitle,
      TEXTS.cantOpenLinkMessage,
    );
  });
});
