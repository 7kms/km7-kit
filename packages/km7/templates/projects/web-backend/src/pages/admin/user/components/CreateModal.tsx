import React, { PureComponent } from 'react';
import { Form, Modal, Select, Input, Button, Icon } from 'antd';
import Upload from '@/components/GlobalUpload';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IUser } from '../model';
import { UploadChangeParam } from 'antd/es/upload';
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface CreateModalProps<T = IUser> extends FormComponentProps {
  data: T;
  visible: boolean;
  onOk: (item: T) => void;
  onCancel: () => void;
}

class CreateModal extends PureComponent<
  CreateModalProps,
  {
    imageLoading: boolean;
    icon?: string;
  }
> {
  state = {
    imageLoading: false,
    icon: '',
  };
  handleChange = ({ file }: UploadChangeParam) => {
    // console.log(`handleChange`, file)
    if (file.response && file.status === 'done') {
      this.setState({
        imageLoading: false,
        icon: file.response.result.url,
      });
    } else if (file.error) {
      this.setState({ imageLoading: false });
    } else {
      this.setState({ imageLoading: true });
    }
  };
  normFile = (e: any) => {
    return (e && e.file && e.file.response && e.file.response.result) || {};
  };
  handleOk = () => {
    this.props.form!.validateFields((err, values) => {
      if (!err) {
        const res = Object.assign({}, this.props.data, values);
        res.icon = res.icon ? res.icon.url : '';
        this.props.onOk(res);
      }
    });
  };
  componentDidUpdate(lastProps: CreateModalProps) {
    if (lastProps.visible !== this.props.visible && this.props.visible === false) {
      this.props.form.resetFields();
      this.setState({ icon: '' });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.props.data._id ? 'Update Tag' : 'Create Tag'}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
            initialValue: this.props.data.email,
            rules: [{ required: true, message: 'Please input email!' }],
          })(
            <Input
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input Email"
            />,
          )}
          </Form.Item>
          <Form.Item label="Password">
            {getFieldDecorator('password', {
              initialValue: '',
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
        </Form>
      </Modal>
    );
  }
}

export default Form.create<CreateModalProps>()(CreateModal);
