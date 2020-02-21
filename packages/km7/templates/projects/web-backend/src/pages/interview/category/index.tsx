import React, { useState, useEffect } from 'react';
import { Table, Select, Card, Row, Col, Button, Divider, Popconfirm } from 'antd';
import CreateModal from './components/CreateModal';
import styles from './index.less';
import { ICategory } from './model';
import { useSelector, useDispatch } from 'dva';
import { ConnectState } from '@/models/connect';
const { Option } = Select;

function useList<T>(initialList: T[] = []): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [list, setList] = useState(initialList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'interview_category/getList',
      callback: (list: T[] = []) => {
        setList(list);
      },
    });
  }, []);
  return [list, setList];
}

const Page: React.SFC = props => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: ConnectState) => ({
    loading: state.loading.effects['interview_category/getList'],
  }));
  const [modelState, setModelState] = useState({
    showModel: false,
    data: {} as ICategory,
  });
  const [list, setList] = useList<ICategory>([]);
  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      render: (text: string, record: ICategory) => {
        return <img src={text} width="40" height="40" />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      // width: 100,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'action',
      // width: 150,
      render: (text: string, record: ICategory) => (
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
  const handleDelete = (item: ICategory) => {
    dispatch({
      type: 'interview_category/remove',
      params: item,
      callback: () => {
        const newList = list.filter(group => group._id !== item._id);
        setList(newList);
      },
    });
  };

  const openCreateModel = () => {
    setModelState({
      showModel: true,
      data: {} as ICategory,
    });
  };
  const handleEdit = (item: ICategory) => {
    setModelState({
      showModel: true,
      data: item,
    });
  };
  const handelModelCallBackOk = (item: ICategory) => {
    const action = item._id ? 'interview_category/update' : 'interview_category/create';
    dispatch({
      type: action,
      params: item,
      callback: (res: ICategory) => {
        setModelState(state => {
          return {
            showModel: false,
            data: {} as ICategory,
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
              Group Manage
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
          rowKey={(item: ICategory) => item._id!}
          dataSource={list as ICategory[]}
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
