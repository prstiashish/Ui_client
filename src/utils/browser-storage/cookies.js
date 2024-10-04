import Cookies from 'js-cookie';

class CookiesService {
  // Get item from cookies by key
  getItem(key) {
    const value = Cookies.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Set item in cookies with a meaningful cookie name
  setItem(cookieName, value, options = { expires: 7 }) { // Default expiration is 7 days
    Cookies.set(cookieName, JSON.stringify(value), options);
  }

  // Remove item from cookies by key
  removeItem(cookieName) {
    Cookies.remove(cookieName);
  }

  // Append an item to an array stored in cookies by key
  appendItem(cookieName, value) {
    let storedValue = this.getItem(cookieName) || [];
    storedValue = [...storedValue, value];
    this.setItem(cookieName, storedValue);
  }

  // Clear all cookies (optional method)
  clear() {
    const allCookies = Cookies.get(); // Get all cookies
    Object.keys(allCookies).forEach((cookieKey) => Cookies.remove(cookieKey)); // Remove each cookie
  }
}

export default CookiesService;






// import Cookies from 'js-cookie';

// class CookiesService {
//   getItem(key) {
//     const value = Cookies.get(key);
//     return value ? JSON.parse(value) : null; // Parse JSON if exists
//   }

//   setItem(key, value) {
//     Cookies.set(key, JSON.stringify(value)); // Store JSON string
//   }

//   removeItem(key) {
//     Cookies.remove(key); // Remove cookie
//   }

//   appendItem(key, value) {
//     const existingValues = this.getItem(key) || []; // Get existing values
//     const newValue = [...existingValues, value]; // Append new value
//     this.setItem(key, newValue); // Set updated values
//   }

//   clear() {
//     // Note: Cookies don't have a clear method like local/session storage
//     // You can remove specific cookies or clear them by their name
//     const allCookies = Cookies.get();
//     for (const cookie in allCookies) {
//       Cookies.remove(cookie);
//     }
//   }
// }

// export default CookiesService;
