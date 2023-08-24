import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';

interface IStatistics {
  txnTotal: number;
  txnCount: number;
  swtTotal: number;
  stlCount: number;
  txnRevenue: number;
}
const formatter = (value: any) => (
  <CountUp end={value} separator="," duration={4} />
);

const Statistics = (data: IStatistics) => (
  <Row style={{ justifyContent: 'space-between' }}>
    <Row gutter={16}>
      <Col>
        <Statistic
          title="Revenue (PHP)"
          value={data.txnTotal}
          formatter={formatter}
          style={{ background: 'white', padding: '20px', borderRadius: '10px' }}
        />
      </Col>
      <Col style={{ opacity: data.txnRevenue === 0 ? 0.3 : 1}}>
        <Statistic
          title="Income (PHP)"
          value={data.txnRevenue}
          formatter={formatter}
          style={{ background: 'white', padding: '20px', borderRadius: '10px' }}
        />
      </Col>
    </Row>
    <Row gutter={16}>
      <Col>
        <Statistic
          title="Transactions"
          value={data.txnCount}
          formatter={formatter}
          style={{ background: 'white', padding: '20px', borderRadius: '10px' }}
        />
      </Col>
      <Col>
        <Statistic
          title="3D Numbers"
          value={data.swtTotal}
          formatter={formatter}
          style={{ background: 'white', padding: '20px', borderRadius: '10px' }}
        />
      </Col>
      <Col>
        <Statistic
          title="STL Numbers"
          value={data.stlCount}
          formatter={formatter}
          style={{ background: 'white', padding: '20px', borderRadius: '10px' }}
        />
      </Col>
    </Row>
  </Row>
);

export default Statistics;
