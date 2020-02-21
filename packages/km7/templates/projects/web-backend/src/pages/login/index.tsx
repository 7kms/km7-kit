import React from 'react';
import { useDispatch } from 'dva';
import { Form, Modal, Select, Input, Icon, Button, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import styles from './index.less';

const Page: React.SFC<FormComponentProps> = props => {
  const dispatch = useDispatch();
  const { getFieldDecorator } = props.form;
  const handelSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.form!.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'global/login',
          params: values,
        });
      }
    });
  };

  return (
    <Card title="Interview Admin" className={styles['login-form']}>
      <Form onSubmit={handelSubmit}>
        <Form.Item>
          {getFieldDecorator('email', {
            // initialValue: this.props.data.app,
            rules: [{ required: true, message: 'Please input email!' }],
          })(
            <Input
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please input password!' },
              { min: 8, message: '8 characters At least!' },
            ],
          })(
            <Input.Password
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input Password"
            />,
          )}
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

export default Form.create()(Page);
