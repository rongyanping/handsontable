/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { get } from 'lodash';
import * as customTypes from './custom-types';
import './style.less';

export interface CustomComponentProps {
  textParent?: any;
  type: string;
  position?: any;
  style?: object;
  dataSource?: any;
  defaultValue?: any;
  typeRefreshKey?: any;
  startOpen?: boolean;
  endOpen?: boolean;
  value?: any;
  mode?: any;
  onChange?: (val: any) => void;
  onSelect?: any;
  loopKey?: string;
  loopName?: string;
  showCodeAndName?: boolean;
  onBlur?: Function;
}
export default function CustomComponent({
  textParent,
  type,
  position,
  style,
  dataSource,
  defaultValue,
  typeRefreshKey,
  startOpen,
  endOpen,
  value = undefined,
  mode,
  onChange,
  loopKey,
  loopName,
  showCodeAndName,
  onBlur,
}: CustomComponentProps) {
  const CurComponent = get(customTypes, type);
  const handleChange = (val: any) => {
    onChange && onChange(val);
  };
  return (
    <div
      className="choice-handsontable-holder-box"
      style={{
        position: 'absolute',
        top: `${position?.top || 0}px`,
        left: `${position?.left || 0}px`,
        zIndex: 99,
        ...style,
      }}
    >
      <CurComponent
        // className="choice-handsontable-input-holder"
        key={typeRefreshKey}
        position={position}
        style={style}
        textParent={textParent}
        dataSource={dataSource}
        onChange={handleChange}
        defaultValue={defaultValue}
        value={value}
        startOpen={startOpen}
        endOpen={endOpen}
        mode={mode}
        loopKey={loopKey}
        loopName={loopName}
        showCodeAndName={showCodeAndName}
        onBlur={onBlur}
      />
    </div>
  );
}
