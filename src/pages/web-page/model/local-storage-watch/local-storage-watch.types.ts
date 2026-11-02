export type LocalStorageKeyMessage = {
  cmd: 'LOCAL_STORAGE_KEY';
  args: { hasValue: boolean };
};
