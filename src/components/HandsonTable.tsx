import React from 'react';
import { Popconfirm, Icon, Tooltip } from 'antd';
import Table from './common/table-editor-pro/index';
import { dataSource, printType, storeDep } from './common/mock';
import './index.css';

// 是否下拉框
const booleanSelect = [{ key: 'Y', value: '是' }, { key: 'N', value: '否' }];
const prefixCls = 'choice';

class Index extends React.Component<any, any> {
  public configGrpup: any[]; // 配置组重复的时间段

  public constructor(props: any) {
    super(props);
    this.configGrpup = [
      new Date().getTime(), new Date().getTime(), new Date().getTime()];
    this.state = {
      loading: false,
      data: dataSource,
      selectedRowKeys: [],
      updateTableSettings: false,
    };
  }

  public render() {
    const { data, selectedRowKeys, loading, updateTableSettings,
    } = this.state;

    // 配置组columns
    const columnsTemplateConfig: any = this.configGrpup?.map((item: any, number: number) => [
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
      },
      // 分组1 分楼层打印
      {
        data: `vfloor${number + 1}`,
        type: 'cho.Select',
        source: booleanSelect,
        width: 120,
        loopKey: 'key',
        loopName: 'value',
      },
      // 分组1 使用时间段
      {
        data: `time${number + 1}`,
        type: 'cho.TimeInterval',
        width: 420,
        height: 60,
      },
    ]) || [];
    // 菜品 columns
    let columns: any = [
      {
        type: 'cho.Render',
        data: 'dishCode',
        readOnly: true,
        width: 180,
        render: (text: string) => <span>{text}</span>,
      },
      {
        type: 'cho.Render',
        data: 'dishName',
        readOnly: true,
        width: 180,
        render: (text: string) => <span>{text}</span>,
      },
      {
        type: 'cho.Render',
        data: 'alias',
        width: 180,
        render: (text: string) => <span>{text}</span>,
      },
      {
        data: 'pk_storedept',
        type: 'cho.Select',
        source: storeDep,
        width: 120,
        loopKey: 'code',
        loopName: 'name',
      },
      // 是否打印副联
      {
        data: 'assistant',
        type: 'cho.Select',
        source: booleanSelect,
        width: 120,
        loopKey: 'key',
        loopName: 'value',
      },
    ];
    columns.push(...columnsTemplateConfig)
    // 菜品 表头
    const nestedHeadersDish: any = () => {
      const headers: any = [
        { label: '菜品编码', rowspan: 2 },
        { label: '菜品名称', rowspan: 2 },
        { label: '菜品别名', rowspan: 2 },
        { label: '门店部门', rowspan: 2 },
        { label: '是否打印副联', rowspan: 2 },
      ];
      const dynamicHeaders: any = this.configGrpup ? this.configGrpup.map((item: any, number: number) => {
        const labelDom = () => {
          return (
            <div className={`${prefixCls}-header-item-space-between`}>
              <span className={`${prefixCls}-header-item-one`}>配置组{number + 1}</span>
              {
                isEdit &&
                <span className="config-group-box">
                  {this.configGrpup.length < 3 && <span className="config-group-btn" onClick={() => this.addGroup(number)}>增加一组</span>}
                  {this.configGrpup.length < 3 && this.configGrpup.length > 1 && <span> | </span>}
                  {
                    this.configGrpup.length < 4 && this.configGrpup.length > 1 ?
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

      this.configGrpup && this.configGrpup.forEach(() => {
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
      console.log('changecell----', allData, curData);
    };
    // 行选择
    const rowSelection = {
      selectedRowKeys,
      onChange(keys: any[], rows: any[]) {
        console.log('rowSelection----', keys, rows);
      },
    };
    // 分页信息
    const pagination = {
      pageSize: 200,
      current: 1,
      onChange: (page: any, pageSize: any) => { },
    };
    const onChangePagination = () => { };
    const onShowSizeChange = ()=>{};
    return (
      <div>
        <Table
          loading={loading}
          columns={columns}
          nestedHeaders={nestedHeadersDish}
          dataSource={data}
          rowKey={'pk_pubitem'}
          updateTableSettings={updateTableSettings}
          fixedColumnsLeft={4}
          pagination={pagination}
          onChangePagination={onChangePagination}
          onShowSizeChange={onShowSizeChange}
          onChangeCell={handleChangeCell}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}

export default Index;
