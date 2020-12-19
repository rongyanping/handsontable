/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Button, Popconfirm, Affix, Icon, Tooltip, message } from 'antd';
import Texttip from '@choicefe/pc-auto-text-tooltip';
import { navigate } from '@saasfe/we-app-react';
import { cloneDeep, isEqual, flatten, findIndex } from 'lodash';
// import Table from '@choicefe/pc-auto-table';
import { renderNull } from '@choicefe/cho-utils';
// import TimeInterval from '@choicefe/search-pc/lib/components/time-interval';
import { ListProps } from '../interface';
// import { getPopupContainer } from '../../common/utils/index';
import Table from '../../common/table-editor-pro/index';
import '../style.less';

// 是否下拉框
const booleanSelect = [{ key: 'Y', value: '是' }, { key: 'N', value: '否' }];
const prefixCls = 'choice';

class Index extends React.Component<ListProps, any> {
  public isErr: any; // 提交前是否符合要求

  public repeatConfig: any[]; // 配置组重复的时间段

  public constructor(props: ListProps) {
    super(props);
    this.isErr = '';
    this.repeatConfig = [{ index: 0, text: null, repreat: [] }, { index: 1, text: null, repreat: [] }, { index: 2, text: null, repreat: [] }];
    this.state = {
      data: [],
    };
  }

  // 增加移除时修改数据列表
  public editData = (number: number, fun: 'add' | 'remove') => {
    const { dispatch, type, updateTableSettings } = this.props;
    const tempData = cloneDeep(this.state.data);
    switch (number) {
      case 1:
        if (fun === 'add') {
          tempData.forEach((item: any) => {
            item.deptType3 = null; // 打印类型1
            item.deptTypeName3 = null; // 打印类型名称1
            item.vfloor3 = null; // 是否按楼层打印1
            item.dbtime3 = null; // 开始时间1
            item.detime3 = null; // 结束时间1
            item.time3 = null;
          });
        } else {
          tempData.forEach((item: any) => {
            item.deptType2 = item.deptType3; // 打印类型1
            item.deptTypeName2 = item.deptTypeName3; // 打印类型名称1
            item.vfloor2 = item.vfloor3; // 是否按楼层打印1
            item.dbtime2 = item.dbtime3; // 开始时间1
            item.detime2 = item.detime3; // 结束时间1
            item.time2 = item.time3;
            item.deptType3 = null; // 打印类型1
            item.deptTypeName3 = null; // 打印类型名称1
            item.vfloor3 = null; // 是否按楼层打印1
            item.dbtime3 = null; // 开始时间1
            item.detime3 = null; // 结束时间1
            item.time3 = null;
          });
        }
        break;
      case 2: // 只能删除
        tempData.forEach((item: any) => {
          item.deptType3 = null; // 打印类型1
          item.deptTypeName3 = null; // 打印类型名称1
          item.vfloor3 = null; // 是否按楼层打印1
          item.dbtime3 = null; // 开始时间1
          item.detime3 = null; // 结束时间1
          item.time3 = null;
        });
        break;
      default: if (fun === 'add') {
        tempData.forEach((item: any) => {
          item.deptType3 = item.deptType2; // 打印类型1
          item.deptTypeName3 = item.deptTypeName2; // 打印类型名称1
          item.vfloor3 = item.vfloor2; // 是否按楼层打印1
          item.dbtime3 = item.dbtime2; // 开始时间1
          item.detime3 = item.detime2; // 结束时间1
          item.time3 = item.time2;
          item.deptType2 = null; // 打印类型1
          item.deptTypeName2 = null; // 打印类型名称1
          item.vfloor2 = null; // 是否按楼层打印1
          item.dbtime2 = null; // 开始时间1
          item.detime2 = null; // 结束时间1
          item.time2 = null;
        });
      } else {
        tempData.forEach((item: any) => {
          item.deptType1 = item.deptType2; // 打印类型1
          item.deptTypeName1 = item.deptTypeName2; // 打印类型名称1
          item.vfloor1 = item.vfloor2; // 是否按楼层打印1
          item.dbtime1 = item.dbtime2; // 开始时间1
          item.detime1 = item.detime2; // 结束时间1
          item.time1 = item.time2;
          item.deptType2 = item.deptType3; // 打印类型1
          item.deptTypeName2 = item.deptTypeName3; // 打印类型名称1
          item.vfloor2 = item.vfloor3; // 是否按楼层打印1
          item.dbtime2 = item.dbtime3; // 开始时间1
          item.detime2 = item.detime3; // 结束时间1
          item.time2 = item.time3;
          item.deptType3 = null; // 打印类型1
          item.deptTypeName3 = null; // 打印类型名称1
          item.vfloor3 = null; // 是否按楼层打印1
          item.dbtime3 = null; // 开始时间1
          item.detime3 = null; // 结束时间1
          item.time3 = null;
        });
      }
    }
    // console.log('remove-----', number, tempData);
    if (type === 'dish') {
      dispatch({
        type: 'updateState',
        payload: {
          dataByDish: tempData,
          updateTableSettings: !updateTableSettings,
        },
      });
    } else if (type === 'method') {
      dispatch({
        type: 'updateState',
        payload: {
          dataByMethod: tempData,
          updateTableSettings: !updateTableSettings,
        },
      });
    }
    this.setState({ data: tempData });
  };

