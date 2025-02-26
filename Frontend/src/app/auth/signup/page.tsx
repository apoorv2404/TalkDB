// src/app/auth/signup/page.tsx
'use client';

import React from 'react';
import { Layout } from 'antd';
import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

const { Content } = Layout;

const SignUpPage = () => {
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

        <SignUpForm />
      </div>
    </Content>
  );
};

export default SignUpPage;