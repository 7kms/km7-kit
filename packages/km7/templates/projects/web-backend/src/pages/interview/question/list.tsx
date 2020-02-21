import React, { useState, useEffect } from 'react';
import {
  List,
  Form,
  Avatar,
  Icon,
  Select,
  Card,
  Row,
  Col,
  Button,
  Divider,
  Popconfirm,
  Tag,
} from 'antd';
import styles from './index.less';
import { ICategory } from '../category/model';
import { IQuestion } from './model';
import { useSelector, useDispatch } from 'dva';
import { batch } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import moment from 'moment';
const { Option } = Select;

interface IParams {
  category?: string;
  page: number; //页码
  count: number; //每次请求的条数
}
function useList<T>(
  params: IParams,
  initialList: T[] = [],
): [{ total: number; list: T[] }, (list: T[]) => void] {
  const [listState, setListState] = useState({ list: initialList, total: initialList.length });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'interview_question/getList',
      params: params,
      callback: (res: { list: T[]; total: number }) => {
        setListState(res);
      },
    });
  }, [params]);
  const setList = (list: T[]) => {
    setListState({
      list,
      total: list.length,
    });
  };
  return [listState, setList];
}

const Page: React.SFC = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'interview_category/getList',
    });
  }, []);
  const { loading, categoryList } = useSelector((state: ConnectState) => ({
    loading: state.loading.effects['interview_question/getList'],
    categoryList: state.interview_category.list || [],
  }));
  const [paramsState, setParamsState] = useState({
    count: 20,
    page: 0,
  } as IParams);
  const [listState, setList] = useList<IQuestion>(paramsState, []);
  const handleDelete = (item: IQuestion) => {
    dispatch({
      type: 'interview_question/remove',
      params: item,
      callback: () => {
        const newList = listState.list.filter(obj => obj._id !== item._id);
        setList(newList);
      },
    });
  };
  const handelCreate = () => {
    router.push('/interview/question/create');
  };
  const handelEdit = (item: IQuestion) => {
    router.push(`/interview/question/edit/${item._id}`);
  };
  const handelCategoryChange = (value: string) => {
    setParamsState((state: IParams) => {
      return { ...state, ...{ category: value } };
    });
  };
  return (
    <>
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
              Question List
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
              <Button type="primary" onClick={handelCreate}>
                Create
              </Button>
            </Col>
          </Row>
        }
      >
        <Row>
          <Select
            style={{ width: 150 }}
            placeholder="Select Category!"
            value={paramsState.category}
            onChange={handelCategoryChange}
          >
            {categoryList.map((item, index) => {
              return (
                <Option key={index} value={item._id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Row>

        <List
          style={{ marginTop: 20 }}
          grid={{
            gutter: 16,
            xs: 1,
            md: 3,
          }}
          loading={loading}
          dataSource={listState.list}
          pagination={{
            total: listState.total,
            pageSize: 20,
          }}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card
                title={item.title}
                extra={moment(item.updatedAt).format('YYYY/MM/DD HH:mm')}
                actions={[
                  <Button
                    size="small"
                    icon="edit"
                    type="primary"
                    key={0}
                    onClick={() => handelEdit(item)}
                  />,
                  <Popconfirm title="Sure to delete?" key={1} onConfirm={() => handleDelete(item)}>
                    <Button size="small" icon="delete" type="danger" />
                  </Popconfirm>,
                ]}
              >
                <div>{item.category ? item.category.name : 'category 不存在'}</div>
                <div>
                  {item.keywords.map((keyword, index) => (
                    <Tag key={index}>{keyword}</Tag>
                  ))}
                </div>
                <div>{item.description}</div>
                <div>
                  {item.tags.map(tag => (
                    <Tag key={tag._id}>{tag.name}</Tag>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Page;
