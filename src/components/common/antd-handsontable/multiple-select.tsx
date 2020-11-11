/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Select, message } from 'antd';
import { isArray } from 'lodash';

const { Option } = Select;
// 定义类型
interface Params {
  value?: any;
  dataSource: any[];
  placeholder: string;
  onSearch?: any;
  onChange: any;
  onFocus: any;
  loopKey?: string;
  loopName?: string;
  limit?: number | undefined; // 选择数量限制
  style?: any;
}

/**
 * 组件功能：下拉框组件
 * @param value 已选择项
 * @param dataSource 选项{key, name}组成的数组
 */

export default function MultipleSelectComponent({
  value = undefined,
  limit = undefined,
  dataSource = [],
  placeholder = '请选择',
  onChange,
  onFocus,
  loopKey = 'key',
  loopName = 'name',
  style,
}: Params) {
  const channelOption = dataSource.map(item => (
    // <Option value={item[loopKey]} key={item[loopKey]}>
    //   {item[loopName]}
    // </Option>
    <Option value={item} key={item}>
      {item}
    </Option>
  ));
  const toChange = function (val: any) {
    if (limit && val.length > limit) {
      message.warning(`最大支持选择${limit}项`);
      return;
    }
    onChange(val);
  };
  function handleMaxTag() {
    if (value && value.length) {
      return <span>已选择{value.length}项</span>;
    }
    return null;
  }
  return (
    <Select
      style={{ ...style }}
      // @ts-ignore
      maxTagCount={0}
      maxTagTextLength={8}
      // maxTagPlaceholder={value && isArray(value) ? `已选${value.length}项` : undefined}
      allowClear
      mode="multiple"
      // value={value}
      placeholder={placeholder}
      filterOption={(input, option) => (option.props.children || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      onChange={toChange}
      onFocus={onFocus}
      open
      ref={(refs: any)=>(refs && refs.focus())}
    >
      {channelOption}
    </Select>
  );
}
