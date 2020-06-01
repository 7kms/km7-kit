import React from 'react';
import { useDispatch } from 'dva';
import { Form, Modal, Select, Input, Icon, Button, Card } from 'antd';
import styles from './index.less';


export interface ModalFormProps {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  visible: boolean;
  loading: boolean;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const Page: React.SFC<ModalFormProps> = props => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const handelSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const fieldsValue = await form.validateFields();
    console.log('Received values of form: ', fieldsValue);
    dispatch({
      type: 'global/login',
      params: fieldsValue,
    });
  };

  return (
    <Card title="Interview Admin" className={styles['login-form']}>
      <Form onSubmit={handelSubmit} form={form}>
        <Form.Item
          label="email"
          rules= {[{ required: true, message: 'Please input email!' }]}
        >
          <Input
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input Email"
            />
        </Form.Item>
        <Form.Item
          label="password"
          rules = {[
            { required: true, message: 'Please input password!' },
            { min: 8, message: '8 characters At least!' },
          ]}
        >
          <Input.Password
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input Password"
            />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles['login-form-button']}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Page;
