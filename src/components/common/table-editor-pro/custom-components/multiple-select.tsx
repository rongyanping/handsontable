/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Select, message } from 'antd';

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
  style?: object;
  defaultValue?: any;
  typeRefreshKey?: any;
  showCodeAndName?: boolean;
  onBlur?: Function;
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
  defaultValue,
  typeRefreshKey,
  showCodeAndName,
  onBlur,
}: Params) {
  const [isOpen, setIsOpen] = useState(true);
  const channelOption = dataSource.map(item => (
    <Option value={item[loopKey]} key={item[loopKey]}>
      {showCodeAndName ? `${item[loopKey]} | ${item[loopName]}` : item[loopName]}
    </Option>
  ));
  const toChange = function (val: string[]) {
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
  const toBlur = () => {
    setIsOpen(false);
    onBlur && onBlur();
  };
  return (
    <Select
      maxTagCount={0}
      maxTagTextLength={8}
      maxTagPlaceholder={handleMaxTag}
      allowClear
      mode="multiple"
      // value={value || undefined}
      placeholder={placeholder}
      filterOption={(input, option) => (option.props.children || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      onChange={toChange}
      onFocus={onFocus}
      defaultValue={defaultValue || undefined}
      style={{ ...style }}
      defaultOpen={isOpen}
      open={isOpen}
      onFocus={() => { setIsOpen(true); }}
      onBlur={toBlur}
      key={typeRefreshKey}
    >
      {channelOption}
    </Select>
  );
}
