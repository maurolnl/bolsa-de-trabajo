export const getCookie = (key: string) => {
  const name = `${key}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const setCookie = (key: string, value: string, expiresTime = 0) => {
  let expires = "";

  if (expiresTime) {
    const expireDate = new Date(expiresTime);
    expires = `; expires=${expireDate.toUTCString()}`;
  }

  document.cookie = `${key}=${value}${expires}; path=/`;
};

export const removeCookie = (key: string) => {
  setCookie(key, "", -1);
};

export const cookies = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  i18next: "i18next",
};
