import { ColumnsType } from 'antd/es/table';
import { TxnTableContent } from '../interfaces/transaction.interface';
import { Badge } from 'antd';

export const tableActivityColumn: ColumnsType<TxnTableContent> = [
  {
    title: 'Name',
    dataIndex: 'item-name',
    filterMode: 'tree',
    filterSearch: true,
    width: '20%',
  },
  {
    title: 'Mobile No.',
    dataIndex: 'item-contact',
    filterMode: 'tree',
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Address',
    dataIndex: 'item-address',
    filterMode: 'tree',
    filterSearch: true,
    width: '30%',
  },
  {
    title: 'Description',
    dataIndex: 'item-description',
    filterMode: 'tree',
    filterSearch: true,
    width: '30%',
  },
  {
    title: 'Date & Time',
    dataIndex: 'item-datetime',
    filterMode: 'tree',
    filterSearch: true,
    width: '20%',
  },
];

export const tableDashboardColumn: ColumnsType<TxnTableContent> = [
  {
    title: 'Reference',
    dataIndex: 'item-reference',
    filterMode: 'tree',
    filterSearch: true,
    width: '15%',
  },
  {
    title: 'Game',
    dataIndex: 'item-game',
    filterMode: 'tree',
    filterSearch: true,
    width: '3%',
    align: 'center',
  },
  {
    title: 'Teller',
    dataIndex: 'item-teller',
    filterMode: 'tree',
    filterSearch: true,
    width: '15%',
  },
  {
    title: (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '50px' }}>Combination</div>
        <div>
          <Badge
            color="purple"
            text="Rambled"
            style={{ marginRight: '10px', fontWeight: 'normal' }}
          />
          <Badge
            color="black"
            text="Target"
            style={{ marginRight: '10px', fontWeight: 'normal' }}
          />
        </div>
      </div>
    ),
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
    width: '10%',
  },
  {
    title: 'Details',
    dataIndex: 'item-details',
    filterMode: 'tree',
    filterSearch: true,
    width: '5%',
  },
];

export const tableRequestsColumn: ColumnsType<TxnTableContent> = [
  {
    title: 'Referrer',
    dataIndex: 'item-referrer',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Username',
    dataIndex: 'item-username',
    filterMode: 'tree',
    filterSearch: true,
    filters: [
      // ...
    ],
    width: '15%',
  },
  {
    title: 'Name',
    dataIndex: 'item-name',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '20%',
  },
  {
    title: 'Mobile No.',
    dataIndex: 'item-contact',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Email',
    dataIndex: 'item-email',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '20%',
  },
  {
    title: 'Home Address',
    dataIndex: 'item-address',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '15%',
  },
  {
    title: 'Status',
    dataIndex: 'item-status',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
];

export const tableUsersColumn: ColumnsType<TxnTableContent> = [
  {
    title: 'Referrer',
    dataIndex: 'item-referrer',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Name',
    dataIndex: 'item-name',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '15%',
  },
  {
    title: 'Username',
    dataIndex: 'item-username',
    filterMode: 'tree',
    filterSearch: true,
    filters: [
      // ...
    ],
    width: '10%',
  },
  {
    title: 'Mobile No.',
    dataIndex: 'item-contact',
    width: '10%',
  },
  {
    title: 'Email',
    dataIndex: 'item-email',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '20%',
  },
  {
    title: 'Home Address',
    dataIndex: 'item-address',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '20%',
  },
  {
    title: 'Records',
    dataIndex: 'item-records',
    width: '5%',
  },
  {
    title: 'Status',
    dataIndex: 'item-status',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
];

export const tableResultsColumn: ColumnsType<TxnTableContent> = [
  {
    title: 'Game',
    dataIndex: 'item-game',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Number',
    dataIndex: 'item-number',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Time',
    dataIndex: 'item-time',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
  {
    title: 'Wins',
    dataIndex: 'item-wins',
    filters: [
      // ...
    ],
    filterSearch: true,
    width: '10%',
  },
]
