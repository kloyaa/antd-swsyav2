import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';

interface IStatistics {
  txnTotal: number
  txnCount: number
  swtTotal: number
  stlCount: number
}
const formatter = (value: any) => <CountUp end={value} separator="," />;

const Statistics = (data: IStatistics) => (
  <Row style={{ justifyContent: "space-between"}}>
    <Col>
      <Statistic
        title="Gross (PHP)"
        value={data.txnTotal}
        formatter={formatter}
        style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
      />
    </Col>
    <Row  gutter={16}>
        <Col>
        <Statistic
            title="Transactions"
            value={data.txnCount}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
        <Col>
        <Statistic
            title="3D Numbers"
            value={data.swtTotal}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
        <Col>
        <Statistic
            title="STL Numbers"
            value={data.stlCount}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
    </Row>
  </Row>
);

export default Statistics;
