import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export interface SelectTypeProps {
  textParent?: any;
  dataSource?: any[],
  defaultValue?: any,
  style?: object;
  mode?: any;
  onChange?: (val: any) => void;
}

export default function SelectType({
  textParent,
  dataSource,
  defaultValue,
  style,
  mode,
  onChange,
}: SelectTypeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const handleChange = (val: any) => {
    onChange && onChange(val);
  };
  function handleMaxTag() {
    if (defaultValue && defaultValue.length) {
      return <span>已选择{defaultValue.length}项</span>;
    }
    return null;
  }
  return (
    <Select
      defaultValue={defaultValue || (dataSource && dataSource.length > 0 && dataSource[0]) || ''}
      style={{ ...style }}
      onChange={handleChange}
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      // @ts-ignore
      defaultOpen={isOpen}
      mode={mode}
      ref={(refs: any)=>(refs && refs.focus())}
      maxTagPlaceholder={handleMaxTag}
    >
      {
        dataSource && dataSource.length > 0 && dataSource.map((item: any) => {
          return (
            <Option value={item} key={item}> {item} </Option>
          );
        })
      }
    </Select>
  );
}