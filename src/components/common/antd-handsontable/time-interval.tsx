import React, { useReducer, useState } from 'react';
import { Input, TimePicker } from 'antd';
import Moment from 'moment';

// react hooks reducer function
function reducer(state: any, action: any) {
  return { ...state, ...action };
}

// 定义类型
interface Params {
  value?: any[];
  style?: any;
  key?: any;
  disabled?: boolean;
  onChange?: any;
  onSearch?: any;
  startOpen?: boolean;
  endOpen?: boolean;
}
/**
 * 时间选择
 * @param value
 */
export default function TimeInterval({ value = ['', ''], style, key, onChange, disabled = false , startOpen = true, endOpen = false}: Params) {
  // console.log('时间组件里的数据', value);
  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, { start: value && value[0], end: value && value[1] })
  );
  const [isStartOpen, setIsStartOpen] = useState(startOpen);
  const [isEndOpen, setIsEndOpen] = useState(endOpen);

  const { start, end } = state;
  const toChange = function (time: any, timeString: any) {
    if (!timeString) {
      dispatch({ start: '', end: '' });
      onChange(['', '']);
    } else {
      dispatch({ start: timeString, end: '' });
      onChange([timeString, '']);
    }
  };
  const toOpenChange = function (e: any) {
    setIsStartOpen(e);
    setIsEndOpen(false);
    if (!e) {
      onChange([start, end]);
    }
  };
  const toOpenChange2 = function (e: any) {
    setIsStartOpen(false);
    setIsEndOpen(e);
    if (!e) {
      onChange([start, end]);
    }
  };
  const disabledHours = function () {
    const res = [];
    for (let i = 0; i < parseInt(start ? start.split(':')[0] : 0, 10); i++) {
      // eslint-disable-line
      res.push(i);
    }
    return res;
  };
  const disabledMinutes = function (selectedHour: any) {
    let res = [];
    if (selectedHour === parseInt(start ? start.split(':')[0] : 0, 10)) {
      for (let i = 0; i < parseInt(start ? start.split(':')[1] : 0, 10); i++) {
        // eslint-disable-line
        res.push(i);
      }
    } else {
      res = [];
    }
    return res;
  };
  const changeTime = function (time: any, timeString: any) {
    let res = '';
    if (
      parseInt(timeString.split(':')[0], 10) ===
      parseInt(start ? start.split(':')[0] : 0, 10) &&
      parseInt(timeString.split(':')[1], 10) <
      parseInt(start ? start.split(':')[1] : 0, 10)
    ) {
      res = start;
    } else {
      res = timeString;
    }
    dispatch({ end: res });
    onChange([start, res]);
  };
  return (
    <Input.Group compact style={style} key={key}>
      <TimePicker
      // @ts-ignore
        inputReadOnly={true}
        allowClear
        format="HH:mm:ss"
        style={{ width: '40%', textAlign: 'center' }}
        placeholder="开始时间"
        value={start ? Moment(start, 'HH:mm:ss') : undefined}
        onChange={toChange}
        onOpenChange={toOpenChange}
        disabled={disabled}
        open={isStartOpen}
        getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      />
      <span style={{ margin: '8px 8px 0px 8px' }}>-</span>
      <TimePicker
        disabled={!start}
        // @ts-ignore
        inputReadOnly
        allowClear
        format="HH:mm:ss"
        style={{ width: '40%', textAlign: 'center' }}
        placeholder="结束时间"
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        value={end ? Moment(end, 'HH:mm:ss') : undefined}
        onChange={changeTime}
        onOpenChange={toOpenChange2}
        open={isEndOpen}
        getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      />
    </Input.Group>
  );
}
