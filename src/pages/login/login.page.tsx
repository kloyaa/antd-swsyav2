import { Row, Checkbox, Card, message } from 'antd';
import SwsyaClient from '../../utils/http-client.util';
import { ILoginPayload } from '../../interfaces/login.interface';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import { messages } from '../../const/messages.const';
import { BtnSignIn } from '../../components/btn-signin.component';
import LoginFormFields from '../../components/form-signin.component';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setValue: setStoredAuthResponse } = useLocalStorage<IApiResponse | null>('auth_response', null);

  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoggingIn: false,
    isLoginFailed: false,
  });

  const { handleSubmit, control } = useForm<ILoginPayload>();
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

    if (loginResponse.code === '00') {
      setStoredAuthResponse({
        code: loginResponse.code,
        message: loginResponse.message,
        token: loginResponse.data,
      });
      setState((prev) => ({
        ...prev,
        isLoginFailed: false,
        isLoggingIn: false,
      }));

      navigate("/a/dashboard", { replace: true })
      return;
    }

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
        isLoggingIn: false,
        isLoginFailed: true,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoggingIn: false,
    }));

    messageApi.error({
      type: 'error',
      content: messages['500'].message,
      style: {
        marginTop: '90vh',
      },
    });
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
              <LoginFormFields
                control={control}
                isLoginFailed={state.isLoginFailed}
              />
              <Checkbox onChange={() => {}} style={{ marginTop: 20 }}>
                Remember me
              </Checkbox>
              <BtnSignIn isLoading={state.isLoggingIn} />
            </Card>
          </form>
        </Row>
      </div>
    </>
  );
}

export default Login;
