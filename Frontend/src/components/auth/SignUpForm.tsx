'use client';

import React from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';

const SignUpForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Implement signup logic
      console.log('Success:', values);
      message.success('Account created successfully!');
    } catch (error) {
      message.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Create your account</h2>
        <p style={{ color: '#666' }}>Start your 14-day free trial</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<GoogleOutlined />} 
          block 
          size="large"
          style={{ marginBottom: '12px' }}
          onClick={() => {
            // TODO: Implement Google sign in
            console.log('Google sign in');
          }}
        >
          Continue with Google
        </Button>

        <Button 
          icon={<GithubOutlined />} 
          block 
          size="large"
          onClick={() => {
            // TODO: Implement GitHub sign in
            console.log('GitHub sign in');
          }}
        >
          Continue with GitHub
        </Button>
      </div>

      <Divider>or</Divider>

      <Form
        form={form}
        name="signup"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <Input size="large" placeholder="Full name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={loading}
          >
            Create Account
          </Button>
        </Form.Item>

        <p style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: '#1677ff' }}>
            Sign in
          </Link>
        </p>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '24px' }}>
          By signing up, you agree to our{' '}
          <Link href="/terms" style={{ color: '#1677ff' }}>Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#1677ff' }}>Privacy Policy</Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;