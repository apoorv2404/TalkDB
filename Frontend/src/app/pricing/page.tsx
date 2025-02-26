'use client';

import React from 'react';
import { Layout, Typography, Card, Button, List } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const plans = [
  {
    title: 'Hobby',
    price: '$19',
    description: 'Perfect for side projects and small applications',
    features: [
      'Up to 2 databases',
      '1,000 queries/month',
      'Basic support',
      'Query history (7 days)',
      'Standard security'
    ]
  },
  {
    title: 'Pro',
    price: '$49',
    description: 'For growing teams and applications',
    features: [
      'Up to 10 databases',
      '10,000 queries/month',
      'Priority support',
      'Query history (30 days)',
      'Advanced security',
      'Team collaboration',
      'API access'
    ],
    popular: true
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited databases',
      'Unlimited queries',
      '24/7 dedicated support',
      'Unlimited query history',
      'Enterprise security',
      'Advanced collaboration',
      'Custom integrations',
      'SLA guarantee'
    ]
  }
];

export default function PricingPage() {
  return (
    <Content style={{ padding: '64px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={1} style={{ 
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Simple, Transparent Pricing
        </Title>
        <Paragraph style={{ 
          textAlign: 'center',
          fontSize: '18px',
          marginBottom: '48px'
        }}>
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </Paragraph>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          padding: '24px'
        }}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={plan.popular ? 'popular' : ''}
              style={{
                height: '100%',
                borderColor: plan.popular ? '#1677ff' : undefined,
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}
              headStyle={{
                backgroundColor: plan.popular ? '#1677ff' : undefined,
                color: plan.popular ? 'white' : undefined,
              }}
              title={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{plan.title}</div>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold',
                    margin: '16px 0'
                  }}>
                    {plan.price}
                    {plan.price !== 'Custom' && <span style={{ fontSize: '16px' }}>/month</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: plan.popular ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.45)' }}>
                    {plan.description}
                  </div>
                </div>
              }
            >
              <List
                dataSource={plan.features}
                renderItem={(feature) => (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <CheckCircleOutlined style={{ color: '#1677ff', marginRight: '8px' }} />
                    {feature}
                  </List.Item>
                )}
              />
              <Button 
                type={plan.popular ? 'primary' : 'default'}
                size="large"
                block
                style={{ marginTop: '24px' }}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '64px',
          padding: '32px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <Title level={3}>Need a custom solution?</Title>
          <Paragraph>
            Contact our sales team for a customized plan that fits your specific needs.
          </Paragraph>
          <Button type="primary" size="large">
            Contact Sales
          </Button>
        </div>
      </div>
    </Content>
  );
}