interface UserRegisterParams {
    code: string;
    password: string;
    username: string;
    phone: string;
  }


  interface LoginParamsType {
    username?: string;
    password?: string;
    phone?: string;
    code?: string;
    type:string;
  }