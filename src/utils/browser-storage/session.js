class SessionStorageService {
  getItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  setItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key) {
    sessionStorage.removeItem(key);
  }

  appendItem(key, value) {
    let _value = sessionStorage.getItem(key) || [];
    _value = [..._value, value];
    sessionStorage.setItem(key, _value);
  }

  clear() {
    sessionStorage.clear();
  }
}

export default SessionStorageService;
