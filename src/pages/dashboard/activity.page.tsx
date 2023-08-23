import { useEffect, useState } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';
import TransactionTable from '../../components/table-transactions.component';
import SwsyaClient from '../../utils/http-client.util';
import { API } from '../../const/api.const';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin to display relative time
import 'dayjs/locale/en'; // Import the English locale to display month names in English
import { IActivity } from '../../interfaces/activity.interface';
import { capitalizeName } from '../../utils/util';
import Paragraph from 'antd/es/typography/Paragraph';
import { tableActivityColumn } from '../../const/table.const';
dayjs.extend(relativeTime); // Extend Day.js with the relativeTime plugin
dayjs.locale('en'); // Set the locale to English

interface getTransactionsParams {
  schedule?: string;
  game?: string;
  time?: string;
}

interface IState {
  txnTotal: number;
  txnCount: number;
  swtCount: number;
  stlCount: number;
  txnRevenue: number;
  activities: IActivity[];
  sessionExpired: boolean;
  isVerifyingToken: boolean;
  isFetchingActivities: boolean;
}

function Activity() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );

  const navigate = useNavigate();
  const [state, setState] = useState<IState>({
    txnTotal: 0,
    txnCount: 0,
    swtCount: 0,
    stlCount: 0,
    txnRevenue: 0,
    activities: [],
    sessionExpired: false,
    isVerifyingToken: false,
    isFetchingActivities: false,
  });

  const handleGetActivities = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingActivities: true,
    }));

    const getActivitiesResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, getTransactionsParams>(API.activities, {});

    const transformedData = getActivitiesResp.data.map((item: IActivity) => {
      const name = capitalizeName(
        `${item.profile.firstName} ${item.profile.lastName}`
      );
      const contactNo = item.profile.contactNumber;
      const address = capitalizeName(item.profile.address);

      return {
        key: item._id,
        'item-contact': (
          <Paragraph
            copyable={{ text: contactNo }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {contactNo}
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
        'item-name': (
          <Paragraph
            copyable={{ text: name }}
            style={{ padding: '0px', margin: '0px' }}
          >
            {name}
          </Paragraph>
        ),
        'item-description': item.description,
        'item-datetime': dayjs(item.createdAt).format('MMMM DD; h:mm A'),
      };
    });

    setState((prev) => ({
      ...prev,
      activities: transformedData,
      isFetchingActivities: false,
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
      isVerifyingToken: true,
    }));

    return true;
  };

  const initState = async () => {
    const authenticated = await handleVerifyToken();
    if (authenticated) {
      await handleGetActivities();
    }
  };

  useEffect(() => {
    document.title = 'Activity | Swerte Saya';
    initState();
  }, []);

  return (
    <>
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
            columns={tableActivityColumn}
            data={state.activities}
            loading={state.isFetchingActivities}
          />
        </div>
      </div>
    </>
  );
}

export default Activity;
