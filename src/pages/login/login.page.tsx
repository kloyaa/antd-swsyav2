import { Row, Checkbox, Card, message } from 'antd';
import SwsyaClient from '../../utils/http-client.util';
import { ILoginEncryptedPayload, ILoginPayload } from '../../interfaces/login.interface';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse, ISavedLogin } from '../../interfaces/api.interface';
import { messages } from '../../const/messages.const';
import { BtnNotYou, BtnSignIn } from '../../components/btn-signin.component';
import LoginFormFields from '../../components/form-signin.component';
import { useNavigate } from 'react-router-dom';
import { API } from '../../const/api.const';

function Login() {
  const { setValue: setAuthResponse, removeValue: removeAuthResponse } =
    useLocalStorage<IApiResponse | null>('auth_response', null);

  const { setValue: setSaveLogin, value: getSavedLogin, removeValue: removeSavedLogin } =
    useLocalStorage<ISavedLogin | null>('login_token', null);

  const navigate = useNavigate();
  const [state, setState] = useState({
    isSavedLogin: true,
    isLoggingIn: false,
    isLoginFailed: false,
  });

  const { handleSubmit, control } = useForm<ILoginPayload>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin: SubmitHandler<ILoginPayload> = async (data) => {
    if((data.username === undefined || data.password === undefined) && !getSavedLogin) {
       messageApi.error({
        type: 'error',
        content: "Username and password is required.",
        style: {
          marginTop: '90vh',
        },
      });

      return
    }
    setState((prev) => ({
      ...prev,
      isLoggingIn: true,
    }));

    const payload: ILoginPayload = {
      username: data.username,
      password: data.password,
    };

    let loginResponse = null;

    try {
      if(getSavedLogin) {
        loginResponse = await SwsyaClient.post<any, ILoginEncryptedPayload>(API.ecryptedLogin, { 
          content: getSavedLogin.token 
        })
      } else {
        loginResponse = await SwsyaClient.post<any, ILoginPayload>(API.login, payload)
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoginFailed: false,
        isLoggingIn: false,
      }));
      messageApi.error({
        type: 'error',
        content: messages['500'].message,
        style: {
          marginTop: '90vh',
        },
      });

      return;
    }

    if (loginResponse!.code === '00') {
      if(state.isSavedLogin && !getSavedLogin) {
        const encryptLoginResponse = await SwsyaClient.post<any, ILoginPayload>(API.ecryptLogin, payload);
        setSaveLogin({
          owner: encryptLoginResponse.data.data.owner,
          token: encryptLoginResponse.data.data.token
        });
      }
      setAuthResponse({
        code: loginResponse!.code,
        message: loginResponse!.message,
        token: loginResponse!.data,
      });
      setState((prev) => ({
        ...prev,
        isLoginFailed: false,
        isLoggingIn: false,
      }));

      navigate('/a/dashboard', { replace: true });
      return;
    }

    if (loginResponse!.code !== '00') {
      messageApi.error({
        type: 'error',
        content: loginResponse!.message,
        style: {
          marginTop: '90vh',
        },
      });
      setState((prev) => ({
        ...prev,
        isLoggingIn: false,
        isLoginFailed: true,
      }));
      handleClearLocalStorage(); // Clear saved data
      return;
    }

  };

  const handleSaveLogin = () => {
    setState((prev) => ({ ...prev, isSavedLogin: !state.isSavedLogin }))
  }

  const handleClearSaveLogin = () => {
    removeSavedLogin();
  }

  const handleClearLocalStorage = () => {
    removeAuthResponse();
    removeSavedLogin();
  }

  useEffect(() => {
    document.title = 'Login | Swerte Saya';
    removeAuthResponse(); // Remove existing token
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
              title={`${getSavedLogin ? `Welcome Back, ${getSavedLogin.owner}!` : "Swerte Saya | Login"}`}
              bordered={true}
              style={{ width: 280 }}
            >
              { getSavedLogin ? <div>
                Your presence is recognized. Would you like to proceed with signing in? 
                <BtnSignIn title={"Let's go!"} isLoading={state.isLoggingIn} />
                <BtnNotYou 
                  event={() => handleClearSaveLogin()}
                  title={getSavedLogin ? `Not ${getSavedLogin.owner}` : ""}/>
                </div> : <div>
              <LoginFormFields
                control={control}
                isLoginFailed={state.isLoginFailed}
              />
              <Checkbox onChange={() => handleSaveLogin()} style={{ marginTop: 20 }} checked={state.isSavedLogin}>
                Remember me
              </Checkbox>
              <BtnSignIn isLoading={state.isLoggingIn} />
              </div>}
              
            
            </Card>
          </form>
        </Row>
      </div>
    </>
  );
}

export default Login;
