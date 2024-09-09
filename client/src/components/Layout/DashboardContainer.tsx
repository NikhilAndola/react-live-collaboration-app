import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme, Typography } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardContainer() {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', padding: 0, margin: 0 }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Typography.Title level={2} style={{ color: 'white', textAlign: 'center' }}>
          {collapsed ? 'C' : 'Collab'}
        </Typography.Title>

        <Menu
          theme='dark'
          mode='inline'
          selectable={false}
          items={[
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
            {
              label: 'nav 1',
            },
          ].map((item) => ({
            key: item?.label,
            icon: <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}>{item?.label[0]?.toUpperCase()}</Avatar>,
            label: item?.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
