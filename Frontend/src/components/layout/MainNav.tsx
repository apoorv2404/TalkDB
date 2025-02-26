// src/components/layout/MainNav.tsx
'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;

const MainNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { key: 'features', label: 'Features', href: '/features' },
    { key: 'pricing', label: 'Pricing', href: '/pricing' },
    { key: 'about', label: 'About', href: '/about' },
  ];

  // Find the active key based on current pathname
  const activeKey = menuItems.find(item => pathname === item.href)?.key;

  const renderMenuItems = () => (
    <>
      {menuItems.map(item => (
        <Menu.Item key={item.key}>
          <Link href={item.href}>{item.label}</Link>
        </Menu.Item>
      ))}
    </>
  );

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 50px',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <div style={{ flex: '0 1 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(to right, #1677ff, #06b6d4)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TalkDB
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div style={{ 
        flex: '1 1 auto',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <Menu 
          mode="horizontal" 
          selectedKeys={activeKey ? [activeKey] : []}
          style={{ 
            border: 'none',
            minWidth: 400,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {renderMenuItems()}
        </Menu>

        {/* Auth Buttons */}
        <div style={{ marginLeft: '24px' }}>
          <Link href="/auth/signin">
            <Button type="link">Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button type="primary">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
          style={{
            display: 'none',
            marginLeft: '16px',
            '@media (max-width: 768px)': {
              display: 'inline-flex'
            }
          }}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
      >
        <Menu mode="vertical" selectedKeys={activeKey ? [activeKey] : []}>
          {renderMenuItems()}
        </Menu>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/auth/signin">
            <Button type="link" block>Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button type="primary" block>Get Started</Button>
          </Link>
        </div>
      </Drawer>
    </Header>
  );
};

export default MainNav;