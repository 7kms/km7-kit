import { Icon, Layout } from 'antd';
import React from 'react';
import styles from './index.less';
import GlobalMenu from '@/components/GlobalMenu';
import { IAppMenu } from '@/data/menu';

const { Sider } = Layout;

interface SiderProps {
  totalPermission: IAppMenu[];
  collapsed: boolean;
  goHome: () => void;
}

const CustomSider: React.SFC<SiderProps> = props => {
  const handelClick = () => {
    props.goHome();
  };
  return (
    <Sider
      collapsible={true}
      width={280}
      theme="light"
      className={styles.sider}
      breakpoint="lg"
      trigger={null}
      collapsed={props.collapsed}
      collapsedWidth={0}
    >
      <div className={styles.logo} onClick={handelClick}>
        <Icon type="home" theme="outlined" />
        Home
      </div>
      <div className={styles.menusCon}>
        <GlobalMenu totalPermission={props.totalPermission} />
      </div>
    </Sider>
  );
};

export default CustomSider;