  public shouldComponentUpdate(nextProps: ListProps) {
    if (!isEqual(cloneDeep(nextProps.dataSource), cloneDeep(this.props.dataSource))) {
      nextProps.dataSource.forEach((el: any) => {
        if (this.props.type === 'method') el.operation = '操作';
        el.time1 = [el?.dbtime1 || undefined, el?.detime1 || undefined];
        el.time2 = [el?.dbtime2 || undefined, el?.detime2 || undefined];
        el.time3 = [el?.dbtime3 || undefined, el?.detime3 || undefined];
      });
      this.setState({ data: nextProps.dataSource });
    }
    if (nextProps.getDataFlag !== this.props.getDataFlag) {
      // this.props.form.validateFields();
    }
    return true;
  }


  // 增加一列配置组
  public addGroup = (number: number) => {
    const { dispatch, configGrpup } = this.props;
    if (configGrpup.length < 3) {
      const tempConfigGroup = cloneDeep(configGrpup);
      this.editData(number, 'add');
      tempConfigGroup.splice(number, 0, new Date().getTime());
      this.repeatConfig.splice(number, 0, { index: number, text: null, repreat: [] });
      dispatch({
        type: 'updateState',
        payload: {
          configGrpup: tempConfigGroup,
        },
      });
    }
  };

  // 移除一列配置组
  public removeGroup = (number: number) => {
    const { dispatch, configGrpup, updateTableSettings } = this.props;
    if (configGrpup.length > 1) {
      const tempConfigGroup = cloneDeep(configGrpup);
      this.editData(number, 'remove');
      tempConfigGroup.splice(number, 1);
      // 有重复的时间组
      let delIndex = null;
      this.repeatConfig.forEach((el: any, elIndex: any) => {
        if (el.index === number) {
          delIndex = elIndex;
        }
      });
      if (delIndex || delIndex === 0) {
        this.repeatConfig.splice(delIndex, 1);
      }
      // 只剩一个时间组
      if (tempConfigGroup.length === 1) {
        this.repeatConfig = [];
      }
      console.log('iserr32222222---', delIndex, this.repeatConfig);

      dispatch({
        type: 'updateState',
        payload: {
          configGrpup: tempConfigGroup,
          updateTableSettings: !updateTableSettings,
        },
      });
    }
  };

  /**
   * timeToString 时间字符串转数字字符串
   */
  public timeToString = (timer: string) => {
    return timer.split(':').join('');
  };

