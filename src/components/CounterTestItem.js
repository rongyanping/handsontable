import React, { useState, useEffect } from "react";

class Counter extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.warn('shouldComponentUpdate', this.props, nextProps);
  //   // console.warn('shouldComponentUpdate', this.props.counter.count === nextProps.counter.count, this.props.counter.dish === nextProps.counter.dish);
  //   // if (this.props.counter.count !== nextProps.counter.count || this.props.counter.dish !== nextProps.counter.dish) {
  //   //   return true;
  //   // } else {
  //   //   return false;
  //   // } 
  //   console.warn('item count变化', this.props.count === nextProps.count);
  //   console.warn('item dish变化', this.props.dish === nextProps.dish);
  //   return true;
  // }
  render() {
    console.warn('item render', this.props);
    const { count, dish } = this.props;
    return (
      <div>
        <div>具体数量{dish.id}</div>
      </div>
    );
  }
}


export default Counter;
