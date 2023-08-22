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
import { TxnTableContent } from '../../interfaces/transaction.interface';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

interface getTransactionsParams { 
  schedule?: string;
  game?: string;
  time?: string;
}

const columns: ColumnsType<TxnTableContent> = [
  {
    title: 'Teller',
    dataIndex: 'teller',
    filterMode: 'tree',
    filterSearch: true,
    filters: [
        // ...
    ],
    onFilter: (value: string | number | boolean, record) =>
      record.name.includes(String(value)),
    width: '30%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      // ...
    ],
    onFilter: (value: string | number | boolean, record) =>
      record.address.startsWith(String(value)),
    filterSearch: true,
    width: '40%',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    sorter: (a, b) => parseInt(a.amount.substring(1, a.amount.length -3 )) - parseInt(b.amount.substring(1, b.amount.length -3 )) ,
  },
  {
    
    title: 'Tekker',
    dataIndex: 'teller',
    sorter: (a, b) => parseInt(a.amount.substring(1, a.amount.length -3 )) - parseInt(b.amount.substring(1, b.amount.length -3 )) ,
  },
  {
    
    title: 'Amount',
    dataIndex: 'amount',
    sorter: (a, b) => parseInt(a.amount.substring(1, a.amount.length -3 )) - parseInt(b.amount.substring(1, b.amount.length -3 )) ,
  },

];

const data: TxnTableContent[] = [
  {
    key: '1',
    name: 'John Brown',
    amount: currency.format(32),    
    teller: 'Jim Green',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    teller: 'Jim Green',
    amount: currency.format(100),
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    amount: currency.format(50),
    teller: 'Jim Green',
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    teller: 'Jim Green',
    name: 'Jim Red',
    amount: currency.format(63),
    address: 'London No. 2 Lake Park',
  },
];

function AdminDashboard() {
  const { value: getAuthResponse } =
    useLocalStorage<IApiResponse | null>('auth_response', null);
  
  const navigate = useNavigate();
  const [state, setState] = useState({
    txnTotal: 0,
    txnCount: 0,
    swtCount: 0,
    stlCount: 0,
    txnRevenue: 0,
    transactions: [],
    sessionExpired: false,
    isVerifyingToken: false
  });

  const handleGetTransactions = async () => {
    const getTransactionsResp = await SwsyaClient
      .setAuthToken(getAuthResponse!.token.data)    
      .get<any, getTransactionsParams>(API.transactions, {})

    setState((prev) => ({
      ...prev,
      txnRevenue: Number(getTransactionsResp.headers["swsya-txn-revenue"]) || 0,
      stlCount: Number(getTransactionsResp.headers["swsya-stl-count"]) || 0,
      swtCount:  Number(getTransactionsResp.headers["swsya-swt-count"]) || 0,
      txnCount:  Number(getTransactionsResp.headers["swsya-txn-count"]) || 0,
      txnTotal:  Number(getTransactionsResp.headers["swsya-txn-total"]) || 0,
      transactions: getTransactionsResp.data
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
          data={data}/>
      </div>
    </div>
  </>
}

export default AdminDashboard;
