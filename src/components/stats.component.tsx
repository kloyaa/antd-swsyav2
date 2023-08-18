import React from 'react';
import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';

const formatter = (value: any) => <CountUp end={value} separator="," />;

const Statistics: React.FC = () => (
  <Row style={{ justifyContent: "space-between"}}>
    <Col>
      <Statistic
        title="Daily Gross (PHP)"
        value={112893}
        formatter={formatter}
        style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
      />
    </Col>
    <Row  gutter={16}>
        <Col>
        <Statistic
            title="Numbers"
            value={112893}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
        <Col>
        <Statistic
            title="3D Numbers"
            value={112893}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
        <Col>
        <Statistic
            title="STL Numbers"
            value={112893}
            formatter={formatter}
            style={{ background: 'white', padding: '20px', borderRadius: "10px" }}
        />
        </Col>
    </Row>
  </Row>
);

export default Statistics;
