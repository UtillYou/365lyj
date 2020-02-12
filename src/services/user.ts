import request, { get } from '@/utils/request';


export async function accountLogin(params: LoginParamsType) {
  return request('/api/auth/token', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile: string) {
  return request(`/api/messages/code?phone=${mobile}`,{
    method: 'POST',
    data: {phone:mobile},
  });
}

export async function register(params: UserRegisterParams) {
  return request('/api/auth/register', {
    method: 'POST',
    data: params,
  });
}

export async function validateUsernameUnique(username: string) {
  return request(`/api/users/username/${username}`);
}

export async function validatePhoneUnique(phone: string) {
  return request(`/api/users/phone/${phone}`);
}

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(username:string): Promise<any> {
  return get(`/api/users/username/${username}`);
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
