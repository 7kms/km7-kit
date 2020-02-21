import React, { useState, useEffect } from 'react';
import { Table, Select, Card, Row, Col, Button, Divider, Popconfirm } from 'antd';
import CreateModal from './components/CreateModal';
import styles from './index.less';
import { ITag } from './model';
import { useSelector, useDispatch } from 'dva';
import { batch } from 'react-redux';
import { ConnectState } from '@/models/connect';
import { ICategory } from '../category/model';
const { Option } = Select;

interface IParams {
  category?: string;
}
function useList<T>(
  params: IParams,
  initialList: T[] = [],
): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [list, setList] = useState(initialList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'interview_tag/getList',
      params: params,
      callback: (list: T[]) => {
        setList(list);
      },
    });
  }, [params]);
  return [list, setList];
}
type ModalDataType = ITag & { category?: string };
const Page: React.SFC = props => {
  const dispatch = useDispatch();
  const { loading, categoryList } = useSelector((state: ConnectState) => ({
    loading: state.loading.effects['interview_tag/getList'],
    categoryList: state.interview_category.list || [],
  }));
  const [modelState, setModelState] = useState({
    showModel: false,
    data: {} as ModalDataType,
  });
  const [paramsState, setParamsState] = useState({} as IParams);
  const [list, setList] = useList<ITag>(paramsState, []);
  useEffect(() => {
    dispatch({
      type: 'interview_category/getList',
      params: paramsState,
    });
  }, []);
  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      render: (text: string, record: ITag) => {
        return <img src={text} width="40" height="40" />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (cate: ICategory, record: ITag) => {
        return <span>{cate && cate.name}</span>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'action',
      // width: 150,
      render: (text: string, record: ITag) => (
        <>
          <Button size="small" icon="edit" type="primary" onClick={() => handleEdit(record)} />
          <Divider type="vertical" />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
            <Button size="small" icon="delete" type="danger" />
          </Popconfirm>
        </>
      ),
    },
  ];
  const handleDelete = (item: ITag) => {
    dispatch({
      type: 'interview_tag/remove',
      params: item,
      callback: () => {
        const newList = list.filter(obj => obj._id !== item._id);
        setList(newList);
      },
    });
  };

  const openCreateModel = () => {
    setModelState({
      showModel: true,
      data: { category: paramsState.category } as ModalDataType,
    });
  };
  const handleEdit = (item: ITag) => {
    const obj = { ...item, ...{ category: item.category._id } };
    setModelState({
      showModel: true,
      data: obj as ModalDataType,
    });
  };
  const handelCategoryChange = (value: string) => {
    setParamsState((state: IParams) => {
      return { ...state, ...{ category: value } };
    });
  };
  const handelModelCallBackOk = (item: ITag) => {
    const action = item._id ? 'interview_tag/update' : 'interview_tag/create';
    dispatch({
      type: action,
      params: item,
      callback: (res: ITag) => {
        setModelState(state => {
          return {
            showModel: false,
            data: {} as ModalDataType,
          };
        });
        let newList = list;
        if (item._id) {
          newList = newList.map(group => {
            if (group._id === item._id) {
              return item;
            } else {
              return group;
            }
          });
        } else {
          newList.unshift(res);
        }
        setList(newList);
      },
    });
  };
  const handelModelCallBackCancel = () => {
    setModelState(state => {
      return {
        showModel: false,
        data: state.data,
      };
    });
  };
  return (
    <>
      <CreateModal
        categoryList={categoryList}
        data={modelState.data}
        visible={modelState.showModel}
        onOk={handelModelCallBackOk}
        onCancel={handelModelCallBackCancel}
      />
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
              Tag Manage
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
              <Button type="primary" onClick={openCreateModel}>
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
        <Table
          loading={loading}
          rowKey={(item: ITag) => item._id!}
          dataSource={list as ITag[]}
          columns={columns}
          className={styles['table']}
          pagination={false}
          scroll={{
            x: true,
          }}
        />
      </Card>
    </>
  );
};

export default Page;
