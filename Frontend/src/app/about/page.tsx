'use client';

import React from 'react';
import { Layout, Typography, Row, Col, Card, Avatar, Divider } from 'antd';
import { 
  RocketOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Team members data
const teamMembers = [
  {
    name: 'Jane Cooper',
    role: 'CEO & Founder',
    image: '/api/placeholder/100/100', // We'll use placeholder for now
    bio: 'Former database engineer with 10+ years experience.',
    socials: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'Alex Turner',
    role: 'CTO',
    image: '/api/placeholder/100/100',
    bio: 'AI researcher and distributed systems expert.',
    socials: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Product',
    image: '/api/placeholder/100/100',
    bio: 'Product leader with focus on developer tools.',
    socials: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  }
];

export default function AboutPage() {
  return (
    <Content style={{ padding: '64px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={1}>
            Making Databases Accessible to Everyone
          </Title>
          <Paragraph style={{ fontSize: '18px', maxWidth: '800px', margin: '24px auto' }}>
            TalkDB was born from a simple idea: databases should be accessible to everyone, 
            not just SQL experts. We're on a mission to democratize data access.
          </Paragraph>
        </div>

        {/* Mission Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: '64px' }}>
          <Col xs={24} md={8}>
            <Card>
              <RocketOutlined style={{ fontSize: '24px', color: '#1677ff', marginBottom: '16px' }} />
              <Title level={4}>Our Mission</Title>
              <Paragraph>
                To transform how people interact with databases by making them accessible through natural language.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <TeamOutlined style={{ fontSize: '24px', color: '#1677ff', marginBottom: '16px' }} />
              <Title level={4}>Our Team</Title>
              <Paragraph>
                A diverse group of engineers, designers, and product thinkers passionate about data accessibility.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#1677ff', marginBottom: '16px' }} />
              <Title level={4}>Our Values</Title>
              <Paragraph>
                We believe in transparency, security, and putting our users first in everything we do.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Our Story Section */}
        <div style={{ margin: '64px 0' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>Our Story</Title>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                TalkDB started in 2024 when our founders recognized a common challenge: 
                the barrier between business users and their data. While working at various 
                tech companies, they saw how much time was spent translating business 
                questions into SQL queries.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                They envisioned a future where anyone could ask questions about their data 
                in plain English and get immediate answers. Using advanced AI and natural 
                language processing, they built TalkDB to bridge this gap.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <img 
                src="/api/placeholder/600/400" 
                alt="Our Story" 
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Team Section */}
        <div style={{ margin: '64px 0' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>Meet Our Team</Title>
          <Row gutter={[32, 32]} justify="center">
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card 
                  style={{ textAlign: 'center', height: '100%' }}
                  hoverable
                >
                  <Avatar 
                    src={member.image} 
                    size={100} 
                    style={{ marginBottom: '16px' }}
                  />
                  <Title level={4} style={{ marginBottom: '4px' }}>{member.name}</Title>
                  <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                    {member.role}
                  </Paragraph>
                  <Paragraph>{member.bio}</Paragraph>
                  <div style={{ marginTop: '16px' }}>
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkedinOutlined style={{ fontSize: '20px', margin: '0 8px' }} />
                    </a>
                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer">
                      <TwitterOutlined style={{ fontSize: '20px', margin: '0 8px' }} />
                    </a>
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer">
                      <GithubOutlined style={{ fontSize: '20px', margin: '0 8px' }} />
                    </a>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Contact Section */}
        <div style={{ 
          margin: '64px 0',
          padding: '48px',
          background: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Title level={2}>Get in Touch</Title>
          <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '24px auto' }}>
            Have questions about TalkDB? We'd love to hear from you. Get in touch with our team.
          </Paragraph>
          <a href="mailto:contact@talkdb.com">contact@talkdb.com</a>
        </div>
      </div>
    </Content>
  );
}