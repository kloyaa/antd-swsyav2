import { useEffect, useState } from 'react';
import NavigationBarAdmin from '../../components/nav-admin.component';
import TransactionTable from '../../components/table-transactions.component';
import Statistics from '../../components/stats.component';
import SwsyaClient from '../../utils/http-client.util';
import { API } from '../../const/api.const';
import { IApiResponse } from '../../interfaces/api.interface';
import useLocalStorage from '../../hooks/useLocalstorage.hook';
import { currency } from '../../utils/converter.util';
import type { ColumnsType } from 'antd/es/table';
import { IContentItem, ITransaction, TxnTableContent } from '../../interfaces/transaction.interface';
import { Badge, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin to display relative time
import 'dayjs/locale/en'; // Import the English locale to display month names in English
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalizeName } from '../../utils/util';
dayjs.extend(relativeTime); // Extend Day.js with the relativeTime plugin
dayjs.locale('en'); // Set the locale to English

interface getTransactionsParams { 
  schedule?: string;
  game?: string;
  time?: string;
}

interface IState {
  txnTotal: number,
  txnCount: number,
  swtCount: number,
  stlCount: number,
  txnRevenue: number,
  transactions: ITransaction[],
  sessionExpired: boolean,
  isVerifyingToken: boolean,
  isFetchingTransactions: boolean,
}

const columns: ColumnsType<TxnTableContent> = [
  {
    title: 'Reference',
    dataIndex: 'item-reference',
    filterMode: 'tree',
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Game',
    dataIndex: 'item-game',
    filterMode: 'tree',
    filterSearch: true,
    width: '3%',
    align:"center"
  },
  {
    title: 'Teller',
    dataIndex: 'item-teller',
    filterMode: 'tree',
    filterSearch: true,
    width: '15%',
  },
  {
    title: <div style={{display: "flex"}}> 
      <div style={{ marginRight: "50px"}}>Combination</div>
      <div>
        <Badge color="purple" text="Rambled" style={{ marginRight: "10px", fontWeight: "normal"}}/>
        <Badge color="black" text="Target"  style={{ marginRight: "10px", fontWeight: "normal"}}/>
      </div>
    </div> ,
    dataIndex: 'item-combination',
    filterMode: 'tree',
    filterSearch: true,
    width: '30%',
  },
  {
    title: 'Time',
    dataIndex: 'item-time',
    filterMode: 'tree',
    filterSearch: true,
    width: '5%',
  },
  {
    title: 'Schedule',
    dataIndex: 'item-schedule',
    filterMode: 'tree',
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Amount',
    dataIndex: 'item-amount',
    filterMode: 'tree',
    filterSearch: true,
    width: '15%',
  },
  {
    title: 'Details',
    dataIndex: 'item-details',
    filterMode: 'tree',
    filterSearch: true,
    width: '5%',
  },
];

function AdminDashboard() {
  const { value: getAuthResponse } =
    useLocalStorage<IApiResponse | null>('auth_response', null);
  
  const navigate = useNavigate();
  const [state, setState] = useState<IState>({
    txnTotal: 0,
    txnCount: 0,
    swtCount: 0,
    stlCount: 0,
    txnRevenue: 0,
    transactions: [],
    sessionExpired: false,
    isVerifyingToken: false,
    isFetchingTransactions: false
  });

  const handleGetTransactions = async () => {
    setState((prev) => ({
      ...prev,
      isFetchingTransactions: true
    }))
    const getTransactionsResp = await SwsyaClient
      .setAuthToken(getAuthResponse!.token.data)    
      .get<any, getTransactionsParams>(API.transactions, {})

      // 
    const transformedData = getTransactionsResp.data.map((item:ITransaction) => {
      const name = capitalizeName(`${item.profile.firstName} ${item.profile.lastName}`);
      const reference = item.reference;
      const combination = item.content.map((contentItem : IContentItem) => `${contentItem.type} ${contentItem.number}`).join(', ');
      const combinationElement = item.content.map((contentItem : IContentItem) => {
        // return <h1>{contentItem.type} {contentItem.number}</h1>
        const isRambled = contentItem.rambled;
        return <div style={{fontWeight: "bolder", marginRight: "10px", color: isRambled ? "purple" : "black"}}>{contentItem.number}</div>
      });


      return {
        'key': item._id,
        'item-reference': <Paragraph copyable={{ text: reference}} style={{ padding: "0px", margin: "0px"}}>{reference}</Paragraph>,
        'item-game': item.game,
        'item-teller': <Paragraph copyable={{ text: name}} style={{ padding: "0px", margin: "0px"}}>{name}</Paragraph>,
        'item-combination': <Paragraph copyable={{ text: combination}} style={{ display: "flex", padding: "0px", margin: "0px"}}>{combinationElement}</Paragraph>,
        'item-time': item.time,
        'item-schedule': dayjs(item.schedule).format("MMMM DD"),
        'item-amount': currency.format(item.content.reduce((total: any, contentItem: any) => total + contentItem.amount, 0),),
        'item-details': <Button type="dashed" shape="default" icon={<EyeOutlined />} size={"small"}>View more details</Button>
      }
    });

    setState((prev) => ({
      ...prev,
      txnRevenue: Number(getTransactionsResp.headers["swsya-txn-revenue"]) || 0,
      stlCount: Number(getTransactionsResp.headers["swsya-stl-count"]) || 0,
      swtCount:  Number(getTransactionsResp.headers["swsya-swt-count"]) || 0,
      txnCount:  Number(getTransactionsResp.headers["swsya-txn-count"]) || 0,
      txnTotal:  Number(getTransactionsResp.headers["swsya-txn-total"]) || 0,
      transactions: transformedData,
      isFetchingTransactions: false
    }))
  }

  const handleVerifyToken = async (): Promise<boolean> => {
    setState((prev) => ({
      ...prev,
      isVerifyingToken: true
    }))
    if(getAuthResponse!.token) {
      const verifyToken = await SwsyaClient.post<any, any>(API.verifyToken, { token: getAuthResponse!.token.data })
      if(verifyToken.code !== "00") {
        setState((prev) => ({
          ...prev,
          sessionExpired: true
        }));

        Modal.error({
          title: verifyToken.message,
          content: 'Your current session has either timed out due to inactivity or has expired. To ensure the security of your account, please proceed to log in again. Thank you for your cooperation.',
          width: "400px",
          centered: true,
          onOk: () => navigate("/", { replace: true })
        });

        return false;
      }
    }
    setState((prev) => ({
      ...prev,
      false: true
    }));

    return true;
  }

  const initState = async () => {
    const authenticated = await handleVerifyToken();
    if(authenticated) {
      await handleGetTransactions();
    }
  }

  useEffect(() => {
    document.title = 'Dashboard | Swerte Saya';
    initState();
  }, []);

  return <>
    <div style={{ background: '#f9f9f9', height: '100vh' }}>
      <NavigationBarAdmin />
      <div style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}>
        <Statistics 
          txnRevenue={state.txnRevenue}
          stlCount={state.stlCount}
          swtTotal={state.swtCount}
          txnCount={state.txnCount}
          txnTotal={state.txnTotal} />
      </div>
      <div style={{ marginTop: '20px', marginLeft: '70px', marginRight: '70px' }}>
        <TransactionTable 
          columns={columns}
          data={state.transactions}
          loading={state.isFetchingTransactions}/>
      </div>
    </div>
  </>
}

export default AdminDashboard;
