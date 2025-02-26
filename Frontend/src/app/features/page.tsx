'use client';

import React from 'react';
import { Layout, Typography } from 'antd';
import Features from '@/components/home/Features';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function FeaturesPage() {
  return (
    <Content style={{ padding: '64px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={1} style={{ 
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Features
        </Title>
        <Paragraph style={{ 
          textAlign: 'center',
          fontSize: '18px',
          marginBottom: '48px'
        }}>
          Discover all the powerful features TalkDB has to offer
        </Paragraph>
        <Features />
      </div>
    </Content>
  );
}