import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import styles from './style.less';


const getMail = (mail:string):string=>{
  const hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com',
    'outlook.com': 'http://www.outlook.com'
  }
  
  const domain = mail.split('@')[1];  // 获取邮箱域
  const keys = Object.keys(hash);
  for (let j = 0; j < keys.length; j +=1){
    const key = keys[j];
    if(key === domain){
      return hash[key];
    }
  }
  return '';
}

const actions = (href:string):React.ReactNode=>(
    <div className={styles.actions}>
      <a href={href}>
        <Button size="large" type="primary">
          <FormattedMessage id="userandregisterresult.register-result.view-mailbox" />
        </Button>
      </a>
      <Link to="/">
        <Button size="large">
          <FormattedMessage id="userandregisterresult.register-result.back-home" />
        </Button>
      </Link>
    </div>
  );

const RegisterResult: React.FC<RouteChildrenProps> = ({ location }) => <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="userandregisterresult.register-result.msg"
          values={{ email: location.state ? (location.state as any).account : '' }}
        />
      </div>
    }
    subTitle={formatMessage({ id: 'userandregisterresult.register-result.activation-email' })}
    extra={actions(getMail((location.state as any).account))}
  />;

export default RegisterResult;
