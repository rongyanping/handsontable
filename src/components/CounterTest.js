import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { produce } from 'immer';
import _ from 'lodash';
import Item from './CounterTestItem';

import {
  CounterIncrementAction,
  CounterDecrementAction,
  CounterChangeValueAction,
  DishNumberIncrease,
} from "../reducers/counter/actions";

class Counter extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.warn('shouldComponentUpdate', this.props, nextProps);
  //   console.warn('shouldComponentUpdate', this.props.counter.count === nextProps.counter.count, this.props.counter.dish === nextProps.counter.dish);
  //   if (this.props.counter.count !== nextProps.counter.count || this.props.counter.dish !== nextProps.counter.dish) {
  //     return true;
  //   } else {
  //     return false;
  //   } 
  // }
  render() {
    console.warn('render', this.props);
    const { count, name, test, dish } = this.props.counter;
    const { dispatch } =  this.props;
    // dish.id = dish.id + 1;
    const handleClickIncrement = () => dispatch(CounterIncrementAction());
    const handleClickDecrement = () => dispatch(CounterDecrementAction());
    const handleClickDish = () => dispatch(DishNumberIncrease());
    const handleClickImmer = () => {
      const time01 = new Date().valueOf();
      const newTest = produce(test, draft => {
        draft[0]._id = '009';
      })
      const time02 = new Date().valueOf();
      console.warn('对象：', test);
      console.warn('handleClickImmer 操作时间差：', time02 - time01);
      console.warn('handleClickImmer 原对象是否相等:', test === newTest);
      console.warn('handleClickImmer 第一项是否相等:', test[0] === newTest[0]);
      console.warn('handleClickImmer 第二项是否相等:', test[1] === newTest[1]);
      console.warn('handleClickImmer 第三项是否相等:', test[2] === newTest[2]);
    };
    const handleClickCommon = () => {
      const time01 = new Date().valueOf();
      const newTest = _.cloneDeep(test);
      newTest[0]._id = '009';
      const time02 = new Date().valueOf();
      console.warn('handleClickCommon 操作时间差：', time02 - time01);
      console.warn('handleClickCommon 原对象是否相等:', test === newTest);
      console.warn('handleClickCommon 第一项是否相等:', test[0] === newTest[0]);
      console.warn('handleClickCommon 第二项是否相等:', test[1] === newTest[1]);
      console.warn('handleClickCommon 第三项是否相等:', test[2] === newTest[2]);
    };
    const handleClickTest = () => {
      const parent = {
        a: 1,
        b: 3,
        son: {
          m: 1,
          n: 2,
        }
      };
      const cloneParent = parent;
      const spreadParent = {...parent};
      console.warn('cloneParent  判断相等：', parent === cloneParent, parent.son === cloneParent.son);
      console.warn('spreadParent 判断相等：', parent === spreadParent, parent.son === spreadParent.son);
    };
    const itemProps = {
      // count,
      dish,
    }
    return (
      <div>
        <div><Item {...itemProps} /></div>
        <div>
          <button onClick={handleClickIncrement}>Increment</button>
          <button onClick={handleClickDecrement}>Decrement</button>
          <button onClick={handleClickDish}>DishChange</button>
          <button onClick={handleClickImmer}>immerChange</button>
          <button onClick={handleClickCommon}>commonChange</button>
          <button onClick={handleClickTest}>test</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  };
};

export default connect(mapStateToProps)(Counter);
