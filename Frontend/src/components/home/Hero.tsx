// src/components/home/Hero.tsx
'use client';

import React from 'react';
import { Typography, Button, Row, Col, Card } from 'antd';
import { DatabaseOutlined, MessageOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const Hero = () => {
  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'Multiple Databases',
      description: 'Connect and query any PostgreSQL database seamlessly'
    },
    {
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'Natural Language',
      description: 'Ask questions in plain English and get instant answers'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'Lightning Fast',
      description: 'Get results in milliseconds with optimized queries'
    }
  ];

  return (
    <div style={{ 
      padding: '80px 0', 
      background: 'linear-gradient(180deg, rgba(22,119,255,0.05) 0%, rgba(255,255,255,1) 100%)'
    }}>
      <Row justify="center" align="middle" style={{ padding: '0 20px' }}>
        <Col xs={24} style={{ textAlign: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <Title level={1} style={{ 
            fontSize: '48px',
            marginBottom: '24px',
            background: 'linear-gradient(to right, #1677ff, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Talk to Your Database Using Natural Language
          </Title>
          
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#666', 
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}>
            Transform how you interact with your data. Ask questions in plain English 
            and get instant insights from your database. No SQL knowledge required.
          </Paragraph>

          <div style={{ marginBottom: '60px' }}>
            <Link href="/auth/signup">
              <Button type="primary" size="large" style={{ 
                marginRight: '16px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px'
              }}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/features">
              <Button size="large" style={{ 
                height: '48px',
                padding: '0 32px',
                fontSize: '16px'
              }}>
                Learn More
              </Button>
            </Link>
          </div>

          <Row gutter={[32, 32]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card bordered={false} style={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}>
                  {feature.icon}
                  <Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>
                    {feature.title}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Hero;