  /**
   * validatorTimer 校验一条数据内的时间节点有没重叠
   * 校验逻辑
   * 只有一列配置项，无需校验
   * 有多列需相互校验，
   * getFieldValue获取所有列时间
   * 与其他列时间对比，是否在其他列区间内，是则报错
   * rowsData: 当前行所有单元格的值
   */
  public validatorTimer = (value: string[], index: number, key: string, callback: any, rowsData: any) => {
    let flag: any = false; // 是否有重叠
    const { configGrpup = [] } = this.props;
    const repeatArr = cloneDeep(this.repeatConfig[index].repeat) || [];
    if (value && !value[0] && !value[1]) {
      return callback();
    } else if (configGrpup.length === 1) {
      return callback();
    } else {
      configGrpup.forEach((item: any, number: number) => {
        // 获取当前行中所有的时间进行比较
        const tempTime = rowsData[`time${number + 1}`];
        if (index !== number && tempTime && tempTime[0] && tempTime[1]) {
          if ((this.timeToString(value[0]) >= this.timeToString(tempTime[0]) && this.timeToString(value[0]) <= this.timeToString(tempTime[1])) ||
            (this.timeToString(value[1]) >= this.timeToString(tempTime[0]) && this.timeToString(value[0]) <= this.timeToString(tempTime[1]))) {
            flag = number;
            repeatArr.push(flag);
          }
        }
      });
    }
    if (flag !== false) {
      callback(`时间与配置组${flag + 1}存在重叠`);
      this.repeatConfig.splice(index, 1, { index, repreat: repeatArr, text: `时间与配置组${flag + 1}存在重叠` });
      console.log('repeatConfig---', this.repeatConfig, index);
    } else {
      // eslint-disable-next-line no-unused-expressions
      findIndex(this.repeatConfig, (el: any) => (el.index === index)) > -1 ? this.repeatConfig.splice(index, 1, { index, repreat: [], text: null }) : null;
      callback();
    }
  };

  // 返回
  public handleBack = () => {
    navigate('/boh/boh-store-plan/print-plan');
  };

  // 更新数据
  public updateSource = (index: number, key: string, value: string | any[]) => {
    // const { type, dispatch } = this.props;
    const { data } = this.state;
    const tempDataSource = cloneDeep(data);
    if (key.indexOf('dbtime') > -1) {
      const num = key.split('time')[1];
      tempDataSource[index][key] = value[0];
      tempDataSource[index][`detime${num}`] = value[1];
    } else {
      tempDataSource[index][key] = value;
    }
    this.setState({ data: tempDataSource });
  };

