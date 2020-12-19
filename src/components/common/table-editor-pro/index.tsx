/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom';
import { cloneDeep, remove, indexOf } from 'lodash';
import { Spin, Pagination, Checkbox, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
// @ts-ignore
import Handsontable from './handsontable-source/src';
import CustomComponent from './custom-components';
// @ts-ignore
import { offset, empty, addClass } from './handsontable-source/src/helpers/dom/element';
import { TABLE_HEIGHT } from './constvalue';
import './handsontable.css';
import './style.less';

/** columns配置项
 * choClassName: 每一列的className    string | array
 */
export interface HandsonProps {
  loading?: boolean;
  columns?: any;
  nestedHeaders?: any[]; // 表头的columns
  dataSource?: any;
  rowKey?: string;
  updateTableSettings?: boolean; // 是否要更新配置
  tablecell?: any; // handsontable options中cell配置
  destoryHot?: boolean; // 是否销毁实例
  refreshKey?: number; // 更新页面
  activeKey?: any; // 用于tabs切换时判断当前是选中的那个tabs下面的id
  height?: number; // 表格整体高度
  isEdit?: boolean; // 是否处于编辑状态
  fixedColumnsLeft?: number; // 左侧固定的列数
  rowSelection?: any; // 增加checkbox选择行

  pagination?: any;
  onChangePagination?: Function; // 点击分页
  onShowSizeChange?: Function; // 分页 改变每页条数
  onChangeCell?: Function; // 单元格onChange

}

const prefixCls = 'choice';
const diffHeight = -50;
const newHeight = document.body.clientHeight - TABLE_HEIGHT - diffHeight;
export default class Index extends React.Component<HandsonProps, any> {
  public static defaultProps = {
    rowKey: 'index',
  };

  public isUpdateTable: boolean;

  public destoryHot: boolean;

  public tablerefs: any;

  public renderTime: any;

  public rowSelectionColumns: any;

  public selectedRowKeys: any[];

  public selectedRows: any[];

  public constructor(props: HandsonProps) {
    super(props);
    this.isUpdateTable = props.updateTableSettings || false; // 是否更新配置
    this.destoryHot = props.destoryHot || false; // 判断当前是菜品还是做法组件
    this.tablerefs = null;
    this.renderTime = null;
    this.selectedRowKeys = props.rowSelection?.selectedRowKeys || []; // 选中的行的key
    this.selectedRows = []; // 所有选中的行
    this.rowSelectionColumns = (rowKey: any) => {
      return (
        {
          data: rowKey,
          type: 'cho.Render',
          choClassName: [`${prefixCls}-checkbox-td`, `${prefixCls}-checkbox-middle-center`],
          width: 80,
          render: (text: any, rows: any) => (<Checkbox checked={indexOf(this.selectedRowKeys, text) > -1} onChange={this.onChangeCheckbox.bind(this, text, rows)} />),
        }
      );
    }; // checkbox列

    this.state = {
      choType: undefined, // 自定义的column类型
      position: null, // 浮框的定位位置
      hot: null, // handsontable实例
      activeEditor: null, // 当前激活的单元格
      defaultValue: undefined, // 浮框默认值
      typeRefreshKey: 0, // 自定义类型刷新页面的key
      customStyle: null, // 自定义类型组件的样式
      textParent: null, // 表格根节点的dom

      dataSource: undefined, // select下拉框的数据源
      mode: null, // select mode类型
      loopName: undefined,
      loopKey: undefined,
      value: undefined,
      showCodeAndName: false,

      startOpen: true, // timeInterval 打开/关闭
      endOpen: false,

      indeterminate: false,
      checkAll: false,

      updateLoading: false, // 更新配置后加载效果
    };
  }

  public componentDidMount() {
    const dom: any = this.tablerefs;
    this.renderTime = new Date().getTime();
    setTimeout(() => {
      // console.log('didmount------', this.state.hot, dom);
      // 注册单元格类型
      this.registerCellType(Handsontable);
      // 实例化
      const hot = this.initTable(dom);
      this.addListenerScroll(hot); // 监听滚动事件
      if (!this.state.hot) {
        this.setState({
          hot,
          textParent: dom,
        });
      }
    }, 100);
  }

  public componentWillReceiveProps(nextProps: any) {
    const { updateTableSettings, dataSource, nestedHeaders, columns, height, isEdit,
      fixedColumnsLeft, rowSelection, rowKey,
    } = nextProps;
    if (this.isUpdateTable !== updateTableSettings) {
      // console.log('isUpdateTable----', this.isUpdateTable !== updateTableSettings);
      // console.log('columns----', columns);
      // console.log('dataSource----', dataSource);
      // console.log('newNestedHeaders----', newNestedHeaders);
      // 更新配置
      const newNestedHeaders = cloneDeep(nestedHeaders);
      isEdit && newNestedHeaders[0].unshift(...this.getChekboxHead());
      rowSelection && newNestedHeaders[1].unshift('');
      this.setState({
        updateLoading: true,
      });
      // const tempTop = document.body.offsetHeight - this.state.textParent?.getBoundingClientRect()?.top;
      // const allRowHeight = (dataSource?.length * 60 + newNestedHeaders.length * 30 + 10) < 200 ? 200 : dataSource?.length * 60 + newNestedHeaders.length * 30 + 10;
      setTimeout(() => {
        this.selectedRowKeys = [];
        this.selectedRows = [];
        this.setState({
          choType: null,
          updateLoading: false,
          checkAll: false,
          indeterminate: false,
        });
        this.state.hot.updateSettings({
          columns: rowSelection ? [this.rowSelectionColumns(rowKey), ...columns] : columns,
          data: dataSource,
          nestedHeaders: newNestedHeaders,
          height: height || newHeight || 200,
          // height: height || (allRowHeight < tempTop ? allRowHeight - diffHeight : tempTop - diffHeight) || 200,
          fixedColumnsLeft,
        });
      }, 50);
      this.isUpdateTable = updateTableSettings;
    }
  }

  public componentDidUpdate() {
    // console.log('renderTime------', new Date().getTime() - this.renderTime);
  }

  public componentWillUnmount() {
    // console.log('WillUnmount====');
    this.state.hot?.destroy();
  }

  // 实例化
  public initTable(dom: any) {
    const { isEdit, fixedColumnsLeft, rowSelection } = this.props;
    const newNestedHeaders = cloneDeep(this.props.nestedHeaders);
    isEdit && newNestedHeaders[0].unshift(...this.getChekboxHead());
    rowSelection && newNestedHeaders[1].unshift('');
    // const tempTop = document.body.offsetHeight - this.state.textParent?.getBoundingClientRect()?.top;
    // const allRowHeight = this.props.dataSource?.length * 60 + newNestedHeaders.length * 30 + 10;
    // @ts-ignore
    const hot = dom && new Handsontable(dom, {
      data: this.props.dataSource,
      columns: this.props.rowSelection ? [this.rowSelectionColumns(this.props.rowKey), ...this.props.columns] : this.props.columns,
      colHeaders: true,
      nestedHeaders: newNestedHeaders,
      height: this.props.height || newHeight || 200,
      // height: this.props.height || (allRowHeight < tempTop ? allRowHeight : tempTop - diffHeight) || 200,
      rowHeights: '60px', // 单元格高低
      // maxRows: 200,
      fixedColumnsLeft,
      fixedColumnsRight: 1, // 暂时还不支持
      className: 'htLeft htMiddle', // 通过class控制单元格内容显示的位置 Horizontal: htLeft, htCenter, htRight, htJustify; Vertical: htTop, htMiddle, htBottom
      cell: this.props.tablecell,
      autoScroll: false, // 点击的时候 是否自动滚动
      startCellMouseEvent: true, // 是否开启鼠标事件 如afterOnCellMouseDown,afterOnCellMouseUp;若不开启会导致hotInstance.getActiveEditor方法无效
      autoWrapRow: true,
      stretchH: 'all',
      manualRowResize: false,
      manualColumnResize: false,
      manualRowMove: false,
      manualColumnMove: false,
      contextMenu: false,
      filters: false,
      dropdownMenu: false,
    });
    return hot;
  }

  // 获取checkbox 表头
  public getChekboxHead() {
    return [{
      // eslint-disable-next-line no-nested-ternary
      label: <Checkbox
        indeterminate={this.state.indeterminate}
        onChange={this.onCheckAllChange.bind(this)}
        checked={this.state.checkAll}
      />,
      rowspan: 2,
    }];
  }

  // 表头checkbox all
  public onCheckAllChange(e: any) {
    const { nestedHeaders, dataSource, rowKey, rowSelection, columns } = this.props;
    const { hot } = this.state;
    this.renderTime = new Date().getTime();
    e.target.checked ? this.selectedRowKeys = dataSource.map((el: any) => (rowKey && el[rowKey])) : this.selectedRowKeys = [];
    e.target.checked ? this.selectedRows = cloneDeep(dataSource) : this.selectedRows = [];
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => {
      const newNestedHeaders2 = cloneDeep(nestedHeaders);
      newNestedHeaders2[0].unshift(...this.getChekboxHead());
      // 更新表头，否则表头的checkbox 状态无法改变
      hot.updateSettings({
        nestedHeaders: newNestedHeaders2,
        columns: [this.rowSelectionColumns(rowKey), ...columns],
      });
    });
    rowSelection?.onChange(this.selectedRowKeys, this.selectedRows);
  }

  // table body checkbox
  public onChangeCheckbox(key: any, row: any, e: any) {
    this.renderTime = new Date().getTime();
    const { rowSelection, rowKey, dataSource, nestedHeaders, isEdit, columns } = this.props;
    e.target.checked ? this.selectedRowKeys.push(key) : remove(this.selectedRowKeys, (el: any) => (el === key));
    e.target.checked ? this.selectedRows.push(row) : remove(this.selectedRows, (el: any) => (rowKey && el[rowKey] === key));
    this.setState({
      indeterminate: !!this.selectedRowKeys.length && this.selectedRowKeys.length < dataSource.length,
      checkAll: this.selectedRowKeys.length === dataSource.length,
    }, () => {
      const newNestedHeaders = cloneDeep(nestedHeaders);
      isEdit && newNestedHeaders[0].unshift(...this.getChekboxHead());
      rowSelection && newNestedHeaders[1].unshift('');
      this.state.hot.updateSettings({
        nestedHeaders: newNestedHeaders,
        columns: [this.rowSelectionColumns(rowKey), ...columns],
      });
      // this.state.hot.render();
    });
    rowSelection?.onChange(this.selectedRowKeys, this.selectedRows);
  }

  // 清空选中的单元格
  public handleClearAllCheck() {
    const { rowSelection, nestedHeaders, columns, rowKey } = this.props;
    this.selectedRowKeys = [];
    this.selectedRows = [];
    this.setState({
      indeterminate: false,
      checkAll: false,
    }, () => {
      const newNestedHeaders = cloneDeep(nestedHeaders);
      newNestedHeaders[0].unshift(...this.getChekboxHead());
      this.state.hot.updateSettings({
        nestedHeaders: newNestedHeaders,
        columns: [this.rowSelectionColumns(rowKey), ...columns],
      });
    });
    rowSelection?.onChange(this.selectedRowKeys, this.selectedRows);
  }

  // select 自定义渲染
  public customRenderer(hotInstance: any, td: any, row: any, column: any, prop: any, value: any, cellProperties: any) {
    const _this = this;
    // eslint-disable-next-line prefer-rest-params
    Handsontable.renderers.BaseRenderer.apply(this, arguments);
    const childs = td.querySelector(`.${prefixCls}-select-td`);
    const { mode, source, loopKey, loopName, allowClear, readOnly } = cellProperties;
    const newVal = loopName && source?.filter((item: any) => item[loopKey] === value);
    const newVal2 = newVal && newVal[0] ? newVal[0][loopName] : value;
    let multipleValLen = 0;
    mode && loopKey && source?.forEach((item: any) => {
      value && value.length > 0 && value.forEach((el: any) => {
        if (el === item[loopKey]) {
          multipleValLen++;
        }
      });
    });
    const cleardom: any = mode && document.createElement('span');
    cleardom && cleardom.setAttribute('class', 'multiple-select-icon-clear');
    const iptDom = allowClear && document.createElement('input');
    allowClear && iptDom.setAttribute('class', `${prefixCls}-select-td-ipt`);
    if (readOnly || !_this.props.isEdit) {
      const div = document.createElement('div');
      // eslint-disable-next-line no-nested-ternary
      !mode ? div.innerHTML = (newVal2 || '--') : multipleValLen > 0 ? div.innerHTML = `<span>已选择${multipleValLen}项</span>` : div.innerHTML = '--';
      empty(td);
      td.appendChild(div);
      return td;
    }
    // 是否已经存在select
    if (!childs) {
      const div: any = document.createElement('div');
      div.setAttribute('class', `${prefixCls}-select-td`);
      div.setAttribute('data-row', row);
      div.setAttribute('data-col', column);

      if (allowClear) {
        iptDom.setAttribute('placeholder', multipleValLen > 0 ? `已选择${multipleValLen}项` : '请选择');
        div?.appendChild(iptDom);
        (multipleValLen > 0 || newVal2) && div?.appendChild(cleardom);
      } else {
        // eslint-disable-next-line no-nested-ternary
        !mode ? div.innerHTML = (newVal2 || '请选择') : multipleValLen > 0 ? div.innerHTML = `<span>已选择${multipleValLen}项</span>` : div.innerHTML = '请选择';
      }

      const arrowSpan: any = document.createElement('span');
      arrowSpan.setAttribute('class', `${prefixCls}-select-arrow`);
      !mode && div.appendChild(arrowSpan);
      // console.log('div----', div);

      // 创建的div绑定click事件
      // @ts-ignore
      Handsontable.dom.addEvent(div, 'click', (event: any) => {
        event.stopPropagation();
        const result = hotInstance.getActiveEditor();
        _this.refreshDimensions(hotInstance, td, result.row, result.col);
      });
      // @ts-ignore
      Handsontable?.dom?.empty(td);

      // td 添加class
      td.setAttribute('class', `${prefixCls}-td`);
      td.appendChild(div);
    } else if (childs) {
      if (allowClear) {
        empty(childs);
        iptDom.setAttribute('placeholder', multipleValLen > 0 ? `已选择${multipleValLen}项` : '请选择');
        childs?.appendChild(iptDom);
        (multipleValLen > 0 || newVal2) && childs?.appendChild(cleardom);
      } else {
        !mode ?
          childs.innerHTML = `${newVal2 || '请选择'}<span class='${prefixCls}-select-arrow'></span>` :
          childs.innerHTML = multipleValLen > 0 ? `<span>已选择${multipleValLen}项</span>` : '请选择';
      }
      td.appendChild(childs);
    }
    cleardom && Handsontable.dom.addEvent(cleardom, 'click', this.handleClear.bind(this, row, column, source));
    return td;
  }

  // select 清除内容
  public handleClear(row: any, column: any, source: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    // console.log('clear----', event.target?.previousSibling);
    event.target?.previousSibling.focus();
    event.target?.previousSibling.setAttribute('placeholder', '请选择');
    this.setState({
      value: undefined,
      defaultValue: undefined,
      choType: null,
    }, () => {
      this.state.hot.setDataAtCell(row, column, undefined, source);
    });
  }

  // timeInterval 自定义渲染
  public customRendererTimeInterval(hotInstance: any, td: any, row: any, column: any, prop: any, value: any, cellProperties: any) {
    const _this = this;
    // eslint-disable-next-line prefer-rest-params
    Handsontable.renderers.BaseRenderer.apply(this, arguments);
    const childs = td.querySelector(`.${prefixCls}-time-interval-td`);
    const { readOnly } = cellProperties;
    if (readOnly || !_this.props.isEdit) {
      ReactDOM.render(
        <div className="choice-time-picker-box">
          <span>{value && value.length > 0 ? value[0] : '--'}</span>
          {value && value.length > 1 && <span style={{ margin: '4px 8px 0px 8px' }}>-</span>}
          <span>{value && value.length > 1 ? value[1] : null}</span>
        </div>,
        td
      );
      return td;
    }
    // console.log('time interval value----', value, childs);
    // console.log('time interval value----', column, value);
    // 是否已经存在select
    if (!childs) {
      const div: any = document.createElement('div');
      div.setAttribute('class', `${prefixCls}-time-interval-td`);
      div.setAttribute('data-row', row);
      div.setAttribute('data-col', column);
      ReactDOM.render(
        <div className="choice-time-picker-box">
          <input
            className="choice-time-picker-input"
            type="text"
            placeholder="请选择时间"
            value={value && value.length > 0 ? (value[0] || '') : ''}
            onClick={_this.handleClickTimeInterval.bind(_this, hotInstance, div, td, 'start')}
          />
          <span style={{ margin: '4px 8px 0px 8px' }}>-</span>
          <input
            className={!value || (value && !value[0]) ? 'choice-time-picker-input choice-time-picker-input-disabled' : 'choice-time-picker-input'}
            type="text"
            placeholder="请选择时间"
            disabled={!value || (value && !value[0])}
            value={value && value.length > 1 ? (value[1] || '') : ''}
            onClick={_this.handleClickTimeInterval.bind(_this, hotInstance, childs, td, 'end')}
          />
        </div>,
        div
      );
      // @ts-ignore
      Handsontable?.dom?.empty(td);
      td.setAttribute('class', `${prefixCls}-td`);
      td.appendChild(div);
    } else {
      // 加上卸载dom后 会导致每次点击别的单元格 刷新页面的效果很明显的抖动
      // ReactDOM.unmountComponentAtNode(childs);
      // 加上延时后 连续点击别的单元格 会造成将此单元格赋值到了点击的地方
      // setTimeout(() => {
      ReactDOM.render(
        <div className="choice-time-picker-box">
          <input
            className="choice-time-picker-input"
            type="text"
            placeholder="请选择时间"
            value={value && value.length > 0 ? (value[0] || '') : ''}
            onClick={_this.handleClickTimeInterval.bind(_this, hotInstance, childs, td, 'start')}
          />
          <span style={{ margin: '4px 8px 0px 8px' }}>-</span>
          <input
            className={!value || (value && !value[0]) ? 'choice-time-picker-input choice-time-picker-input-disabled' : 'choice-time-picker-input'}
            type="text"
            placeholder="请选择时间"
            disabled={!value || (value && !value[0])}
            value={value && value.length > 1 ? (value[1] || '') : ''}
            onClick={_this.handleClickTimeInterval.bind(_this, hotInstance, childs, td, 'end')}
          />
        </div>,
        childs
      );
      // }, 100);
    }
    td.setAttribute('data-row', row);
    td.setAttribute('data-col', column);
    return td;
  }

  // time interval click事件
  public handleClickTimeInterval(hotInstance: any, div: any, td: any, clickType: any) {
    const _this = this;
    const result = hotInstance.getActiveEditor();
    _this.refreshDimensions(hotInstance, td, result.row, result.col, clickType);
  }

  // 自定义render 内容
  public customRendererContent(hotInstance: any, td: any, row: any, column: any, prop: any, value: any, cellProperties: any) {
    const _this = this;
    // eslint-disable-next-line prefer-rest-params
    Handsontable.renderers.BaseRenderer.apply(this, arguments);
    const { render, width } = cellProperties;
    const content = render(value, _this.props.dataSource[row], row);
    if (React.isValidElement(content)) {
      ReactDOM.render(
        content,
        td
      );
    }
    // width+两边的padding 16*2
    td.style.width = `${width + 32}px`;
    // 添加自定义的class
    cellProperties?.choClassName && addClass(td, cellProperties?.choClassName);
    return td;
  }

  // select time interval 计算浮框位置
  public refreshDimensions(hot: any, td: any, row: any, col: any, clickType?: any) {
    // 获取滚动时点击的td的正确位置offsetTop;滚动到一定位置，原来的位置会发生变化 需要重新获取
    const tempTD: any = this.getEditedCell(hot, row, col);
    if (!tempTD) return;
    const customDiv = tempTD?.firstChild;
    // console.log('点击计算位置000000000----', tempTD);

    const currentOffset: any = offset(tempTD);
    const containerOffset: any = offset(hot.rootElement);
    const scrollableContainerTop = hot.view.wt.wtOverlays.topOverlay.mainTableScrollableElement;
    const scrollableContainerLeft = hot.view.wt.wtOverlays.leftOverlay.mainTableScrollableElement;
    const totalRowsCount = hot.countRows();
    const containerScrollTop = scrollableContainerTop !== window ? scrollableContainerTop.scrollTop : 0;
    const containerScrollLeft = scrollableContainerLeft !== window ? scrollableContainerLeft.scrollLeft : 0;
    const editorSection = this.checkEditorSection(hot, row, col);

    const scrollTop = ['', 'left'].includes(editorSection) ? containerScrollTop : 0;
    const scrollLeft = ['', 'top', 'bottom'].includes(editorSection) ? containerScrollLeft : 0;

    const editTopModifier = currentOffset?.top === containerOffset?.top ? 0 : 1;
    const settings = hot.getSettings();
    const colHeadersCount = hot.hasColHeaders();
    let editTop = currentOffset?.top - containerOffset.top - editTopModifier - scrollTop;
    let editLeft = currentOffset?.left - containerOffset.left - 1 - scrollLeft;

    if ((colHeadersCount && hot.getSelectedLast() && hot.getSelectedLast()[0] === 0) ||
      (settings.fixedRowsBottom && hot.getSelectedLast() && hot.getSelectedLast()[0] === totalRowsCount - settings.fixedRowsBottom)) {
      editTop += 1;
    }
    if (hot.getSelectedLast() && hot.getSelectedLast()[1] === 0) {
      editLeft += 1;
    }

    // // left值+宽度 > table的宽度表示超出了表格的宽度 需要隐藏浮框; 否则展示浮框
    // // top值+宽度 > table的高度 表示超出表格高度 需要隐藏浮框；
    // const newWidth = Number(customDiv?.offsetWidth) < 50 ? Number(customDiv?.offsetWidth) + 30 : Number(customDiv?.offsetWidth);
    // const newLeft = editLeft + customDiv?.offsetLeft;
    // const tableWidth = _this.tablerefs?.offsetWidth;
    // const newZindex = newLeft + newWidth > tableWidth ? -1 : 99;
    // console.log('slect    scroll111111----', newZindex);

    // 查找当前点击的单元格的信息
    const result = hot.getActiveEditor();
    const tempcellProperties = hot.getCellMeta(result?.row, result?.col);
    const { source, choType, showCodeAndName, loopKey, loopName, mode } = tempcellProperties;

    // 最新的宽度
    // eslint-disable-next-line no-nested-ternary
    const newWidth = clickType ? Number(customDiv?.offsetWidth) < 50 ? Number(customDiv?.offsetWidth) + 30 : Number(customDiv?.offsetWidth) : customDiv?.offsetWidth;
    editLeft += customDiv?.offsetLeft;
    editTop += customDiv?.offsetTop;

    // 存储最新的数据
    this.setState({
      choType,
      showCodeAndName,
      dataSource: source,
      loopKey,
      loopName,
      mode,
      activeEditor: result,
      defaultValue: result?.originalValue, // 获取当前单元格最新的值
      value: result?.originalValue,
      typeRefreshKey: Math.random(),
      startOpen: clickType === 'start',
      endOpen: clickType === 'end',
      position: { left: editLeft, top: editTop },
      customStyle: { ...this.state.customStyle, zIndex: 499, width: newWidth, height: customDiv?.offsetHeight },
    });
  }

  // 监听table滚动事件
  public addListenerScroll(hot: any) {
    const _this = this;
    hot.view.wt.wtOverlays.scrollableElement.addEventListener('scroll', () => {
      // console.log('监听滚动1111111111', _this.state.activeEditor);
      if (!_this.state.activeEditor) return;
      const { row, col } = _this.state.activeEditor;
      // 获取滚动时点击的td的正确位置offsetTop;滚动到一定位置，原来的位置会发生变化 需要重新获取
      const tempTD = this.getEditedCell(hot, row, col);
      if (!tempTD) return;
      const customDiv = tempTD?.firstChild;

      const currentOffset: any = offset(tempTD);
      const containerOffset: any = offset(hot.rootElement);
      const scrollableContainerTop = hot.view.wt.wtOverlays.topOverlay.mainTableScrollableElement;
      const scrollableContainerLeft = hot.view.wt.wtOverlays.leftOverlay.mainTableScrollableElement;
      const totalRowsCount = hot.countRows();
      const containerScrollTop = scrollableContainerTop !== window ? scrollableContainerTop.scrollTop : 0;
      const containerScrollLeft = scrollableContainerLeft !== window ? scrollableContainerLeft.scrollLeft : 0;
      const editorSection = this.checkEditorSection(hot, row, col);

      const scrollTop = ['', 'left'].includes(editorSection) ? containerScrollTop : 0;
      const scrollLeft = ['', 'top', 'bottom'].includes(editorSection) ? containerScrollLeft : 0;

      const editTopModifier = currentOffset?.top === containerOffset?.top ? 0 : 1;
      const settings = hot.getSettings();
      const colHeadersCount = hot.hasColHeaders();
      let editTop: any = currentOffset?.top - containerOffset.top - editTopModifier - scrollTop;
      let editLeft: any = currentOffset?.left - containerOffset.left - 1 - scrollLeft;

      if ((colHeadersCount && hot.getSelectedLast() && hot.getSelectedLast()[0] === 0) ||
        (settings.fixedRowsBottom && hot.getSelectedLast() && hot.getSelectedLast()[0] === totalRowsCount - settings.fixedRowsBottom)) {
        editTop += 1;
      }
      if (hot.getSelectedLast() && hot.getSelectedLast()[1] === 0) {
        editLeft += 1;
      }
      // 查找当前点击的单元格的信息
      // const result = hot.getActiveEditor();
      // const tempcellProperties = hot.getCellMeta(result?.row, result?.col);
      // const { source, choType, showCodeAndName, loopKey, loopName, mode } = tempcellProperties;

      // left值+宽度 > table的宽度表示超出了表格的宽度 需要隐藏浮框; 否则展示浮框
      // top值+宽度 > table的高度 表示超出表格高度 需要隐藏浮框；
      editLeft += customDiv?.offsetLeft;
      editTop += customDiv?.offsetTop;
      // console.log('3333333333', _this.state.choType, _this.state.customStyle);
      // console.log('44444444', editLeft, editTop);
      // 存储最新的数据
      _this.setState({
        position: { left: editLeft, top: editTop },
        // customStyle: { ...this.state.customStyle, zIndex: newZindex, width: newWidth }, // 挂载在当前浮框下时 需要将浮框的宽度=时间下拉框的宽度 否则时间下拉框会换行
      });
    });
  }

  // 判断位置
  public checkEditorSection(hot: any, row: any, col: any) {
    const totalRows = hot?.countRows();
    let section = '';
    // row 当前点击的行；fixedRowsTop顶部固定的行数
    // col 当前点击的列；fixedColumnsLeft左侧固定的列数
    if (row < hot.getSettings().fixedRowsTop) {
      if (col < hot.getSettings().fixedColumnsLeft) {
        section = 'top-left-corner';
      } else {
        section = 'top';
      }
    } else if (hot.getSettings().fixedRowsBottom && row >= totalRows - hot.getSettings().fixedRowsBottom) {
      if (col < hot.getSettings().fixedColumnsLeft) {
        section = 'bottom-left-corner';
      } else {
        section = 'bottom';
      }
    } else if (col < hot.getSettings().fixedColumnsLeft) {
      section = 'left';
    }
    return section;
  }

  // 滚动时查找当前点击的td
  public getEditedCell(hot: any, row: any, col: any) {
    const editorSection = this.checkEditorSection(hot, row, col);
    let editedCell;
    let holderZIndex;
    switch (editorSection) {
      case 'top':
        editedCell = hot.view.wt.wtOverlays.topOverlay.clone.wtTable.getCell({
          row,
          col,
        });
        holderZIndex = 101;
        break;
      case 'top-left-corner':
        editedCell = hot.view.wt.wtOverlays.topLeftCornerOverlay.clone.wtTable.getCell({
          row,
          col,
        });
        holderZIndex = 103;
        break;
      case 'bottom-left-corner':
        editedCell = hot.view.wt.wtOverlays.bottomLeftCornerOverlay.clone.wtTable.getCell({
          row,
          col,
        });
        holderZIndex = 103;
        break;
      case 'left':
        editedCell = hot.view.wt.wtOverlays.leftOverlay.clone.wtTable.getCell({
          row,
          col,
        });
        holderZIndex = 102;
        break;
      case 'bottom':
        editedCell = hot.view.wt.wtOverlays.bottomOverlay.clone.wtTable.getCell({
          row,
          col,
        });
        holderZIndex = 102;
        break;
      default:
        editedCell = hot.getCell(row, col);
        // holderZIndex = -1;
        break;
    }

    this.setState({
      customStyle: { ...this.state.customStyle, zIndex: holderZIndex },
    });

    return editedCell !== -1 && editedCell !== -2 ? editedCell : 0;
  }

  // 注册单元格类型
  public registerCellType(handsontable: any) {
    const _this = this;
    // @ts-ignore
    const MyEditor = handsontable.editors?.BaseEditor?.prototype.extend();
    // 类型校验
    function customValidator(query: any, callback: any) {
      // ...validator logic
      callback(true);
    }

    // 注册：selct
    handsontable.cellTypes.registerCellType('cho.Select', {
      editor: MyEditor,
      renderer: _this.customRenderer.bind(_this),
      validator: customValidator,
      // 您可以根据Handsontable设置向单元类型添加其他选项
      // className: 'my-cell',
      // allowInvalid: true,
      // 或者可以添加自定义属性，可以在cellProperties中访问
      choType: 'Select',
    });
    // 注册：multiple-select
    handsontable.cellTypes.registerCellType('cho.MultipleSelect', {
      editor: MyEditor,
      renderer: _this.customRenderer.bind(_this),
      validator: customValidator,
      choType: 'MultipleSelect',
    });
    // 注册：time interval
    handsontable.cellTypes.registerCellType('cho.TimeInterval', {
      editor: MyEditor,
      renderer: _this.customRendererTimeInterval.bind(_this),
      validator: customValidator,
      choType: 'TimeInterval',
    });
    // 注册：自定义的render
    handsontable.cellTypes.registerCellType('cho.Render', {
      editor: MyEditor,
      renderer: _this.customRendererContent.bind(_this),
      validator: customValidator,
      choType: 'Render',
    });
  }

  public render() {
    const {
      choType,
      position,
      dataSource,
      hot,
      activeEditor,
      defaultValue,
      typeRefreshKey,
      customStyle,
      textParent,
      startOpen,
      endOpen,
      mode,
      loopKey,
      loopName,
      value,
      showCodeAndName,
      updateLoading,
    } = this.state;
    const { loading, pagination, onChangePagination, onShowSizeChange, onChangeCell,
    } = this.props;
    // 组件change事件
    const handleChange = (val: any) => {
      // 更新单元格value值
      // hot.setDataAtRowProp(activeEditor.row, activeEditor.prop, val);
      hot.setDataAtCell(activeEditor?.row, activeEditor?.col, val, activeEditor?.source);
      this.setState({
        value: val,
      });
      // 抛出onChange事件 且将所有的columns中的值都抛出 便于外面业务对于相关值进行校验
      const allData = hot.getData(); // 只有单元格的值 二维数组 最里面的一层表示是每一列 最外层表示行数[[],[],[]]
      const curData = { row: activeEditor?.row, col: activeEditor?.col, prop: activeEditor.prop, value: val };
      onChangeCell && onChangeCell(allData, curData);
    };

    const handleChangePage = (page: any, pageSize: any) => {
      this.renderTime = new Date().getTime();
      onChangePagination && onChangePagination(page, pageSize);
    };
    const handleBlur = () => {
      // console.log('blur----', activeEditor?.cellProperties?.choType);
      this.setState({
        // choType: activeEditor?.cellProperties?.choType || null,
        // dataSource: activeEditor?.cellProperties?.source || null,
        // choType: null,
      });
    };
    return (
      <Spin spinning={loading || updateLoading}>
        <div className={`${prefixCls}-handle-wrap`} style={{ position: 'relative', minHeight: '200px', height: `calc(100vh - ${TABLE_HEIGHT - 100}px)` }}>
          <div
            id="mytable"
            ref={(ref: any) => {
              this.tablerefs = ref;
            }}
            style={{ position: 'relative', minHeight: '200px' }}
          >
            {choType &&
              <CustomComponent
                type={choType}
                textParent={textParent}
                position={position}
                style={customStyle}
                dataSource={dataSource}
                defaultValue={defaultValue}
                value={value}
                onChange={handleChange}
                typeRefreshKey={typeRefreshKey}
                startOpen={startOpen}
                endOpen={endOpen}
                mode={mode}
                loopKey={loopKey}
                loopName={loopName}
                showCodeAndName={showCodeAndName}
                onBlur={handleBlur}
              />}
          </div>
          <div className="footer-box" style={{ width: '100%', height: '35px' }}>
            <span>
              {
                this.selectedRowKeys?.length ?
                  <span>
                    <span>已选择 {this.selectedRowKeys.length}项</span>
                    <Popconfirm placement="top" title="确认清空已选项？" onConfirm={this.handleClearAllCheck.bind(this)} >
                      <a>清空选项</a>
                    </Popconfirm>
                  </span>
                  : ''
              }
            </span>
            {
              this.props.dataSource.length > 0 ?
                <Pagination
                  showSizeChanger
                  defaultCurrent={1}
                  total={0}
                  {...pagination}
                  onChange={handleChangePage}
                  onShowSizeChange={onShowSizeChange}
                />
                : null
            }
          </div>
        </div >
      </Spin>

    );
  }
}

