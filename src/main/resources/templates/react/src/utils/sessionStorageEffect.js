export const sessionStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = sessionStorage.getItem(key);
    //console.log(savedValue, '세션');
    // console.log(savedValue);
    if (savedValue !== null && savedValue !== undefined && savedValue !== 'undefined') {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue) => {
      sessionStorage.setItem(key, JSON.stringify(newValue));
    });
  };
