import { useEffect, useState } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';
import TransactionTable from '../../components/table-transactions.component';
import { TxnTableContent } from '../../interfaces/transaction.interface';
import { IUser } from '../../interfaces/client.interface';
import SwsyaClient from '../../utils/http-client.util';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { IApiResponse } from '../../interfaces/api.interface';
import { API } from '../../const/api.const';
import { Button, Modal, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DownCircleOutlined } from '@ant-design/icons';
import { capitalizeName } from '../../utils/util';
import Paragraph from 'antd/es/typography/Paragraph';
import { tableUsersColumn } from '../../const/table.const';
import { EyeOutlined } from '@ant-design/icons';

interface IState {
  users: TxnTableContent[];
  isFetchingUsers: boolean;
  isUpdatingStatus: boolean;
  selectedId: string;
}

interface IUpdateUserStatusPayload {
  user: string;
  verified: boolean;
}

function Users() {
  const [messageApi, contextHolder] = message.useMessage();

  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );

  const navigate = useNavigate();
  const [state, setState] = useState<IState>({
    users: [],
    isFetchingUsers: false,
    isUpdatingStatus: false,
    selectedId: '',
  });

  const handleChangeStatus = async (user: string, type: string) => {
    let verificationStatus = true;

    if (type === 'revoke-account') {
      verificationStatus = false;
    } else if (type === 'verify-account') {
      verificationStatus = true;
    }

    const handleUpdateUserStatus = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).put<any, IUpdateUserStatusPayload>(API.updateUserStatus, {
      user,
      verified: verificationStatus,
    });

    if (handleUpdateUserStatus.code !== '00') {
      messageApi.error({
        type: 'error',
        content: handleUpdateUserStatus!.message,
        style: {
          marginTop: '90vh',
        },
      });

      return;
    }

    messageApi.success({
      type: 'success',
      content: handleUpdateUserStatus!.message,
      style: {
        marginTop: '90vh',
      },
    });

    await initState();
  };

  const handleGetUsers = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingUsers: true,
    }));

    const getUsersResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, any>(API.users, { verified: true });

    const mappedData = getUsersResp.data.map((item: IUser) => {
      const name = capitalizeName(
        `${item.profile.firstName} ${item.profile.lastName}`
      );
      const contactNo = item.profile.contactNumber;
      const address = capitalizeName(item.profile.address);
      const email = item.email.toLowerCase();

      return {
        key: item._id,
        'item-referrer': item.profile.refferedBy,
        'item-name': (
          <Paragraph
            copyable={{ text: name }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {name}
          </Paragraph>
        ),
        'item-username': item.username,
        'item-contact': (
          <Paragraph
            copyable={{ text: contactNo }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {contactNo}
          </Paragraph>
        ),
        'item-email': (
          <Paragraph
            copyable={{ text: email }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {email}
          </Paragraph>
        ),
        'item-address': (
          <Paragraph
            copyable={{ text: address }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {address}
          </Paragraph>
        ),
        'item-records': (
          <Button
            type="dashed"
            shape="default"
            icon={<EyeOutlined />}
            size={'small'}
            style={{ fontSize: "12px" }}
            onClick={() => navigate("/a/users/record", { state: {
              client: { 
                user: item._id,
                name
              }
            }})}
          >
            VIEW
          </Button>
        ),
        'item-status': (
          <Select
            bordered={false}
            suffixIcon={<DownCircleOutlined />}
            defaultValue="action"
            onChange={(v) => handleChangeStatus(item.profile.user, v)}
            style={{ width: '100%', textAlign: 'center' }}
            options={[
              { value: 'action', label: 'Select Action', disabled: true },
              { value: 'revoke-account', label: 'Revoke Account' },
              { value: 'hold-account', label: 'Hold', disabled: true },
              { value: 'delete-account', label: 'Delete', disabled: true },
            ]}
          />
        ),
        // 'item-status': item.profile.verified ? 'Verified' : 'Not Verified',
      };
    });

    setState((prev) => ({
      ...prev,
      users: mappedData,
      isFetchingUsers: false,
    }));
  };

  const handleVerifyToken = async (): Promise<boolean> => {
    setState((prev) => ({
      ...prev,
      isVerifyingToken: true,
    }));
    if (getAuthResponse!.token) {
      const verifyToken = await SwsyaClient.post<any, any>(API.verifyToken, {
        token: getAuthResponse!.token.data,
      });
      if (verifyToken.code !== '00') {
        setState((prev) => ({
          ...prev,
          sessionExpired: true,
        }));

        Modal.error({
          title: verifyToken.message,
          content:
            'Your current session has either timed out due to inactivity or has expired. To ensure the security of your account, please proceed to log in again. Thank you for your cooperation.',
          width: '400px',
          centered: true,
          onOk: () => navigate('/', { replace: true }),
        });

        return false;
      }
    }
    setState((prev) => ({
      ...prev,
      false: true,
    }));

    return true;
  };

  const initState = async () => {
    const authenticated = await handleVerifyToken();
    if (authenticated) {
      await handleGetUsers();
    }
  };

  useEffect(() => {
    document.title = 'Users | Swerte Saya';
    initState();
  }, []);

  return (
    <>
      {contextHolder}
      <div style={{ background: '#f9f9f9', height: '100vh' }}>
        <NavigationBarAdmin />
        <div
          style={{
            marginTop: '100px',
            marginLeft: '70px',
            marginRight: '70px',
          }}
        >
          <TransactionTable
            columns={tableUsersColumn}
            data={state.users}
            loading={state.isFetchingUsers}
          />
        </div>
      </div>
    </>
  );
}

export default Users;
