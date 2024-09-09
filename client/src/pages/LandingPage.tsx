import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { redirect, useNavigate, useNavigation } from 'react-router-dom';

type FieldType = {
  roomId?: string;
  username?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    message.success('Room joined.');

    navigate(`/room/${values?.roomId}`, { state: values.username });
  };

  return (
    <Form
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
      form={form}
    >
      <Form.Item<FieldType> label='Room ID' name='roomId' rules={[{ required: true, message: 'Please input a room ID!' }]}>
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label='Username' name='username' rules={[{ required: true, message: 'Please input a username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LandingPage;
