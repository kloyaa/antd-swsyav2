import React, { useState } from 'react';
import {
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
  {
    label: 'Swerte Saya',
    key: 'home',
    onClick: () => {
      alert('ss');
    },
    style: {
      fontWeight: 'bold',
    },
  },
  {
    label: 'Statement of Account',
    key: 'item-soa',
    icon: <CalendarOutlined />,
    disabled: true,
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Requests
      </a>
    ),
    style: {
      marginLeft: 'auto',
    },
    icon: <MailOutlined />,
    key: 'item-requests',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Active Users
      </a>
    ),

    icon: <TeamOutlined />,
    key: 'item-active-users',
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Activity Logs
      </a>
    ),
    icon: <FieldTimeOutlined />,
    key: 'item-activity-logs',
  },
  {
    label: 'Settings',
    key: 'SettingsMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Account',
        children: [
          {
            label: 'Change Password',
            key: 'setting:3',
          },
          {
            label: 'Sign out',
            key: 'setting:4',
          },
        ],
      },
      {
        type: 'group',
        label: 'System',
        children: [
          {
            label: 'Maintenance Mode',
            key: 'setting:1',
          },
          {
            label: 'Sign out',
            key: 'setting:2',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default App;
