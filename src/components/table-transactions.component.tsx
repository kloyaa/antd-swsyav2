import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { TxnTableContent } from '../interfaces/transaction.interface';

interface ITransactionTable {
  columns: ColumnsType<TxnTableContent>, 
  data: TxnTableContent[]
}

const onChange: TableProps<TxnTableContent>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log('params', pagination, filters, sorter, extra);
};

const TransactionTable = (args: ITransactionTable) => (
  <Table  size="small"  columns={args.columns} dataSource={args.data} onChange={onChange} />
);

export default TransactionTable;
