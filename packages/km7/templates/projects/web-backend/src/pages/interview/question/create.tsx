import React, { useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import { Form, Modal, Select, Input, Button, Icon, Card, Row, Col } from 'antd';
import Keywords from './components/Keywords';
import { IQuestion } from './model';
import { ICategory } from '../category/model';
import { FormComponentProps } from 'antd/es/form';
import { ITag } from '../tag/model';
import { LevelArr } from '@/data/questionLabel';
import { router } from 'umi';
import CreateFrom from './components/CreateForm';
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

interface CreateProps {}

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

const Page: React.SFC<CreateProps & FormComponentProps> = props => {
  const dispatch = useDispatch();
  const { getFieldDecorator } = props.form;
  const categoryList = useCategoryList();
  const [categoryId, setCateId] = useState();
  const tagList = useTagList(categoryId);
  const handelSubmit = (values: IQuestion) => {
    dispatch({
      type: 'interview_question/create',
      params: values,
      callback: (res: IQuestion) => {
        console.log(res);
        Modal.success({
          title: 'Notice',
          content: '创建成功',
          onOk: () => {
            router.push('/interview/question/list');
          },
        });
      },
    });
  };
  const handleCategoryChange = (value: string) => {
    setCateId(value);
  };
  return <CreateFrom title="Question Create" data={{} as IQuestion} onSubmit={handelSubmit} />;
};

export default Form.create()(Page);
