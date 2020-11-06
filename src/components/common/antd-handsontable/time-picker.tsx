import React from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';


export interface TimePickerTypeProps {
  onChange?: (val: any) => void,
}

export default function TimePickerType({
  onChange,
}: TimePickerTypeProps) {
  const handleChange = (val: any) => {
    onChange && onChange(moment(val).format('HH:mm:ss'));
  };
  return (
    <TimePicker onChange={handleChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
  );
}