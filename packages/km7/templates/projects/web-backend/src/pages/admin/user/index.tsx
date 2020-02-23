import React, { useState, useEffect } from 'react';
import { Table, Select, Card, Row, Col, Button, Divider, Popconfirm } from 'antd';
import CreateModal from './components/CreateModal';
import { IUser } from './model';
import { useSelector, useDispatch } from 'dva';
import { ConnectState } from '@/models/connect';
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
      type: 'admin_user/getList',
      params: params,
      callback: (list: T[]) => {
        setList(list);
      },
    });
  }, []);
  return [list, setList];
}
type ModalDataType = IUser;
const Page: React.SFC = props => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: ConnectState) => ({
    loading: state.loading.effects['admin_user/getList']
  }));
  const [modelState, setModelState] = useState({
    showModel: false,
    data: {} as ModalDataType,
  });
  const [paramsState, setParamsState] = useState({} as IParams);
  const [list, setList] = useList<IUser>(paramsState, []);
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'CreateTime',
      dataIndex: 'createdAt',
      // width: 100,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'action',
      // width: 150,
      render: (text: string, record: IUser) => (
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
  const handleDelete = (item: IUser) => {
    dispatch({
      type: 'admin_user/remove',
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
      data: { } as ModalDataType,
    });
  };
  const handleEdit = (item: IUser) => {
    const obj = { ...item };
    setModelState({
      showModel: true,
      data: obj as ModalDataType,
    });
  };

  const handelModelCallBackOk = (item: IUser) => {
    const action = item._id ? 'admin_user/update' : 'admin_user/create';
    dispatch({
      type: action,
      params: item,
      callback: (res: IUser) => {
        setModelState(state => {
          return {
            showModel: false,
            data: {} as ModalDataType,
          };
        });
        let newList = list;
        if (item._id) {
          newList = newList.map(obj => {
            if (obj._id === item._id) {
              return item;
            } else {
              return obj;
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
        <Table
          loading={loading}
          rowKey={(item: IUser) => item._id!}
          dataSource={list as IUser[]}
          columns={columns}
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
