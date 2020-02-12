import { Button, Col, Input, Popover, Progress, Row, message,Form } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { RegisterStateType } from '../../../models/register';
import { validateUsernameUnique,validatePhoneUnique,register } from '@/services/user'
import styles from './style.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>{formatMessage({ id: 'user-register.strength.strong'})}</div>,
  pass: <div className={styles.warning}>{formatMessage({ id: 'user-register.strength.medium'})}</div>,
  poor: <div className={styles.error}>{formatMessage({ id: 'user-register.strength.short'})}</div>,
};
const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userAndRegister: RegisterStateType;
  
}
interface RegisterState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  submitting: boolean;
}

class Register extends Component<RegisterProps, RegisterState> {
  state: RegisterState = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    submitting:false,
  };

  interval: number | undefined = undefined;


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const {form ,dispatch} = this.props;
    form.validateFields(['mobile'],(errors,values)=>{
      if(errors && Object.keys(errors).length > 0){
        return;
      }
      let count = 59;
      this.setState({
        count,
      });
      this.interval = window.setInterval(() => {
        count -= 1;
        this.setState({
          count,
        });

        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
      dispatch({
        type: 'userAndRegister/captcha',
        payload: { mobile:values.mobile},
      });
      message.info(formatMessage({ id: 'user-register.captcha.ok'}));
    })
    
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields(
      {
        force: true,
      },
      async (err, values) => {
        if (!err) {
          this.setState({
            submitting:true
          });
          const payload:UserRegisterParams = {
            code:values.captcha,
            username:values.username,
            password:values.password,
            phone:values.mobile,
          };
          const response = await register(payload);
          this.setState({
            submitting:false
          });
          if (response.status === 200 ) {
            message.success(formatMessage({ id: 'user-register.result.success'}));
            router.push({
              pathname: '/user/register-result',
              state: {
                account:values.username,
              },
            });
          }else{
            message.error(response.msg);
          }
        }
      },
    );
  };

  checkConfirm = (rule: any, value: string, callback: (message?: string) => void) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'user-register.password.twice'}));
    } else {
      callback();
    }
  };

  checkUsername = async (rule: any, value: string, callback: (message?: string) => void) => {
    const response = await validateUsernameUnique(value);
    
    if (response && response.status === 200) {
      callback(formatMessage({ id: 'user-register.username.repeat'}));
    } else {
      callback();
    }
  };

  checkPhone = async (rule: any, value: string, callback: (message?: string) => void) => {
    const response = await validatePhoneUnique(value);
    
    if (response && response.status === 200) {
      callback(formatMessage({ id: 'user-register.phone-number.reqeat'}));
    } else {
      callback();
    }
  };
  

  checkPassword = (rule: any, value: string, callback: (message?: string) => void) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({ id: 'user-register.password.required'}),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, visible,submitting } = this.state;
    return (
      <div className={styles.main}>
        <h3>{formatMessage({ id: 'user-register.register.register'})}</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.username.required'}),
                },
                {
                  min:4,
                  transform:value=>value.trim(),
                  message: formatMessage({ id: 'user-register.username.wrong-format'}),
                },
                {
                  validator: this.checkUsername,
                },
              ],
            })(<Input size="large" placeholder={formatMessage({ id: "user-register.username.placeholder"})} />)}
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    {formatMessage({ id: 'user-register.strength.msg'})}
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: "user-register.password.placeholder"})}
                />,
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.confirm-password.required'}),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: "user-register.confirm-password.placeholder"})}
              />,
            )}
          </FormItem>
          <FormItem>
           
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-register.phone-number.required'}),
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: formatMessage({ id: 'user-register.phone-number.wrong-format'}),
                  },
                  {
                    validator:this.checkPhone,
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={formatMessage({ id: "user-register.phone-number.placeholder"})}
                />,
              )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'user-register.verification-code.required'}),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({ id: "user-register.verification-code.placeholder"})}
                  />,
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={!!count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : formatMessage({ id: 'user-register.register.get-verification-code'})}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="user-register.register.register" />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="user-register.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(
  ({
    userAndRegister,
  }: {
    userAndRegister: RegisterStateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndRegister,
  }),
)(Form.create<RegisterProps>()(Register));
