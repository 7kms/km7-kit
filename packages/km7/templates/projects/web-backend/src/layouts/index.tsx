import { Layout, BackTop } from 'antd';
import { useSelector, useLocation } from 'dva';
import React, { useState } from 'react';
import styles from './index.less';
import Header from './Header';
import Sider from './Sider';
import {withRouter, useHistory} from 'umi';
import Loading from '@/components/Loading';
import { ConnectState } from '@/models/connect';
import { RouteComponentProps } from 'react-router-dom';
const { Content } = Layout;

const goHome = () => {
  useHistory().replace('/')
};

const useLayoutToggle = () => {
  const toggle = !!localStorage.getItem('layout-toggle');
  const [isCollapsed, setCollapse] = useState(toggle);
  const setState = (toggle: boolean) => {
    localStorage.setItem('layout-toggle', toggle ? '1' : '');
    setCollapse(toggle);
  };
  return [isCollapsed, setState] as [boolean, (e: React.SetStateAction<boolean>) => void];
};

const PageLayout: React.SFC<RouteComponentProps> = props => {
  const [isCollapsed, setCollapse] = useLayoutToggle();
  const { user, totalPermission } = useSelector((state: ConnectState) => {
    return {
      user: state.global.user,
      totalPermission: state.global.totalPermission,
    };
  });
  const handelToggle = () => {
    setCollapse(!isCollapsed);
  };
  const getBackTopContainer = () => {
    const target = document.getElementById('right-content') as HTMLElement;
    return target;
  };
  const location = useLocation();
  const { children } = props;
  if (location.pathname === '/login') {
    return (
      <Layout className={styles.layout} id="right-content">
        <Content className={styles.content}>
          {children}
          <BackTop target={getBackTopContainer} />
        </Content>
      </Layout>
    );
  } else if (!user) {
    return <Loading />;
  } else {
    return (
      <Layout className={styles.layout}>
        <Sider collapsed={isCollapsed} goHome={goHome} totalPermission={totalPermission} />
        <Layout className={styles.layout} id="right-content">
          <Header toggle={handelToggle} collapsed={isCollapsed} user={user!} />
          <Content className={styles.content}>
            {children}
            <BackTop target={getBackTopContainer} />
          </Content>
        </Layout>
      </Layout>
    );
  }
};

export default withRouter(PageLayout);
