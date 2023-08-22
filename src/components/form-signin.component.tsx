import React from 'react';
import { Input } from 'antd';
import { Control, Controller } from 'react-hook-form';

interface LoginFormFieldsProps {
  control: Control<any>;
  isLoginFailed: boolean;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  control,
  isLoginFailed,
}) => {
  return (
    <>
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
        Username or Email
      </p>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Input
            size="middle"
            placeholder="Enter"
            status={isLoginFailed ? 'error' : ''}
            {...field}
          />
        )}
      />
      <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>Password</p>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input.Password
            size="middle"
            placeholder="Enter"
            status={isLoginFailed ? 'error' : ''}
            {...field}
          />
        )}
      />
    </>
  );
};

export default LoginFormFields;
