import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { get } from 'lodash';
import * as customTypes from './custom-types';

export interface CustomComponentProps {
  textParent?: any,
  type: string;
  position?: any;
  style?: object;
  dataSource?: any;
  defaultValue?: any;
  typeRefreshKey?: any;
  onChange?: (val: any) => void;
}
export default function CustomComponent({
  textParent,
  type,
  position,
  style,
  dataSource,
  defaultValue,
  typeRefreshKey,
  onChange,
}: CustomComponentProps) {
  const CurComponent = get(customTypes, type);
  const handleChange = (val: any) => {
    onChange && onChange(val);
  };
  // return ReactDOM.render(
  //   <CurComponent
  //     className="choice-handsontable-input-holder"
  //     key={typeRefreshKey}
  //     position={position}
  //     style={{ position: 'absolute', top: `${position?.top}px`, left: `${position?.left}px`, zIndex: 99, ...style }}
  //     dataSource={dataSource}
  //     onChange={handleChange}
  //     defaultValue={defaultValue}
  //   />,
  //   textParent
  // );
  return (
    <div style={{ position: 'absolute', top: `${position?.top}px`, left: `${position?.left}px`, zIndex: 99, ...style }}>
      <CurComponent
        className="choice-handsontable-input-holder"
        key={typeRefreshKey}
        position={position}
        style={style}
        textParent={textParent}
        dataSource={dataSource}
        onChange={handleChange}
        defaultValue={defaultValue}
      />
    </div>
  )
}