  public render() {
    const { dispatch, pagination, type, configGrpup, isEdit,
      loading, printType, storeDep, onRemove, rowKey, formChanged, getData, getDataFlag,
      onChangePagination, onShowSizeChange, onChangeCell, onChangeCheckBox, updateTableSettings,
      refreshKey, activeKey, onSelect, selectedRowKeys,
    } = this.props;
    const { data } = this.state;
    if (getDataFlag) { // 父级获取数据
      getData(data, this.isErr);
    }
    // 保存
    const handleConfirm = () => {
      if (this.isErr || this.isErr === 0) {
        message.warn(this.isErr);
        return;
      }
      let flag = false;
      // 门店部门，时间全选--打印类型
      data.forEach((item: any) => {
        // 门店部门不能为空
        if (!item.vstoredeptname) {
          message.warn('请选择门店部门');
          flag = true;
        }
        // 时间段全选--打印类型为空
        if ((item.dbtime1 && item.detime1) && (!item.deptType1 || !item.deptType1.length)) {
          message.warn('请选择配置组1的打印类型');
          flag = true;
        }
        if ((item.dbtime2 && item.detime2) && (!item.deptType2 || !item.deptType2.length)) {
          message.warn('请选择配置组2的打印类型');
          flag = true;
        }
        if ((item.dbtime3 && item.detime3) && (!item.deptType3 || !item.deptType3.length)) {
          message.warn('请选择配置组3的打印类型');
          flag = true;
        }
      });
      // 时间段重复
      this.repeatConfig.forEach((el: any) => {
        if (el.text && el.repreat.length < 1) {
          message.warn(el.text);
          flag = true;
        } else if (el.repreat.length > 1) {
          el.repreat.forEach((el2: any) => {
            if (el2 + 1 < configGrpup.length) {
              message.warn(`时间与配置组${el2 + 1}重复`);
              flag = true;
            }
          });
        }
      });
      if (flag || this.isErr || this.isErr === 0) return;

      if (type === 'dish') {
        dispatch({
          type: 'edit',
          payload: {
            printprogList: data,
          },
        });
      } else if (type === 'method') {
        dispatch({
          type: 'edit',
          payload: {
            printProgCookmehodList: data,
          },
        });
      }
    };

    // 配置组columns
    const columnsTemplateConfig: any = configGrpup?.map((item: any, number: number) => [
      // 打印类型
      {
        data: `deptType${number + 1}`,
        type: 'cho.MultipleSelect',
        mode: 'multiple',
        source: printType,
        loopKey: 'code',
        allowClear: true,
        width: 220,
        showCodeAndName: true,
        readOnly: !isEdit,
      },
      // 分组1 分楼层打印
      {
        data: `vfloor${number + 1}`,
        type: 'cho.Select',
        source: booleanSelect,
        width: 120,
        loopKey: 'key',
        loopName: 'value',
        readOnly: !isEdit,
      },
      // 分组1 使用时间段
      {
        data: `time${number + 1}`,
        type: 'cho.TimeInterval',
        width: 420,
        height: 60,
        readOnly: !isEdit,
      },
    ]) || [];
    // 菜品 columns
    let columns: any = [
      // {
      //   data: 'checked',
      //   type: 'checkbox',
      //   choClassName: [`${prefixCls}-checkbox-td`, `${prefixCls}-checkbox-middle-center`],
      // },
      {
        type: 'cho.Render',
        data: 'dishCode',
        readOnly: true,
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        type: 'cho.Render',
        data: 'dishName',
        readOnly: true,
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        type: 'cho.Render',
        data: 'alias',
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        data: 'pk_storedept',
        type: 'cho.Select',
        source: storeDep,
        width: 120,
        loopKey: 'code',
        loopName: 'name',
        readOnly: !isEdit,
      },
      // 是否打印副联
      {
        data: 'assistant',
        type: 'cho.Select',
        source: booleanSelect,
        width: 120,
        loopKey: 'key',
        loopName: 'value',
        readOnly: !isEdit,
      },
    ];
    // 做法columns
    const columnsTemplateMethod = [
      // {
      //   data: 'checked',
      //   type: 'checkbox',
      //   choClassName: [`${prefixCls}-checkbox-td`, `${prefixCls}-checkbox-middle-center`],
      // },
      {
        type: 'cho.Render',
        data: 'dishCode',
        width: 180,
        readOnly: true,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        type: 'cho.Render',
        data: 'dishName',
        readOnly: true,
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        type: 'cho.Render',
        data: 'dishMethodName',
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      {
        type: 'cho.Render',
        data: 'alias',
        width: 180,
        render: (text: string) => <Texttip width={180} text={renderNull(text)} />,
      },
      ...flatten(columnsTemplateConfig),
      {
        data: 'operation',
        type: 'cho.Render',
        choClassName: [`${prefixCls}-checkbox-middle-center`],
        width: 140,
        render: (text: string, record: any) => <Popconfirm placement="topLeft" title="确定要删除该菜品做法吗？" onConfirm={() => onRemove([record.pk_PrintprogCM])} okText="确定" cancelText="取消"><Button style={{ margin: 'auto' }} type="link" >删除</Button></Popconfirm>,
      },
    ];

    // 菜品 表头
    const nestedHeadersDish: any = () => {
      const headers: any = [
        { label: '菜品编码', rowspan: 2 },
        { label: '菜品名称', rowspan: 2 },
        { label: '菜品别名', rowspan: 2 },
        { label: '门店部门', rowspan: 2 },
        { label: '是否打印副联', rowspan: 2 },
      ];
      const dynamicHeaders: any = configGrpup ? configGrpup.map((item: any, number: number) => {
        const labelDom = () => {
          return (
            <div className={`${prefixCls}-header-item-space-between`}>
              <span className={`${prefixCls}-header-item-one`}>配置组{number + 1}</span>
              {
                isEdit &&
                <span className="config-group-box">
                  {configGrpup.length < 3 && <span className="config-group-btn" onClick={() => this.addGroup(number)}>增加一组</span>}
                  {configGrpup.length < 3 && configGrpup.length > 1 && <span> | </span>}
                  {
                    configGrpup.length < 4 && configGrpup.length > 1 ?
                      <Popconfirm placement="topLeft" title="确定要删除该配置组吗？" onConfirm={() => this.removeGroup(number)} >
                        <span className="config-group-btn">删除</span>
                      </Popconfirm>
                      : null
                  }
                </span>
              }
            </div>
          );
        };
        return {
          label: labelDom(),
          colspan: 3,
        };
      }) : [];
      const secondHeaders: any = ['打印类型', '分楼层打印', <span>使用时间段<Tooltip title="若现有配置组时间段均为空，则默认配置1组时间段为0:00:00-23:59:59" >&nbsp;&nbsp;<Icon type="question-circle" /></Tooltip></span>];
      const dynamicSecondHeaders: any = isEdit ? ['', '', '', '', ''] : ['', '', '', '', ''];
      // const dynamicSecondHeaders: any = isEdit ? ['', '', '', '', '', ''] : ['', '', '', '', ''];

      configGrpup && configGrpup.forEach(() => {
        dynamicSecondHeaders.push(...secondHeaders);
      });
      return [
        [
          ...headers,
          ...dynamicHeaders,
        ],
        [...dynamicSecondHeaders],
      ];
    };
    // 做法 表头
    const nestedHeadersMethod: any = () => {
      const headers: any = [
        { label: '菜品编码', rowspan: 2 },
        { label: '菜品名称', rowspan: 2 },
        { label: '菜品别名', rowspan: 2 },
        { label: '做法', rowspan: 2 },
      ];
      const dynamicHeaders: any = configGrpup ? configGrpup.map((item: any, number: number) => {
        const labelDom = () => {
          return (
            <div className={`${prefixCls}-header-item-space-between`}>
              <span className={`${prefixCls}-header-item-one`}>配置组{number + 1}</span>
              {
                isEdit &&
                <span className="config-group-box">
                  {configGrpup.length < 3 && <span className="config-group-btn" onClick={() => this.addGroup(number)}>增加一组</span>}
                  {configGrpup.length < 3 && configGrpup.length > 1 && <span> | </span>}
                  {
                    configGrpup.length < 4 && configGrpup.length > 1 ?
                      <Popconfirm placement="topLeft" title="确定要删除该配置组吗？" onConfirm={() => this.removeGroup(number)} >
                        <span className="config-group-btn">删除</span>
                      </Popconfirm>
                      : null
                  }
                </span>
              }
            </div>
          );
        };
        return {
          label: labelDom(),
          colspan: 3,
        };
      }) : [];
      dynamicHeaders.push({ label: '操作', rowspan: 2 });

      const secondHeaders: any = ['打印类型', '分楼层打印', <span>使用时间段<Tooltip title="若现有配置组时间段均为空，则默认配置1组时间段为0:00:00-23:59:59" >&nbsp;&nbsp;<Icon type="question-circle" /></Tooltip></span>];
      const dynamicSecondHeaders: any = isEdit ? ['', '', '', ''] : ['', '', '', ''];
      // const dynamicSecondHeaders: any = isEdit ? ['', '', '', '', ''] : ['', '', '', ''];
      configGrpup && configGrpup.forEach(() => {
        dynamicSecondHeaders.push(...secondHeaders);
      });
      return [
        [
          ...headers,
          ...dynamicHeaders,
        ],
        [...dynamicSecondHeaders],
      ];
    };
    // 单元格onchange
    const handleChangeCell = (allData: any, curData: any) => {
      // 查找对应的门店部门的名称
      const tempStoreDepVal = curData.prop === 'pk_storedept' && storeDep.filter((item: any) => (item.code === curData?.value));
      // 查找对应的打印类型的名称
      const tempDeptType: any = [];
      let tempDeptTypeIndex: any;
      if (curData.prop.indexOf('deptType') > -1) {
        tempDeptTypeIndex = curData?.prop.substring(curData?.prop.length - 1);
        curData.value.forEach((item: any) => {
          printType.forEach((typeItem: any) => {
            if (typeItem.code === item) tempDeptType.push(item.name);
          });
        });
      }
      // 查找对应时间段的数据并更新数据
      let tempTimeIndex: any;
      if (curData.prop.indexOf('time') > -1) tempTimeIndex = curData?.prop.substring(curData?.prop.length - 1);
      // 修改数据源
      data.forEach((item: any, index: any) => {
        if (index === curData?.row) {
          item[curData.prop] = curData?.value;
          // 门店部门
          item.vstoredeptname = tempStoreDepVal ? tempStoreDepVal[0].name : item.vstoredeptname;
          // 打印类型
          if (tempDeptType.length) {
            item[`deptTypeName${tempDeptTypeIndex}`] = tempDeptType;
          }
          // 时间段
          if (tempTimeIndex) {
            item[`dbtime${tempTimeIndex}`] = curData?.value[0];
            item[`detime${tempTimeIndex}`] = curData?.value[1];
            // 当前配置组的打印类型是否为空
            if (!item[`deptType${tempTimeIndex}`] || !item[`deptType${tempTimeIndex}`]?.length) {
              message.warn('请选择打印类型');
            }
            // 时间区间是否完整
            if (curData?.value[0] && !curData?.value[1]) {
              message.warn('时间区间不能为空');
              this.isErr = '时间区间不能为空';
            } else if ((curData?.value[0] && curData?.value[1]) || (!curData?.value[0] && !curData?.value[1])) {
              this.isErr = '';
            }
            // 时间完整
            if (curData?.value[0] && curData?.value[1]) this.isErr = '';
            // console.log('newdata0000----', data, curData);
            // 时间区间是否重叠
            this.validatorTimer(curData.value, tempTimeIndex - 1, type === 'dish' ? item.dishCode : item.pk_PrintprogCM, (content: any) => {
              content && message.warn(content);
            }, item);
          }
        }
      });
      // console.log('newdata----', data, curData);

      onChangeCell && onChangeCell(allData, curData);
    };
    if (type === 'dish') {
      // columns.splice(4, 0, ...columnsTemplateDish);
      columnsTemplateConfig.forEach((item: any) => {
        columns.push(...item);
      });
      if (!isEdit) columns.shift();
    } else if (type === 'method') {
      columns = [...columnsTemplateMethod];
      if (!isEdit) {
        columns.shift();
        columns.pop();
      }
    }
    // 行选择
    const rowSelection = isEdit ? {
      selectedRowKeys,
      onChange(keys: any[], rows: any[]) {
        onSelect(keys, rows);
      },
    } : '';
    return (
      <div>
        <Table
          loading={loading}
          columns={columns}
          nestedHeaders={type === 'dish' ? nestedHeadersDish() : nestedHeadersMethod()}
          dataSource={data}
          rowKey={rowKey}
          updateTableSettings={updateTableSettings}
          refreshKey={refreshKey}
          activeKey={activeKey}
          isEdit={isEdit}
          fixedColumnsLeft={4}
          pagination={pagination}
          onChangePagination={onChangePagination}
          onShowSizeChange={onShowSizeChange}
          onChangeCell={handleChangeCell}
          onChangeCheckBox={onChangeCheckBox}
          rowSelection={rowSelection}
        />
        <Affix offsetBottom={0} style={{ marginTop: data && !data.length ? 16 : 0, zIndex: 200 }}>
          <div>
            {isEdit && <Button loading={loading} type="primary" onClick={handleConfirm}>保存</Button>}
            {isEdit && formChanged ? <Popconfirm title="返回将不保存当前修改内容，确定继续？" onConfirm={this.handleBack} ><Button className="margin-left-16">返回</Button></Popconfirm> : <Button className={isEdit ? 'margin-left-16' : ''} onClick={this.handleBack}>返回</Button>}
          </div>
        </Affix>
      </div>
    );
  }
}

export default Index;
