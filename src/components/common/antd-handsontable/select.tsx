import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export interface SelectTypeProps {
  textParent?: any;
  dataSource?: any[],
  defaultValue?: any,
  style?: object;
  onChange?: (val: any) => void;
}

export default function SelectType({
  textParent,
  dataSource,
  defaultValue,
  style,
  onChange,
}: SelectTypeProps) {
  const handleChange = (val: any) => {
    onChange && onChange(val);
  };
  return (
    <Select
      defaultValue={defaultValue || (dataSource && dataSource.length > 0 && dataSource[0]) || ''}
      style={{ ...style }}
      onChange={handleChange}
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      // @ts-ignore
      defaultOpen
    >
      {
        dataSource && dataSource.length > 0 && dataSource.map((item: any) => {
          return (
            <Option value={item}> {item} </Option>
          );
        })
      }
    </Select>
  );
}