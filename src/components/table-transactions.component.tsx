import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { TxnTableContent } from '../interfaces/transaction.interface';

interface ITransactionTable {
  columns: ColumnsType<TxnTableContent>;
  data: any[];
  loading?: boolean;
  caption?: string;
}

const onChange: TableProps<TxnTableContent>['onChange'] = () => {
};

const Caption = (data: { caption: string }) => {
  return data.caption ? <div style={{padding: "10px", textAlign: "left"}}>{data.caption}</div> : <></>
}

const TransactionTable = (args: ITransactionTable) => (
  <Table
    size="small"
    columns={args.columns}
    dataSource={args.data}
    onChange={onChange}
    pagination={{ position: ['bottomCenter'] }}
    loading={args.loading || false}
    bordered={true}
    caption={ <Caption caption={args.caption || ""}/>}
  />
);

export default TransactionTable;
