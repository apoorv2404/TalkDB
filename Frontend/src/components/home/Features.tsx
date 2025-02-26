// src/components/home/Features.tsx
'use client';

import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { 
  DatabaseOutlined, 
  SecurityScanOutlined,
  ApiOutlined,
  TeamOutlined,
  HistoryOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Features = () => {
  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
      title: 'Multiple Database Support',
      description: 'Connect to multiple PostgreSQL databases and manage them all from one place.'
    },
    {
      icon: <SecurityScanOutlined style={{ fontSize: '24px' }} />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security measures to keep your data safe and secure.'
    },
    {
      icon: <ApiOutlined style={{ fontSize: '24px' }} />,
      title: 'API Access',
      description: 'Integrate TalkDB into your applications with our comprehensive API.'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      title: 'Team Collaboration',
      description: 'Share queries and insights with your team members seamlessly.'
    },
    {
      icon: <HistoryOutlined style={{ fontSize: '24px' }} />,
      title: 'Query History',
      description: 'Keep track of all your queries and their results for future reference.'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '24px' }} />,
      title: 'Performance Optimization',
      description: 'Automatically optimized queries for the best possible performance.'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '24px' }} />,
      title: 'Access Control',
      description: 'Fine-grained access control to manage who can access what data.'
    },
    {
      icon: <DashboardOutlined style={{ fontSize: '24px' }} />,
      title: 'Visual Insights',
      description: 'Turn your query results into beautiful visualizations instantly.'
    }
  ];

  return (
    <div style={{ padding: '80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Title level={2} style={{ 
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Everything You Need to Work with Data
        </Title>
        <Paragraph style={{ 
          textAlign: 'center',
          fontSize: '16px',
          color: '#666',
          marginBottom: '48px',
          maxWidth: '800px',
          margin: '0 auto 48px'
        }}>
          Powerful features to help you understand and analyze your data more effectively
        </Paragraph>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                bodyStyle={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{ 
                  width: '48px',
                  height: '48px',
                  borderRadius: '24px',
                  background: '#f0f5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {React.cloneElement(feature.icon, { style: { ...feature.icon.props.style, color: '#1677ff' } })}
                </div>
                <Title level={4} style={{ marginTop: 0, marginBottom: '8px' }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Features;