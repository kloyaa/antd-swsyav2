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
import { Button, Divider, Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin to display relative time
import 'dayjs/locale/en'; // Import the English locale to display month names in English
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalizeName } from '../../utils/util';
import { tableDashboardColumn, tableResultsColumn } from '../../const/table.const';
import { IDailyResult } from '../../interfaces/bet.interface';
import { Line } from 'react-chartjs-2';
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
import Countdown, { CountdownProps } from 'antd/es/statistic/Countdown';
import { subscriptionExpiry, systemExtraCharges, systemStatus } from '../../const/const';

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
  transactions: ITransaction[];
  dailyResults: IDailyResult[];
  chartLabels: string[];
  chartValue: number[];
  chartIncome: number[];
  sessionExpired: boolean;
  isVerifyingToken: boolean;
  isFetchingTransactions: boolean;
  isFetchingDailyResults: boolean;
  subscriptionExpiry: number;
  subscriptionExpiryInDate: string;
  systemUsage: string;
  systemExtraCharges: string;
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

const { Text } = Typography;

function AdminDashboard() {
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
    transactions: [],
    dailyResults: [],
    sessionExpired: false,
    isVerifyingToken: false,
    isFetchingTransactions: false,
    isFetchingDailyResults: false,
    subscriptionExpiry: 0,
    subscriptionExpiryInDate: "2023-09-13",
    systemUsage: "0",
    systemExtraCharges: "0",
    chartLabels: [],
    chartValue: [],
    chartIncome: []
  });

  const handleGetTransactions = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingTransactions: true,
    }));
    const getTransactionsResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, getTransactionsParams>(API.transactions, {});

    //
    const transformedData = getTransactionsResp.data.map(
      (item: ITransaction) => {
        const name = capitalizeName(
          `${item.profile.firstName} ${item.profile.lastName}`
        );
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

  const handleGetTransactionData = async () => {
    const getTransactionDataResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, getTransactionsParams>(API.transactionData, {});
    setState((prev) => ({
      ...prev,
      chartLabels: getTransactionDataResp.data.map((v: any) => { return dayjs(v.schedule).format("MMM DD") }),
      chartValue: getTransactionDataResp.data.map((v: any) => { 
        return Number(v.total) 
      }),
      chartIncome: getTransactionDataResp.data.map((v: any) => { 
        return Number(v.total) * 0.75
      })
    }));
  }

  const handleGetDailyResults = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingDailyResults: true,
    }));

    const getDailyResultsResp = await SwsyaClient.setAuthToken(
      getAuthResponse!.token.data
    ).get<any, getTransactionsParams>(API.dailyResults, {});


    const mappedData = getDailyResultsResp.data.map((result: IDailyResult) => ({
      'key': `${result.time}${result.schedule}`,
      'item-game': result.type,
      'item-number': result.number,
      'item-time': result.time,
      'item-wins': result.wins.toString(),
    }));
    
    setState((prev) => ({
      ...prev,
      dailyResults: mappedData,
      isFetchingDailyResults: false,
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

  const getSystemStatus = () => {
    const dateString = subscriptionExpiry; // Replace with your actual environment variable name
    const dateObject = new Date(dateString);
    setState((prev) => ({
      ...prev,
      subscriptionExpiry: Number(dateObject),
      subscriptionExpiryInDate: dateString,
      systemUsage: systemStatus,
      systemExtraCharges: systemExtraCharges
    }))
  }
  
  const initState = async () => {
    getSystemStatus();

    const authenticated = await handleVerifyToken();
    if (authenticated) {
      await handleGetTransactions();
      await handleGetTransactionData();
      await handleGetDailyResults();
    }
  };



  const onSubscriptionFinished: CountdownProps['onFinish'] = () => {
    console.log('finished!');
  };
  
  useEffect(() => {
    document.title = 'Dashboard | Swerte Saya';
    initState();
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
          style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px', display: "flex", gap: "20px" }}
        >
          <div style={{width: "20%"}}>
            <TransactionTable
              columns={tableResultsColumn}
              data={state.dailyResults}
              loading={state.isFetchingDailyResults}
              caption={"Daily Results"}
            />

            <div style={{ backgroundColor: "white", borderRadius: "5px", border: "0.5px solid #f5f5f5", padding: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px"}}>
                <Text  style={{ color: "gray", fontSize: "14px", fontWeight: "lighter"}}>System Maintenance Expiry</Text>
                <Text style={{ fontSize: "22px"}}>{dayjs(state.subscriptionExpiryInDate).format('MMMM DD, YYYY')}</Text>
              </div>
              <Countdown title="Hours Remaining" value={state.subscriptionExpiry} onFinish={onSubscriptionFinished} />
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between",  gap: "10px", flexDirection: "column", } }>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text  style={{ color: "gray", fontSize: "14px", fontWeight: "lighter"}}>Usage (Overall)</Text>
                  <Text style={{ fontSize: "22px"}}>{state.systemUsage}/100</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text  style={{ color: "gray", fontSize: "14px", fontWeight: "lighter"}}>Status</Text>
                  <Text style={{ fontSize: "22px"}}>Good</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text  style={{ color: "gray", fontSize: "14px", fontWeight: "lighter"}}>Charges to Pay</Text>
                  <Text style={{ fontSize: "22px"}}>${state.systemExtraCharges}</Text>
                </div>
              </div>
            </div>
          </div>

          <div style={{width: "80%"}}>
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
                    from: 0.2,
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
              data={{
                labels: state.chartLabels,
                datasets: [
                  {
                    label: 'Revenue',
                    data: state.chartValue,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Income',
                    data: state.chartIncome,
                    borderColor: '#321580',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    borderWidth: 1,
                  },
                ],
              }}  
              height={"50vh"}/>
            </div>
            <div style={{ marginTop: "20px" }}>
              <TransactionTable
                columns={tableDashboardColumn}
                data={state.transactions}
                loading={state.isFetchingTransactions}
                caption={"Transactions"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
