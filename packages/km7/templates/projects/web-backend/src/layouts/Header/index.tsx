import { Dropdown, Form, Icon, Input, Layout, Menu, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'dva';
import { IUser } from '@/models/global';
import styles from './index.less';
import { ClickParam } from 'antd/lib/menu';
const { Header } = Layout;
const FormItem = Form.Item;

interface HeaderProps {
  collapsed: boolean;
  user: IUser;
  toggle: () => void;
}

const MyHeader: React.SFC<HeaderProps> = props => {
  const dispatch = useDispatch();
  const [headerState, setHeaderState] = useState({
    pwd: '',
    visible: false,
  });
  const { user } = props;
  const onMenuClick = ({ key }: ClickParam) => {
    if (key === '1') {
      setHeaderState({
        pwd: '',
        visible: true,
      });
    }
    if (key === '2') {
      dispatch({ type: 'global/logout' });
    }
  };
  const handleOk = () => {
    if (!headerState.pwd) {
      message.error('the password is required');
      return;
    }
    dispatch({
      params: { pwd: headerState.pwd },
      type: 'global/resetPwd',
      callback: () => {
        setHeaderState({
          pwd: '',
          visible: false,
        });
      },
    });
  };

  const handleCancel = () => {
    setHeaderState({
      pwd: '',
      visible: false,
    });
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    setHeaderState({
      visible: true,
      pwd: event.target.value,
    });
  };
  const renderMenu = () => {
    return (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="1">
          <Icon style={{ marginRight: '8px' }} type="edit" />
          reset password
        </Menu.Item>
        <Menu.Item key="2">
          <Icon style={{ marginRight: '8px' }} type="logout" />
          logout
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <Header className={styles.header}>
      <Icon
        className={styles.trigger}
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={props.toggle}
      />
      <div className={styles.right}>
        <Dropdown overlay={renderMenu()}>
          <a className="ant-dropdown-link">
            <Icon type="user" /> {user && user.email} <Icon type="down" />
          </a>
        </Dropdown>
      </div>

      <Modal
        title="Reset Password"
        visible={headerState.visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <FormItem
          labelCol={{
            sm: { span: 6 },
            xs: { span: 6 },
          }}
          wrapperCol={{
            sm: { span: 16 },
            xs: { span: 16 },
          }}
          label="Password"
        >
          <Input onChange={handleChange} type="password" value={headerState.pwd} />
        </FormItem>
      </Modal>
    </Header>
  );
};

export default MyHeader;
