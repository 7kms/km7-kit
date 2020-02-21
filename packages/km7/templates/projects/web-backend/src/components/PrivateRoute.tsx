import Redirect from 'umi/redirect';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { ConnectState } from '@/models/connect';
import { GlobalModelState } from '@/models/global';
const mapState2props = ({ global: { user, totalPermission } }: ConnectState) => {
  return { user, totalPermission };
};

class PrivateRoute extends PureComponent<GlobalModelState & { location: Location }, {}> {
  render() {
    const { totalPermission } = this.props;
    // 当前pathname
    let path = this.props.location.pathname;
    // 没有权限控制的路由
    const publicRouters = ['/exception/403', '/exception/404', '/exception/500', '/main'];
    // 检查当前pathname是否在菜单里面
    let hasRouter = false;

    // 递归查找 pathname
    (function recursion(tree) {
      for (let i = 0; i < tree.length; i++) {
        let item = tree[i];
        // 部分字段需要转成小写字符串
        if (path && item.link && path.toLowerCase().includes(item.link.toLowerCase())) {
          hasRouter = true;
          break;
        } else {
          if (Array.isArray(item.children) && item.children.length > 0) {
            recursion(item.children);
          }
        }
      }
    })(totalPermission!.children);
    if (publicRouters.includes(path) || hasRouter) {
      return <>{this.props.children}</>;
    }

    return <Redirect to="/exception/403" />;
  }
}

export default connect(mapState2props)(PrivateRoute);
