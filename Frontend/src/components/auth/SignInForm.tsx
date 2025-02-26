'use client';

import React from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import Link from 'next/link';

const SignInForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Implement signin logic
      console.log('Success:', values);
      message.success('Signed in successfully!');
    } catch (error) {
      message.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Welcome back</h2>
        <p style={{ color: '#666' }}>Sign in to your account</p>
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
        name="signin"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
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
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Form.Item 
            name="remember" 
            valuePropName="checked" 
            style={{ marginBottom: 0 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link 
            href="/auth/forgot-password" 
            style={{ color: '#1677ff' }}
          >
            Forgot password?
          </Link>
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={loading}
          >
            Sign In
          </Button>
        </Form.Item>

        <p style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: '#1677ff' }}>
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;