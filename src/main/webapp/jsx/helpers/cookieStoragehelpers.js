export function setCookie(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  
    let cookieValue = encodeURIComponent(name) + "=";
  
    // If the value is not a string, stringify it as JSON
    if (typeof value !== 'string') {
      cookieValue += encodeURIComponent(JSON.stringify(value));
    } else {
      cookieValue += encodeURIComponent(value);
    }
  
    cookieValue += ";expires=" + expirationDate.toUTCString() + ";path=/";
  
    document.cookie = cookieValue;
}
  
  export function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
  
      if (cookie.indexOf(name + "=") === 0) {
        const cookieValue = cookie.substring(name.length + 1, cookie.length);
        
        // Check if the value is JSON and parse it if necessary
        try {
          return JSON.parse(decodeURIComponent(cookieValue));
        } catch (error) {
          // If it's not valid JSON, return the raw value
          return decodeURIComponent(cookieValue);
        }
      }
    }
  
    return null;
}
  
