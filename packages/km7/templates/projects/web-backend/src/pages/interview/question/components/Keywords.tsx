import React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

class EditableTagGroup extends React.Component<{
  onChange?: (tags: string[]) => void;
  tags?: string[];
}> {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  inputRef = React.createRef<Input>();
  handleClose = (removedTag: string) => {
    const tags = this.props.tags!.filter(tag => tag !== removedTag);
    if (this.props.onChange) {
      this.props.onChange(tags);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.inputRef.current!.focus());
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.props;
    if (inputValue && tags!.indexOf(inputValue) === -1) {
      tags = [...tags!, inputValue];
    }
    this.setState(
      {
        inputVisible: false,
        inputValue: '',
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(tags!);
        }
      },
    );
  };
  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return (
      <div>
        {tags!.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.inputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
