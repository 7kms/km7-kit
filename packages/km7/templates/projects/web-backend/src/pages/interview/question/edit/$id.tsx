import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import { router } from 'umi';
import { UmiPageProps } from '@/models';
import { useSelector, useDispatch } from 'dva';
import { IQuestion } from '../model';
import { ConnectState } from '@/models/connect';
import CreateForm from '../components/CreateForm';

const Page: React.SFC<UmiPageProps> = props => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: ConnectState) => {
    return {
      loading: state.loading.global || state.loading.effects['interview_question/getById'],
    };
  });
  const [currentQues, setQuestion] = useState<IQuestion>();
  useEffect(() => {
    dispatch({
      type: 'interview_question/getById',
      params: {
        id: (props.match.params as { id: string }).id,
      },
      callback: (res: IQuestion) => {
        setQuestion(res);
      },
    });
  }, []);
  // console.log(props.match.params);
  // console.log(currentQues);
  const handelSubmit = (values: IQuestion) => {
    dispatch({
      type: 'interview_question/update',
      params: values,
      callback: (res: IQuestion) => {
        console.log(res);
        Modal.success({
          title: 'Notice',
          content: '修改成功',
          onOk: () => {
            router.push('/interview/question/list');
          },
        });
      },
    });
  };
  return (
    <Spin spinning={loading}>
      {currentQues && (
        <CreateForm title="Edit Question" data={currentQues} onSubmit={handelSubmit} />
      )}
    </Spin>
  );
};

export default Page;
