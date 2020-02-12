import { Alert,message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { Link,router } from 'umi';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import LoginComponents from './components/Login';
import styles from './style.less';
import { ConnectState } from '@/models/connect';
import {accountLogin } from '@/services/user';
import { getPageQuery } from '@/utils/utils';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}
interface LoginState {
  type: string;
  submitting:boolean;
}

class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    submitting: false,
  };


  handleSubmit = async (err: unknown, values: any) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      this.setState({
        submitting:true
      });
      const payload:LoginParamsType = {
        code:values.captcha,
        username:values.userName,
        password:values.password,
        phone:values.mobile,
        type
      };
      const response = await accountLogin(payload);
      this.setState({
        submitting:false
      });
      if (response) {
        if (response.status === 200 ) {
          message.success(formatMessage({ id: 'user-login.result.success'}));
          
          dispatch({
            type: 'login/changeLoginStatus',
            payload: {
              status: 200,
              token: response.data.accessToken,
              userName:values.userName,
            },
          });
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }
          router.replace(redirect || '/');
        }else{
          message.error(response.msg);
        }
      }
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }
      this.loginForm.validateFields(
        ['mobile'],
        {},
        async (err: unknown, values: any) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch } = this.props;
            try {
              const success = await ((dispatch({
                type: 'login/getCaptcha',
                payload: values.mobile,
              }) as unknown) as Promise<unknown>);
              resolve(!!success);
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin = {}, } = this.props;
    const { status, type: loginType } = userLogin;
    const { type,submitting} = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'user-login.login.tab-login-credentials' })}>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
              )}
            <UserName
              name="userName"
              placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <Tab key="mobile" tab={formatMessage({ id: 'user-login.login.tab-login-mobile' })}>
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-verification-code' }),
              )}
            <Mobile
              name="mobile"
              placeholder={formatMessage({ id: 'user-login.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'user-login.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={formatMessage({ id: 'user-login.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'user-login.form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'user-login.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.verification-code.required' }),
                },
              ]}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
          <div className={styles.other}>
            <Link className={styles.forget} to="/user/forget">
              <FormattedMessage id="user-login.login.forgot-password" />
            </Link>
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="user-login.login.signup" />
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login }: ConnectState) => ({
  userLogin: login,
}))(Login);
