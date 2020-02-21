import React, { PureComponent } from 'react';
import { Form, Modal, Select, Input, Button, Icon } from 'antd';
import Upload from '@/components/GlobalUpload';
import { FormComponentProps } from 'antd/lib/form/Form';
import { ICategory } from '../model';
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

interface CreateModalProps<T = ICategory> extends FormComponentProps {
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
        title={this.props.data._id ? 'Update Group' : 'Create Group'}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
        maskClosable={false}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Category Name">
            {getFieldDecorator('name', {
              initialValue: this.props.data.name,
              rules: [{ required: true, message: 'Please Input Category Name!' }],
            })(<Input placeholder="Input Category Name" />)}
          </Form.Item>
          <Form.Item label="Category Icon">
            {getFieldDecorator('icon', {
              initialValue: this.props.data.icon ? { url: this.props.data.icon } : null,
              valuePropName: 'url',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                action="/api/upload"
                onChange={this.handleChange}
              >
                {(() => {
                  if (this.state.imageLoading) {
                    return <Icon type="loading" />;
                  } else if (this.state.icon) {
                    return <img src={this.state.icon} style={{ width: '100%' }} />;
                  } else if (this.props.data.icon) {
                    return <img src={this.props.data.icon} style={{ width: '100%' }} />;
                  } else {
                    return (
                      <>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </>
                    );
                  }
                })()}
              </Upload>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<CreateModalProps>()(CreateModal);
