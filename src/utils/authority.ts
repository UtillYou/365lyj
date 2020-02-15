import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}


let innerToken:string;

export function setToken(token: string): void {
  innerToken = token;
  sessionStorage.setItem('token', token);
}

export function getToken(): (string | undefined) {
  if (innerToken) {
    return innerToken;
  }
  return sessionStorage.getItem('token') || undefined;
}

export function setMenus(menus: any): void {
  sessionStorage.setItem('menus', menus);
}

export function getMenus(): (string | undefined) {
  return sessionStorage.getItem('menus') || undefined;
}