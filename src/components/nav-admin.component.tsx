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
import { useNavigate } from 'react-router-dom';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Dashboard',
      key: 'item-dashboard',
      onClick: () => navigate('/a/dashboard', { replace: true }),
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
      label: 'Requests',
      style: {
        marginLeft: 'auto',
      },
      icon: <MailOutlined />,
      onClick: () => navigate('/a/requests', { replace: true }),
      key: 'item-requests',
    },
    {
      label: 'Active Users',
      icon: <TeamOutlined />,
      onClick: () => navigate('/a/users', { replace: true }),
      key: 'item-active-users',
    },
    {
      label: 'Activity Logs',
      icon: <FieldTimeOutlined />,
      onClick: () => navigate('/a/activities', { replace: true }),
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
              onClick: () => navigate('/', { replace: true }),
            },
          ],
        },
      ],
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default AdminNavbar;
