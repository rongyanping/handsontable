/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Select, Radio } from 'antd';

const { Option } = Select;

// 定义类型
interface Params {
  value?: any;
  showSearch?: boolean; // 是否自动搜索
  dataSource: any[];
  placeholder: string;
  onChange: any;
  notAll: boolean;
  selectType: string;
  // onSearch?: any;
  onSelect?: any;
  onFocus?: any;
  loopKey?: string;
  loopName?: string;
  style?: object;
  typeRefreshKey?: any;
  defaultValue?: any;
}

/**
 * 组件功能：下拉框组件
 * @param value 已选择项
 * @param showSearch 是否可搜索
 * @param dataSource 选项{key, name}组成的数组
 */
export default function SelectComponent({
  value = '',
  showSearch = false,
  dataSource = [],
  placeholder = '请选择',
  onChange,
  onSelect,
  onFocus,
  notAll = true,
  selectType,
  loopKey = 'key',
  loopName = 'name',
  style,
  typeRefreshKey,
  defaultValue,
}: Params) {
  const channelOption = dataSource.map(item => (
    <Option value={item[loopKey]} key={item[loopKey]}>
      {item[loopName]}
    </Option>
  ));
  const radio = dataSource.map(item => (
    <Radio.Button value={item[loopKey]} key={item[loopKey]}>
      {item[loopName]}
    </Radio.Button>
  ));
  const toChange = function (e: any) {
    onChange(e.target.value);
  };
  const selectChange = function (v: any) {
    onChange(v);
  };
  return selectType === 'radio' ? (
    <Radio.Group value={value} onChange={toChange}>
      {radio}
      {!notAll && (
        <Radio.Button value="" key="all">
          全部
        </Radio.Button>
      )}
    </Radio.Group>
  ) : (
    <Select
      showSearch={showSearch}
      defaultValue={defaultValue}
      // value={value}
      placeholder={placeholder}
      onChange={selectChange}
      onSelect={onSelect}
      onFocus={onFocus}
      filterOption={(input, option) => (option.props.children || '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      defaultOpen
      style={{ ...style }}
      key={typeRefreshKey}
    >
      {!notAll &&
          (
            <Option value="" key="all">
              全部
            </Option>
          )}
      {channelOption}
    </Select>
  );
}
