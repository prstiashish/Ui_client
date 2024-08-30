class LocalStorageService {
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  setItem(key, value) {
    JSON.stringify(localStorage.setItem(key, value));
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  appendItem(key, value) {
    let _value = localStorage.getItem(key) || [];
    _value = [..._value, value];
    localStorage.setItem(key, _value);
  }

  clear() {
    localStorage.clear();
  }
}

export default LocalStorageService;
