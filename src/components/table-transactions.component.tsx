import React from 'react';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { currency } from '../utils/converter.util';

interface DataType {
  key: React.Key;
  name: string;
  amount: string;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
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
    title: 'Amount',
    dataIndex: 'amount',
    sorter: (a, b) => parseInt(a.amount.substring(1, a.amount.length -3 )) - parseInt(b.amount.substring(1, b.amount.length -3 )) ,
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
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    amount: currency.format(32),
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    amount: currency.format(100),
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    amount: currency.format(50),
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    amount: currency.format(63),
    address: 'London No. 2 Lake Park',
  },
];


const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log('params', pagination, filters, sorter, extra);
};

const TransactionTable: React.FC = () => (
  <Table  size="small"  columns={columns} dataSource={data} onChange={onChange} />
);

export default TransactionTable;
