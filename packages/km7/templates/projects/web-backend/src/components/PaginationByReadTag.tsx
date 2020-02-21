import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';

export default class PaginationByReadTag extends PureComponent<any, {}> {
  goPrev = () => {
    let { read_tag_arr } = this.props;
    let len = read_tag_arr.length;
    let read_tag;
    if (len - 2 < 0) {
      read_tag = '';
    } else {
      read_tag = read_tag_arr[len - 2];
    }
    if (len) {
      read_tag_arr.splice(len - 1, 1);
      // this.props.dispatch({
      //     type: 'Alaska_topic_manage/saveReadTagArr',
      //     payload: readTagArr
      // })
      this.props.saveReadTag({ arr: read_tag_arr, read_tag });
    }
    this.props.pageChange(read_tag);
    // let params = {
    //     ...this.props.queryParams,
    //     read_tag
    // }
    // this.props.dispatch({
    //     type: 'Alaska_topic_manage/setQueryParams',
    //     payload: params
    // })
    // this.props.dispatch({
    //     type: 'Alaska_topic_manage/list',
    //     payload: params
    // })
  };
  goNext = () => {
    let { read_tag, read_tag_arr } = this.props;
    // let params = {
    //     ...this.props.queryParams,
    //     read_tag: currentReadTag
    // }
    read_tag_arr.push(read_tag);
    // this.props.dispatch({
    //     type: 'Alaska_topic_manage/saveReadTagArr',
    //     payload: readTagArr
    // })
    // this.props.dispatch({
    //     type: 'Alaska_topic_manage/setQueryParams',
    //     payload: params
    // })
    this.props.saveReadTag({ arr: read_tag_arr, read_tag });
    this.props.pageChange(read_tag);

    // this.props.dispatch({
    //     type: 'Alaska_topic_manage/list',
    //     payload: params
    // })
  };
  render() {
    return (
      <div
        style={{ width: '100px', display: 'flex', float: 'right', justifyContent: 'space-between' }}
      >
        <Button onClick={this.goPrev}>
          <Icon type="left" />
        </Button>
        <Button onClick={this.goNext}>
          <Icon type="right" />
        </Button>
      </div>
    );
  }
}
