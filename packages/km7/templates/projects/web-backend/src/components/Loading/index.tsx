import React from 'react';
import styles from './index.less';
import { Spin } from 'antd';

interface ILoader {
  tip?: string;
}

const Loader: React.SFC<ILoader> = props => {
  const { tip } = props;
  return (
    <div className={styles.ndogLoading}>
      <Spin tip={tip || 'loading'} />
    </div>
  );
};
export default Loader;
