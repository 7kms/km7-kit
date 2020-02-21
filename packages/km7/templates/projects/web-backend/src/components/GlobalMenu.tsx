/**
 * @desc 左侧菜单组件
 * */
import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'dva';
import { Menu, Icon } from 'antd';
import { mapQueryStrToObj } from '@/utils';
import router from 'umi/router';
import { IAppMenu } from '@/data/menu';
import { ClickParam, SelectParam } from 'antd/lib/menu';
const { SubMenu } = Menu;

interface Props {
  totalPermission: IAppMenu[];
  children?: React.ReactNode;
}
const isEmptyObject = (obj: object): boolean => {
  for (let i in obj) {
    if (i) {
      return true;
    }
  }
  return false;
};
const getKeysByPath2 = (totalPermission: IAppMenu[], pathname: string) => {
  // const selectedKeys: string[] = [];
  // const openKeys: string[] = [];
  const getTargetIndex = (
    list: IAppMenu[],
    parentKey?: string,
  ): {
    selectedKeys?: string[];
    openKeys?: string[];
  } => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      if (item.link && pathname.indexOf(item.link) > -1) {
        // 命中link, 返回 selectkeys
        return {
          selectedKeys: [key],
        };
      } else if (item.children && item.children.length > 0) {
        let { selectedKeys, openKeys = [] } = getTargetIndex(item.children, key);
        if (selectedKeys) {
          // children命中selectkey, 则当前menu必然是openkey
          return {
            selectedKeys,
            openKeys: [key, ...openKeys],
          };
        }
      }
    }
    return {};
  };
  const { selectedKeys = [], openKeys = [] } = getTargetIndex(totalPermission);
  return { selectedKeys, openKeys };
};

const renderSubMenu = (menu: IAppMenu[], parentKey: string | number) => {
  let submenu: React.ReactElement[] = [];
  menu.map((item, index) => {
    const key = `${parentKey}-${index}`;
    if (item.children && item.children.length) {
      submenu.push(
        <SubMenu key={key} title={item.title}>
          {renderSubMenu(item.children, key)}
        </SubMenu>,
      );
    } else {
      submenu.push(<Menu.Item key={key}>{item.title || ''}</Menu.Item>);
    }
  });
  return submenu;
};

/**
 * 通过key查找到对应的item
 * @param {String} keyStr
 */
const findItemByKey = ({ totalPermission }: Props, keyStr?: string) => {
  if (!keyStr) {
    return {};
  }
  const keyArr = keyStr.split('-');
  let target = null;
  let appName = '';
  while (keyArr.length > 0) {
    let index = keyArr.shift()!;
    if (target) {
      target = target.children[index];
    } else {
      target = totalPermission[index];
      appName = target.name;
    }
  }
  return { appName, ...target };
};

const generateRouteByLinkStr = (str: string): { pathname: string; query?: object } => {
  let [pathname, queryStr] = str.split('?');
  let query = mapQueryStrToObj(queryStr);
  let route = {};
  if (query && isEmptyObject(query)) {
    route = {
      pathname,
      query,
    };
  } else {
    route = {
      pathname,
    };
  }
  return route as { pathname: string; query?: object };
};

const GlobalMenue: FC<Props> = (props: Props) => {
  const location = useLocation();
  // const { selectedKeys: initialSelectKeys, openKeys: initialOpenKeys } = getKeysByPath(
  //   props.totalPermission,
  //   location.pathname,
  // );
  const [selectedKeys, setSelectKeys] = useState([] as string[]);
  const [openKeys, setOpenKeys] = useState([] as string[]);

  useEffect(() => {
    // console.log('GlobalMenue useEffect')
    const { selectedKeys, openKeys } = getKeysByPath2(props.totalPermission, location.pathname);
    // console.log(location.pathname, selectedKeys, openKeys)
    setSelectKeys(selectedKeys);
    setOpenKeys(openKeys);
  }, [location, props.totalPermission]);

  const handleClick = async ({ item, key, keyPath, domEvent }: ClickParam) => {
    // console.log({ item, key, keyPath, domEvent });
    const targetItem = findItemByKey(props, key);
    router.push(`${targetItem.link}`);
  };

  const menuDataRender = () => {
    let { totalPermission } = props;
    let menu = totalPermission.map((app, index) => {
      return (
        <SubMenu
          key={index}
          title={
            <div style={{ fontSize: '16px', lineHeight: '40px' }}>
              <span>{app.title}</span>
            </div>}
        >
          {app.children && renderSubMenu(app.children, index)}
        </SubMenu>
      );
    });
    return menu;
  };
  const onOpenChange = (openKeys: any[]) => {
    // console.log('onOpenChange =========', openKeys);
    // if (openKeys.length > 1) {
    //   const lastKey = openKeys.pop();
    //   if (lastKey.indexOf(openKeys[0]) == 0) {
    //     openKeys = [openKeys[0], lastKey];
    //   } else {
    //     openKeys = [lastKey];
    //   }
    // }
    setOpenKeys(openKeys);
  };
  const onSelect = ({ item, key, keyPath, selectedKeys, domEvent }: SelectParam) => {
    console.log('onSelect =========', { item, key, keyPath, selectedKeys, domEvent });
    setSelectKeys(selectedKeys);
  };
  // console.log('----------- render GlobalMenu ----------------')
  // console.log('selectedKeys',selectedKeys)
  // console.log('openKeys', openKeys)
  return (
    <Menu
      style={{ paddingTop: '16px', border: 'none' }}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onClick={handleClick}
      onOpenChange={onOpenChange}
      // onSelect={onSelect}
      mode="inline"
    >
      {menuDataRender()}
    </Menu>
  );
};

export default GlobalMenue;
