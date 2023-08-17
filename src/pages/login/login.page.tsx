import { Row, Input, Button, Checkbox, Card, message } from 'antd';
import SwsyaClient from '../../utils/http-client.util';
import { ILoginPayload } from '../../interfaces/login.interface';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

function Login() {
  const [state, setState] = useState({
    isLoggingIn: false,
    isLoginFailed: false,
  });
  const {  handleSubmit,  control } = useForm<ILoginPayload>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin: SubmitHandler<ILoginPayload> = async (data) => {
    setState((prev) => ({
      ...prev,
      isLoggingIn: true,
    }));

    const payload: ILoginPayload = {
      username: data.username,
      password: data.password,
    };
    const loginResponse = await SwsyaClient.post<any, ILoginPayload>(
      '/api/auth/v1/login',
      payload
    );

    if (loginResponse.code !== '00') {
      messageApi.error({
        type: 'error',
        content: loginResponse.message,
        style: {
          marginTop: '90vh',
        },
      });
      setState((prev) => ({
        ...prev,
        isLoginFailed: true,
      }));
    }

    setState((prev) => ({
      ...prev,
      isLoggingIn: false,
    }));
  };

  useEffect(() => {
    document.title = 'Login | Swerte Saya';
  }, []);

  return (
    <>
      {contextHolder}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Row justify="center">
          <form onSubmit={handleSubmit(handleLogin)}>
            <Card
              title="Swerte Saya | Login"
              bordered={true}
              style={{ width: 280 }}
            >
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
                    status={state.isLoginFailed ? 'error' : ''}
                    {...field}
                  />
                )}
              />
              <p style={{ padding: 0, color: 'GrayText', fontSize: 12 }}>
                Password
              </p>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    size="middle"
                    placeholder="Enter"
                    status={state.isLoginFailed ? 'error' : ''}
                    {...field}
                  />
                )}
              />
              <Checkbox onChange={() => {}} style={{ marginTop: 20 }}>
                Remember me
              </Checkbox>
              <Button
                type="primary"
                size="middle"
                loading={state.isLoggingIn}
                style={{ marginTop: 20 }}
                htmlType="submit"
                block
              >
                Sign in
              </Button>
            </Card>
          </form>
        </Row>
      </div>
    </>
  );
}

export default Login;
