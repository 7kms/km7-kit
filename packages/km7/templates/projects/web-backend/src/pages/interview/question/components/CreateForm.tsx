import React, { useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import { Form, Modal, Select, Input, Button, Icon, Card, Row, Col } from 'antd';
import Keywords from './Keywords';
import { IQuestion } from '../model';
import { ICategory } from '../../category/model';
import { FormComponentProps } from 'antd/es/form';
import { ITag } from '../../tag/model';
import { LevelArr } from '@/data/questionLabel';
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

interface CreateProps extends FormComponentProps {
  title: string;
  data: IQuestion;
  onSubmit: (data: IQuestion) => void;
}

const useCategoryList = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState<ICategory[]>([]);
  useEffect(() => {
    dispatch({
      type: 'interview_category/getList',
      callback: (res: ICategory[]) => {
        setList(res);
      },
    });
  }, []);
  return list;
};

const useTagList = (categoryId?: string) => {
  const dispatch = useDispatch();
  const [list, setList] = useState<ITag[]>([]);
  useEffect(() => {
    if (!categoryId) {
      return;
    }
    dispatch({
      type: 'interview_tag/getList',
      params: { category: categoryId },
      callback: (res: ITag[]) => {
        setList(res);
      },
    });
  }, [categoryId]);
  return list;
};

const Page: React.SFC<CreateProps> = props => {
  const { getFieldDecorator } = props.form;
  const categoryList = useCategoryList();
  const [categoryId, setCateId] = useState(props.data.category ? props.data.category._id : '');
  const tagList = useTagList(categoryId);
  const handelSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const obj = Object.assign({}, props.data, values);
        props.onSubmit(obj);
      }
    });
  };
  const handleCategoryChange = (value: string) => {
    setCateId(value);
  };
  return (
    <Card
      style={{
        width: '100%',
      }}
      title={
        <Row
          type="flex"
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
          }}
        >
          <Col
            span={4}
            style={{
              lineHeight: '32px',
            }}
          >
            {props.title}
          </Col>
        </Row>
      }
      extra={
        <Row
          type="flex"
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
          }}
        >
          <Col>
            <Button type="primary" onClick={handelSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      }
    >
      <Form {...formItemLayout}>
        <Form.Item label="title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please Input Title!' }],
            initialValue: props.data.title,
          })(<Input placeholder="Input title" />)}
        </Form.Item>
        <Form.Item label="keywords">
          {getFieldDecorator('keywords', {
            rules: [{ required: true, message: 'Please Input keywords!' }],
            initialValue: props.data.keywords || [],
            valuePropName: 'tags',
          })(<Keywords />)}
        </Form.Item>
        <Form.Item label="description">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please Input description!' }],
            initialValue: props.data.description,
          })(<TextArea placeholder="Input description" autoSize={{ minRows: 2, maxRows: 5 }} />)}
        </Form.Item>
        <Form.Item label="category">
          {getFieldDecorator('category', {
            rules: [{ required: true, message: 'Please Input Category!' }],
            initialValue: props.data.category ? props.data.category._id : '',
          })(
            <Select
              placeholder="Select Category"
              onChange={handleCategoryChange}
              optionLabelProp="label"
            >
              {categoryList.map(item => (
                <Option value={item._id} key={item._id} label={item.name}>
                  <img src={item.icon} width={40} height={40} />
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="tags">
          {getFieldDecorator('tags', {
            rules: [{ required: true, message: 'Please Input tags!' }],
            initialValue: props.data.tags ? props.data.tags.map(item => item._id) : [],
          })(
            <Select placeholder="Select tags" mode="multiple" optionLabelProp="label">
              {tagList.map(item => (
                <Option value={item._id} key={item._id} label={item.name}>
                  <img src={item.icon} width={40} height={40} />
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="level">
          {getFieldDecorator('level', {
            rules: [{ required: true, message: 'Please Select level!' }],
            initialValue: props.data.level,
          })(
            <Select placeholder="Select level">
              {LevelArr.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="content">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: 'Please Input content!' }],
            initialValue: props.data.content,
          })(<TextArea placeholder="Input content" autoSize={{ minRows: 20, maxRows: 50 }} />)}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Form.create<CreateProps>()(Page);
