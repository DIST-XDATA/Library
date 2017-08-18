# 运维平台-组织机构

数慧运维平台的组织机构页面长这样：
![](http://i.imgur.com/MPviWre.png)

我们使用 `antd` 的 `table` 方式展示现有的组织机构，且有添加组织机构、添加子机构、更新机构、批量删除机构等功能，这些功能都需要与后台服务器交互。

## 1. 定义 Model

1. 这个页面涉及的 `state` 包括 `orgs`（机构）/  `selectedRowKeys` （表格选中项的 keys 数组，用于批量删除） 。

2. `reducer` 接受 `state` 和 `action` , 返回新的 `state` 。

3. 用 `effect` 来接收用户处理的数据，提交给后台服务器，然后触发 `action` 由 `reducer` 来更新 `state` 。

4. 用 `subscription` 来监听路由变化，当浏览器地址栏为 `'/orgs'` 时触发获取所有组织机构的 `action` 。

修改 `models/organization.js` ：

```javascript

import * as OrgService from '../services/Organization';
export default {
  namespace: 'organization',
  state: {
    orgs: [],
    selectedRowKeys: [],
  },
  reducers: {
    queryComplete(){}, //初始化
    selectRow(){}  // 更新选中内容
  },
  effects: {
    *getAll() {},  //获取所有组织机构
    *addOrg() {},  //添加机构
    *updateOrg() {}, //更新机构
    *deleteOrgs() {}  //删除机构
  },
  subscriptions: {
    setup({ dispatch, history }) { //监听路由变化
      history.listen(({pathname, query}) => {
        if (pathname === '/orgs') {
          dispatch({ type: 'getAll'})
        }
      })
    }
  }
};
```
## 2. 配置 service

我们要展示的组织机构数据来自于服务器，所以需要配置 service 文件以获取服务器的相应数据。

新增 `services/organization.js` ：

```javascript
import {get,post,put,deleteData} from '../utils/request';

export function getAll() {
  return get(`yw/admin/orgs`);
}
export function deleteOrgs(ids) {
  return deleteData(`yw/admin/orgs`,ids);
}
export function addOrg(org) {
  return post(`yw/admin/org`,org);
}
export function updateOrg(org) {
  return put(`yw/admin/org`,org);
}
```


- 调用 `request.js` 的 get / post / put / deleteData 方法。

- 例如当我们触发 `getAll`异步事件时调用 `orgServer` 的 `getAll` 方法，将 `yw/admin/orgs` URL 传给 request.js 的 `get` 方法，从服务器获取所有组织机构数据。


## 3. 编写 Component


组织机构用 `Table` 展现：

```javascript
//components/organization/OrganizationList.js

import { Table, Popconfirm, Button, Icon, message, Modal } from 'antd';
import { connect } from 'dva';
import constants from '../../utils/constants';

const OrganizationList = ({ dispatch, loading, orgs, selectedRowKeys }) => {
  function handleOK() {}
  function updateOrg(item, field, value) {}
  function confirmDelete() {}
  function deleteSelect(id) {}

  const columns = [
    {title: 'ID',dataIndex: 'id',key: 'id'}, 
    {title: '名称',dataIndex: 'name',key: 'name',width:"60%",render: (text, record, index) => (
      <input item={record} value={text} field="name" onChange={updateOrg} />
     )},
    {title: '操作',key: 'operation',render: (text, record) => (
      <p>
        <a onClick={() => console.log(record)}>添加子机构</a>&nbsp;
        <Popconfirm title="确定要删除吗？" onConfirm={()=>deleteSelect(record.id)}>
          <a>删除</a>
        </Popconfirm>
      </p>)
    }];

  const rowSelection = {
    selectedRowKeys,
    onChange: function(keys){
    //TODO: 找出新增的key、删除的key，用于动态设置选中项
      dispatch({
        type:"organization/selectRow",
        payload:{ selectedRowKeys: keys }
      });
    }
  };
  const hasSelected = selectedRowKeys.length > 0;
  const testOrgs = [
    {key: 'test1', id: '1', name: '机构1'},
    {key: 'test2', id: '2', name: '机构2'}
  ];
  return (
    <div style={{backgroundColor:'#fff',padding:'15px'}}>
      <div style={{marginBottom: 10}}>
         <Button type="primary" icon="plus" onClick={handleOK}>添加组织机构</Button>
         <Button type="primary" style={{ marginLeft:8, marginRight: 8 }} icon="delete" onClick={confirmDelete} disabled={!hasSelected}>删除组织机构</Button>
         <span>{selectedRowKeys.length>0 ? `选中了 ${selectedRowKeys.length} 项` : ''}</span>
      </div>

      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        dataSource={testOrgs}//这里先用测试数据检查页面效果，获得真实数据后换成 orgs
        loading={loading}
        rowKey={record => record.id}
      />
    </div>
  )
}

```

 

## 4. 绑定数据


```javascript
//components/organization/OrganizationList.js

function mapStateToProps(state) {
  const organization = state.organization;
  return {
    ...organization,
    loading: state.loading.models.organization,
  }
}
export default connect(mapStateToProps)(OrganizationList);
```

connect Model 后 `OrganizationList` 组件就有了 dispatch 、 loading 和 organizaiton Model里的 state 所有数据。



## 5. Route Component


```javascript
//routes/OrganizationPage.js
import OrganizationList from '../components/organization/OrganizationList';
function OrganizationPage(){
  return (
    <OrganizationList />
  )
}
export default OrganizationPage
```
切换到浏览器（自动更新），可以看到测试数据已显示在组织机构页面，效果如下图，接下来我们要做的就是完成 Event，即添加、更新、删除功能。

![](http://i.imgur.com/DuG7NrN.png)

## 6. 修改 model ，更新 state

```javascript
//models/organization.js
import constants from '../utils/constants';
import { message } from 'antd';
  ...
  reducers: {
    queryComplete(state, { payload }) {
      return { ...state, ...payload, selectedRowKeys: [] };
    },
    selectRow(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *getAll({payload}, { call, put }) {
      const result = yield call(OrgService.getAll);
      if (result.status === constants.HttpStatus.OK) {
        yield put({type: 'queryComponent', payload: {orgs: result.data}});
      } else {
        message.error(`获取组织机构失败：${result.message}`);
      }
    },
    *addOrg({payload}, {call,put}) {
      const result = yield call(OraService.addOrg, payload.org);
      if (result.status === constants.HttpStatus.OK){
        yield put({type: 'getAll'});
      }
      payload.callback(result);
    },
    *updateOrg() {
      const result = yield call(OrgService.updateOrg, payload);
      if(result.status === constants.HttpStatus.OK) {
        message.success(`组织机构修改成功`);
        yield put({type: 'getAll'});
      }else{
        message.error(`组织机构修改失败：${result.message}`);
      }
    },
    *deleteOrgs() {
      const result = yield call(OrgService.deleteOrg, payload.selectedRowKeys);
      if(result.status === constants.HttpStatus.OK) {
        message.success(`组织机构修改成功`);
        yield put({type: 'getAll'});
      }else{
        message.error(`组织机构修改失败：${result.message}`);
      }
    }
  },
...
```


## 6. 将 Input 封装成 EditableCell 组件

在 Table 中我们把组织机构名称写成一个 Input ，方便更改其名称。我们可以更完善一点，将其封装成一个 EditableCall 组件，保存是否可编辑的状态及更新， 每个 organization 有一个 EditableCell 。

新增 `components/base/EditableCell.js` ：

```javascript
import React, {Component} from 'react';
import {Input, Icon} from 'antd';

export default class EditableCell extends Component {
  constructor(props) { 
    super(props); //继承父组件的 props
    this.state = { //构建自己的 state 
      item: this.props.item,
      field: this.props.field,
      value: this.props.value,
      editable: false,
    };
  }
  //当用户操作 input 框时，修改 input 框内容
  handlerChange = (e) => {
    this.setState({ value: e.target.value })
  }
  //按下 Enter 后，调用父组件的 onChange 方法传递更新的数据。
  updateValue = () => {
    this.setState({ editable: false});
      if (this.props.onChange) {
        this.props.onChange(this.state.item, this.state.field, this.state.value);
        let temp = this.state.item;
        temp[this.state.field] = this.state.value;
        this.setState({ item:temp });
      }
    }
  //修改是否可编辑状态
  edit = () => {
    this.setState({ editable: true});
  }
  render() {
    return (
      <div>
        { //editable 为 true 时显示 input 框
          this.state.editable 
          ? <div style={{display:'flex',alignItems:'center'}}>
              <Input value={this.state.value} onChange={this.handlerChange} onPressEnter={this.updateValue} />
              <Icon type="check" onClick={this.updateValue} />
            </div>
          : <div>
             {this.state.value || ''}
             <Icon type="edit" onClick={this.edit} />
            </div>
         }
       </div>
     )
  }
}
```
修改 `OrganizationList.js` ，将 `Input` 改成 `EditableCell`，

```javascript
//components/organization/OrganizationList.js
import EditableCell from '../base/EditableCell';
...
  //更新机构
  function updateOrg(item, field, value) {
    if (value.length === 0) {
      message.error('组织机构名称不允许为空，请重新设置！')
    } else {
      if (item[field] != value && value.length > 0) {
        dispatch({
          type: 'organization/updateOrg',
          payload: {
            id: item.id,
            name: value,
            parent: item.parent,
            sort: item.sort
          }
        })
      }
    }
  }
  ...
  //将 input 改成 EditableCell ， 传入props
  const columns = [
    ...
    {title: '名称',dataIndex: 'name',key: 'name',width:"60%",render: (text, record, index) => (
      <EditableCell item={record} value={text} field="name" onChange={updateOrg} />
    )},
    ...
  }];
```

效果如下：

![](http://i.imgur.com/oWwfjc4.png)


## 7. 弹出对话框 ModalComponent 组件

点击“添加组织机构”按钮，弹出对话框，处理 Modal 的 visible 状态，有两种思路：
1. 存在 model state 里
2. 存在 component state 里

这里我们采用第2中方法，封装成 OrganizationModal 组件，在次之前我们先创建一个 ModalComponent 基础组件，包含对话框的显示和隐藏事件，之后所有的对话框可以继承该基础组件，重构形成需要的功能不同的组件。

新增 `base/ModalComponent.js` ：
```javascript
import react, {Component} from 'react';

class ModalComponent extends Component {
  constructor(props){
    super(props);
      this.state = {
        visible: false,
        loading: false
      }
    }
  showModalHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true
    })
  }
  hideModalHandler = () => {
    this.setState({
      visible: false,
    })
  }
  okHandler = () => {};
  render() {
    return (
      <div>Hello, ModalComponent</div>
    )
  }
}
export default ModalComponent;
```
新增 `components/organization/OrganizationModal.js`：

```javascript
import { Modal, Form, Input, message, Cascader } from 'antd';
import ModalComponent from '../base/ModalComponent';
import constants from '../../utils/constants';
const FormItem = Form.Item;

class OrganizationModal extends ModalComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.record.name || "",
      orgs: this.props.orgs
    };
  };
  okHandler = () => {
    this.props.form.validateFields((err, item) => {
      if (!err) {
        //添加
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let data = [];
    return (
      <span>
        <span onClick={this.showModalHandler}>
           {this.props.children}
        </span>
        <Modal title="添加组织机构"
          visible={this.state.visible}
          confirmLoading={this.state.loading}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
          maskCloseable={false}>
          <Form>
            <FormItem label="名称" hasFeedback>
             {
               getFieldDecorator('name', {
               rules: [{ required: true ,message:"请输入名称！"}],
                  initialValue:this.state.name
              })(<Input />)}
            </FormItem>
            <FormItem label="所属组织">
             {
               getFieldDecorator('parent',{
                 initialValue: [constants.ROOT],
                 rules: [{type:'array',required:true, message:'请输入所属机构！'}]
               })( <Cascader showSearch changeOnSelect options={data} />)
             }
            </FormItem>
          </Form>
        </Modal>
      </span>
    )	
  }
}

export default Form.create()(OrganizationModal);
```

修改 `OrganizationList.js` ，将 `Button` 添加组织机构改成 `OrganizationModal`：

```javascript
+import OrganizationModal from './OrganizationModal';
...
+ function handleOK(name, parent, callback) {
+   dispatch({
+     type: 'organization/addOrg',
+     payload: {org: {name, parent}, callback}
+   })
+ }
...
- <Button type="primary" icon="plus" onClick={handleOK}>添加组织机构</Button>
+ <OrganizationModal key={constants.getKey()} orgs={orgs} record={{}} onOk={handleOK}> 
+   <Button type="primary" icon="plus">添加组织机构</Button>
+ </OrganizationModal> 
```
添加功能已完成，效果如下：

![](http://i.imgur.com/hdULblw.png)

批量删除：

```javascript
function confirmDelete() {
  Modal.confirm({
    title: `确定删除这${selectedRowKeys.length}项组织机构吗？`,
    onOk() {
      deleteSelect();
    }
  });
}
function deleteSelect(id) {
  dispatch({
    type: 'organization/deleteOrgs',
    payload: {
      selectedRowKeys: isNaN(id) ? selectedRowKeys:[id]
    }
  })
}
```

效果如下：

![](http://i.imgur.com/HDPgcr1.png)

好，我们的组织机构页面暂时完成了，注意将测试数据改回 `orgs` 真实数据。

## 下一步

敬请期待。

以上。


