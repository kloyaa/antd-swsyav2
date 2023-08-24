import { useEffect, useState } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';
import TransactionTable from '../../components/table-transactions.component';
import Statistics from '../../components/stats.component';
import SwsyaClient from '../../utils/http-client.util';
import { API } from '../../const/api.const';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { currency } from '../../utils/converter.util';
import {
  IContentItem,
  ITransaction,
} from '../../interfaces/transaction.interface';
import { Button, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin to display relative time
import 'dayjs/locale/en'; // Import the English locale to display month names in English
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalizeName } from '../../utils/util';
import { tableDashboardColumn } from '../../const/table.const';
import { IDailyResult } from '../../interfaces/bet.interface';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
dayjs.extend(relativeTime); // Extend Day.js with the relativeTime plugin
dayjs.locale('en'); // Set the locale to English
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

interface IGetClientTransactionsParams {
    schedule?: string;
    game?: string;
    user?: string;
}

interface IState {
  txnTotal: number;
  txnCount: number;
  swtCount: number;
  stlCount: number;
  txnRevenue: number;
  transactions: ITransaction[];
  dailyResults: IDailyResult[];
  sessionExpired: boolean;
  isVerifyingToken: boolean;
  isFetchingTransactions: boolean;
  isFetchingDailyResults: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PreviewRecords() {
  const { value: getAuthResponse } = useLocalStorage<IApiResponse | null>(
    'auth_response',
    null
  );

  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<IState>({
    txnTotal: 0,
    txnCount: 0,
    swtCount: 0,
    stlCount: 0,
    txnRevenue: 0,
    transactions: [],
    dailyResults: [],
    sessionExpired: false,
    isVerifyingToken: false,
    isFetchingTransactions: false,
    isFetchingDailyResults: false
  });

  const handleGetTransactions = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingTransactions: true,
    }));
    const getTransactionsResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, IGetClientTransactionsParams>(API.userTransactions, {
        user: location?.state?.client?.user,
        game: "3D"
    });

    const name = capitalizeName(location?.state?.client?.name);
    const transformedData = getTransactionsResp.data.map(
      (item: ITransaction) => {
   
        const reference = item.reference;
        const combination = item.content
          .map(
            (contentItem: IContentItem) =>
              `${contentItem.type} ${contentItem.number}`
          )
          .join(', ');
        const combinationElement = item.content.map(
          (contentItem: IContentItem, index: number) => {
            // return <h1>{contentItem.type} {contentItem.number}</h1>
            const isRambled = contentItem.rambled;
            return (
              <div
                key={index}
                style={{
                  fontWeight: 'bolder',
                  marginRight: '10px',
                  color: isRambled ? 'purple' : 'black',
                }}
              >
                {contentItem.number}
              </div>
            );
          }
        );
        return {
          key: item._id,
          'item-reference': (
            <Paragraph
              copyable={{ text: reference }}
              style={{ padding: '0px', margin: '0px' }}
            >
              {reference}
            </Paragraph>
          ),
          'item-game': item.game,
          'item-teller': (
            <Paragraph
              copyable={{ text: name }}
              style={{ padding: '0px', margin: '0px' }}
            >
              {name}
            </Paragraph>
          ),
          'item-combination': (
            <Paragraph
              copyable={{ text: combination }}
              style={{ display: 'flex', padding: '0px', margin: '0px' }}
            >
              {combinationElement}
            </Paragraph>
          ),
          'item-time': item.time,
          'item-schedule': dayjs(item.schedule).format('MMMM DD'),
          'item-amount': currency.format(
            item.content.reduce(
              (total: any, contentItem: any) => total + contentItem.amount,
              0
            )
          ),
          'item-details': (
            <Button
              type="dashed"
              shape="default"
              icon={<EyeOutlined />}
              size={'small'}
              style={{ fontSize: "12px" }}
            >
              VIEW MORE DETAILS
            </Button>
          ),
        };
      }
    );

    setState((prev) => ({
      ...prev,
      txnRevenue: Number(getTransactionsResp.headers['swsya-txn-revenue']) || 0,
      stlCount: Number(getTransactionsResp.headers['swsya-stl-count']) || 0,
      swtCount: Number(getTransactionsResp.headers['swsya-swt-count']) || 0,
      txnCount: Number(getTransactionsResp.headers['swsya-txn-count']) || 0,
      txnTotal: Number(getTransactionsResp.headers['swsya-txn-total']) || 0,
      transactions: transformedData,
      isFetchingTransactions: false,
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
      await handleGetTransactions();
    }
  };

  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: labels.map(() => faker.number.int({ min: 0, max: 55000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    document.title = `${location?.state?.client?.name} | Swerte Saya`;
    initState();

    console.log(labels.map(() => faker.number.int({ min: -1000, max: 1000 })))
  }, []);

  return (
    <>
      <div style={{ background: '#f9f9f9', height: '100vh' }}>
        <NavigationBarAdmin />
        <div
          style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}
        >
          <Statistics
            txnRevenue={state.txnRevenue}
            stlCount={state.stlCount}
            swtTotal={state.swtCount}
            txnCount={state.txnCount}
            txnTotal={state.txnTotal}
          />
        </div>
        <div
          style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}
        >
            <div style={{ backgroundColor: "white", borderRadius: "20px", border: "0.5px solid #f5f5f5" }}>
                <Line options={{
                    responsive: true,
                    layout: {
                    padding: {
                        left: 20, 
                        right: 20,
                        bottom: 10,
                        top: 10
                    },
                    },
                    animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                    },
                    plugins: {
                    legend: {
                        position: 'top' as const,
                    },
                    },
                }} 
                data={data}  
                height={"70vh"}/>
            </div>
            <div style={{ marginTop: "20px" }}>
              <TransactionTable
                columns={tableDashboardColumn}
                data={state.transactions}
                loading={state.isFetchingTransactions}
                caption={`Transactions of ${location.state.client.name}`}
              />
            </div>
        </div>
      </div>
    </>
  );
}

export default PreviewRecords;