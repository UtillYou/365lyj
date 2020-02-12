import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import styles from './style.less';

const actions = (
    <div className={styles.actions}>
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
    extra={actions}
  />;

export default RegisterResult;
