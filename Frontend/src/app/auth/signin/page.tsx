// src/app/auth/signin/page.tsx
'use client';

import React from 'react';
import { Layout } from 'antd';
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

const { Content } = Layout;

const SignInPage = () => {
  return (
    <Content>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px'
      }}>
        <Link href="/" style={{ marginBottom: '48px' }}>
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

        <SignInForm />
      </div>
    </Content>
  );
};

export default SignInPage;