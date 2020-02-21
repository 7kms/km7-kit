import styles from './index.less';
import { Layout } from 'antd';
import React, { FC } from 'react';
const { Footer } = Layout;

interface Props {
  footerInfo: any;
}
const PagetFooter: FC<Props> = (props: Props) => {
  const copyRight = props.footerInfo ? props.footerInfo.copyRight : '';
  return <Footer className={styles.footer}>{copyRight}</Footer>;
};

export default PagetFooter;
