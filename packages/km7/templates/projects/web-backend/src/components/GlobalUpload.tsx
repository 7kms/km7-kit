import React from 'react';
import { Upload as AntdUpload } from 'antd';
import AppConfig from '@/config';
import { UploadProps, DraggerProps } from 'antd/es/upload';

const defaultProps = {
  withCredentials: true,
};

type INTUploadProps = UploadProps & {
  children: React.ReactChild;
};

type INTDraggerProps = DraggerProps & {
  children: React.ReactChild;
};

class Dragger extends React.Component<INTDraggerProps> {
  render() {
    let { action, children, ...props } = this.props;
    if (typeof action === 'string' && action.indexOf('http') !== 0) {
      action = AppConfig.api.project + action;
    }
    return (
      <AntdUpload.Dragger action={action} {...{ ...defaultProps, ...props }}>
        {children}
      </AntdUpload.Dragger>
    );
  }
}

// export default Upload
export default class Upload extends React.Component<INTUploadProps, {}> {
  static Dragger: typeof Dragger;
  render() {
    let { action, children, ...rest } = this.props;
    if (typeof action === 'string' && action.indexOf('http') !== 0) {
      action = AppConfig.api.project + action;
    }
    return (
      <AntdUpload action={action} {...{ ...defaultProps, ...rest }}>
        {children}
      </AntdUpload>
    );
  }
}

Upload.Dragger = Dragger;
