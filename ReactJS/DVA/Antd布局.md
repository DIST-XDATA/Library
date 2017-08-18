# React 单页布局

我们将使用 React + Dva + antd 完成一个简单的单页布局，同时加深对 dva 架构中数据流的理解，在“问答”页面加上一个提问的组件。

该布局界面效果如下：
![](http://i.imgur.com/4YLPL22.png)

由上图可以看出该页面的布局方式为 “侧边-顶部-布局”，侧边导航栏固定不动，内容区可以根据内容高度上下滚动，我们可以使用 antd 的侧边布局方式，将 Sider（侧边栏） 单独封装成一个 Component 、IndexPage 作为 Route Component 将页面展示， 引入 antd 的 layout ，由 Sider / Header / Content / Footer 组成整个页面，Content 包括侧边栏指向的 表格/表单/图表...子组件。

## 1. 创建应用
	
	// 安装 dva-cli
	$ npm install -g dva-cli
	//创建应用
	$ dva new dva-buju
	$ cd dva-buju //进入该应用目录
	$ npm install antd babel-plugin-import --save //安装antd 和 babel-plugin-import 

编辑 `.roadhogrc`，使 `babel-plugin-import` 插件生效。


	"extraBabelPlugins": [
	-   "transform-runtime"
	+   "transform-runtime",
	+   ["import", { "libraryName": "antd", "style": "css" }]
  	],


然后启动服务器：

	$ npm start

浏览器会自动开启，并打开[http://localhost:8000](http://localhost:8000 "http://localhost:8000")，你会看到dva的欢迎界面。

## 2. Sider 组件

侧边导航栏使用 antd 的 `Menu` ，用户依赖导航在各个页面中进行跳转。
	
	$ dva g component Sider --no-css

```javascript
//components/Sider.js
import React, {Component} from 'react';
import { Menu, Icon } from 'antd';
import styles from '../routes/IndexPage.css';
import logoSrc from '../assets/logo.png';
const SubMenu = Menu.SubMenu;

const SiderComponent = () => {
  return(
  <div className={styles.leftMenu}>
    <img src={logoSrc} width="50" className={styles.logo} />
    <Menu theme="dark" 
      defaultOpenKeys={['sub1', 'sub2']}
       defaultSelectedKeys={['5']}  
      mode="inline"
    >
      <SubMenu
        key="sub1"
        title={<span><Icon type="mail" /><span>导航一</span></span>}
      >
        <Menu.Item key="1">表格</Menu.Item>
        <Menu.Item key="2">表单</Menu.Item>
        <Menu.Item key="3">图表</Menu.Item>
        <Menu.Item key="4">日历</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        title={<span><Icon type="team" /><span>导航二</span></span>}
      >
        <Menu.Item key="5">问答</Menu.Item>
        <Menu.Item key="6">关注</Menu.Item>
      </SubMenu>
    </Menu>
  </div>
  )
}
export default SiderComponent;

```



## 3. Route Component

```javascript
//routes/IndexPage.js
import React, {Component} from 'react';
import styles from './IndexPage.css';
import { Layout, Menu, Icon } from 'antd';
import SiderComponent from '../components/Sider';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function IndexPage({children}) {
  return (
    <Layout style={{width:'100%',height: '100%'}}>
      //侧边栏
      <Sider>
        <SiderComponent />
      </Sider>
      <Layout>
        //顶部菜单
        <Header style={{ background: '#fff', padding: 0 , borderBottom:'1px solid #ccc'}}>
          <Menu mode="horizontal" style={{float:'right'}}>
            <SubMenu  title={<span><Icon type="user"/>YangHJ</span>}>
              <Menu.Item key="setting:1">退出</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        //内容区，嵌入子组件
        <Content className={styles.rightBox}>
            {children || 'content'}
        </Content>
        <Footer className={styles.footer}>
            React Dva Demo ©2017 Created by YHJ
        </Footer>
      </Layout>
    </Layout>
  );
}
export default IndexPage;
```
注：此时侧边栏组件还没有实现路由跳转功能。

切换到浏览器（自动刷新），此时界面为：

![](http://i.imgur.com/YtHu7NO.png)

## 4. 路由配置

路由配置，使点击侧边菜单栏时，刷新右侧内容区域的内容。

1. 默认的 IndexPage 内容区域需要默认内容
2. 点击菜单后仅局部刷新右侧内容区域
3. 点击刷新需要做相关的配置

新建以下文件：`AnimatePage.js` / `CalendarPage.js` / `ChartPage.js` / `FormPage.js` / `QuestionPage.js` / `TablePage.js`，放在 `/routes` 目录下，基本内容如下：

```javascript
//routes/AnimatePage.js
import React from 'react'
const Animate = () => {
  return (
    <div>关注</div>
  )
}
export default Animate;

```

然后修改 `router.js` ：
```javascript
import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import IndexPage from './routes/IndexPage';
import QuestionPage from "./routes/QuestionPage.js";
import Table from './routes/TablePage.js';
import Form from './routes/FormPage.js';
import Chart from './routes/ChartPage.js';
import Calendar from './routes/CalendarPage.js';
import Animate from './routes/AnimatePage.js';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage}>
        <IndexRoute component={QuestionPage} />
        <Route path="table" component={Table} />
        <Route path="form" component={Form} />
        <Route path="chart" component={Chart} />
        <Route path="calendar" component={Calendar} />
        <Route path="animate" component={Animate} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
```

注：
1. `history` 监听浏览器地址栏的变化，并解析这个 `URL` 转化为 `location` 对象，然后 `router` 使用它匹配到路由，最后正确地渲染相应的组件。 
2. `Router` 本身只是一个容器，真正的路由要通过 `Route` 组件定义，`Route` 组件定义了 URL 路径与组件的对应关系。比如用户访问 `/` 时，加载 `IndexPage` 组件。
3. 路由嵌套：比如用户访问 `/table` 时，会先加载 `IndexPage` 组件，然后在它的内部加载 `Table` 组件。
2. `IndexRoute` 表示默认路由，当用户访问 `'/'` 时，默认展示 `QuestionPage` 组件，注意 `IndexRoute` 组件没有路径参数 `path`。

最后给左侧菜单加上点击切换路由效果，也就是 `Link` 标签，修改 `Sider.js` ：
```javascript
//components/Sider.js
import { Link } from 'dva/router'; 
...
const SiderComponent = () => {
  return(
  <div className={styles.leftMenu}>
    <img src={logoSrc} width="50" className={styles.logo} />
    <Menu theme="dark" 
      defaultOpenKeys={['sub1', 'sub2']}
       defaultSelectedKeys={['5']}  
      mode="inline"
    >
      <SubMenu
        key="sub1"
        title={<span><Icon type="mail" /><span>导航一</span></span>}
      >
        <Menu.Item key="1"><Link to="/table">表格</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/form">表单</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/chart">图表</Link></Menu.Item>
        <Menu.Item key="4"><Link to="/calendar">日历</Link></Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        title={<span><Icon type="team" /><span>导航二</span></span>}
      >
        <Menu.Item key="5"><Link to="/">问答</Link></Menu.Item>
        <Menu.Item key="6"><Link to="/animate">关注</Link></Menu.Item>
      </SubMenu>
    </Menu>
  </div>
  )
}
```
注： `<Link to=" ">` to 指向的 path 对应 `router.js` 文件下该组件的 `path` 。

至此，侧边菜单栏切换页面效果基本完成，接下来我们开始渲染每个页面。

## 5. 完善子组件

**表格**：使用 antd 的 `Table` ，这里的页数是个常数，我们可以将其写入 constants.js 文件中，然后引用。

新增 `utils/constans.js`：
```javascript
export const PAGE_SIZE = 10;
```
修改 `TablePage.js`：

```javascript
//components/TablePage.js
import React from 'react'
import {Table, Pagination, Popconfirm, Icon} from 'antd'
import { PAGE_SIZE } from '../utils/constants'

function TableComponent() {
  const columns = [{
      title: 'Name',
      dataIndex: 'name',
      width: '20%'
  },{
      title: 'Age',
      dataIndex: 'age',
      width: '20%',
  },{
      title: 'Address',
      dataIndex: 'address',
      width: '20%'
  },{
      title: 'Remark',
      dataIndex: 'remark',
      width: '20%',
      render(text) {
        return <a href={text} target="_blank">Github</a>
      }
  },{
      title: 'Operation',
      dataIndex: 'operation',
      width: '20%',
      render() {
        return (
          <span>
            <a>Edit </a>
            <Popconfirm title="Confirm to delete?">
              <a href=""> Delete</a>
            </Popconfirm>
          </span>
        )
      }
  }];
  const tableData = [];
  for (let i = 0; i < 46; i++) {
    tableData.push({
      key: i,
      name: `YangHJ ${i+1}`,
      age: '18',
      address: `张衡路润和总部${i+1}号`,
      remark: 'https://github.com/Heal7',
    })
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log(selectedRowKeys)
    }
  }
  const pagination = {
    total: tableData.length,
    showSizeChanger: true,
    onShowSizeChange(current, pageSize) {
      console.log('Current: ', current, '; PageSize: ', PAGE_SIZE)
    },
    onChange(current) {
      console.log('Current: ', current)
    }
  }
  return (
    <Table 
      rowSelection={rowSelection} 
      columns={columns} 
      dataSource={tableData} 
      bordered 
      pagination={pagination} />
  )
}
export default TableComponent;
```

注：其他子组件详见项目代码 [dva-layout](https://github.com/Heal7/dva-layout)，这里就不贴上了，着重讲“问答”页面组件。


## 6. 问答页面

问答页面效果如图：
![](http://i.imgur.com/xMkDO9P.png)
![](http://i.imgur.com/OEJXQzn.png)

基本功能包括：添加问题，给某个问题投票，问题按投票数从高到低排序。

### 划分组件

> React.js 中一切都是组件，React 构建的功能其实就是由各种组件组合而成。所以拿到一个需求后，我们要做的第一件事就是理解需求、分析需求、划分需求由哪些组件构成。

对于上面问答的功能，可以粗略地划分成以下几个部分：

 
- `ShowAddButton` ： 点击显示 Form 表单的按钮。

- `QuestionForm` ：负责用户输入可操作的输入区域，包括问题标题、问题描述、确认按钮，这一部分划分在 `MessageForm` 组件中。

- `QuestionList` ：问题列表，用 `	QuestionList` 组件负责列表的展示。

- `QuestionItem` ：每条问题由独立的组件 `QuestionItem` 负责显示，这个组件被 `QuestionList` 所用。

### 定义 Modal 

在这个需求中， `state` 包括 formIsShow （是否显示表单） / 以数组形式表示的问题列表， `reducers` 包括添加问题，转换表单显示状态、改变投票数事件。

新增 `models/question.js` ：

```javascript
export default {
  namespace: 'question',
  state: {
    formIsShow: false,
    questions: [
      {
        id: 1,
        title: '如何看待“慰安妇”——日军性奴隶受害者为题材的电影《二十二》？',
        description: '8月14日，世界“慰安妇”纪念日。8.14这部电影就要上映了。最近战狼让我们看到了国家的复兴，我们的民族已经很强大了。可是我们不应该只看到辉煌的现在而忘记了不堪回首的过去。“慰安妇”一直是一个很敏感的词汇，人们对它的认识，对它的关注一直以来都太少太少了。',
        voteCount: 77
      },
      {
        id: 2,
        title: '如何评价电影《战狼2》',
        description: '本片拍摄得到了中国人民解放军南京军区的大力支持，动员了多款新式武器装备，采用近万发子弹，上百辆坦克以及武直-10直升机进行实战拍摄。吴京还经过特批在特种部队体验生活18个月',
        voteCount: 7
      },
      {
        id:3,
        title:'热爱编程是一种怎样的体验？',
        description:'别人对玩游戏感兴趣，我对写代码、看技术文章感兴趣；把泡github、stackoverflow、v2ex、reddit、csdn当做是兴趣爱好；遇到重复的工作，总想着能不能通过程序实现自动化；喝酒的时候把写代码当下酒菜，边喝边想边敲；不给工资我也会来加班；做梦都在写代码。',
        voteCount:5
      }
    ]
  },
  reducers: {
    toggleForm(state) {
      return { ...state, formIsShow: !state.formIsShow }
    },
    changeVote(state, {payload}) {
      const {index, question} = payload;
      return { ...state, questions: [...state.questions.slice(0, index), question, ...state.questions.slice(index+1)] }
    },
    addQuestion(state, {payload}) {
      return { ...state, questions: [...state.questions, payload] }
    }
  }
};
```
改变投票数的逻辑：

每条问题，即每个 `QuestionItem` 组件都有个投票按钮，点击相应投票按钮 dispatch `changeVote` 事件，同时传递改变投票数之后的这条 `question` 数据和其 `index` 给 `payload`。然后由 model 更新 `state` ，使页面重新渲染。 
 

### 构建组件


**ShowAddButton**

新增 `components/question/ShowAddButton.js` ：
```javascript
import React from 'react';
import styles from '../../routes/QuestionPage.css';

function ShowAddButton({onToggleForm}) {
  return (
    <button className={styles.button} onClick={onToggleForm}>添加问题</button>
  );
}
export default ShowAddButton;

```
注： 由父组件通过 `props` 传入 `onToggleForm` 属性，点击调用该属性，触发 `toggleForm` action。

**QuestionForm**

新增 `components/question/QuestionForm.js` ：

```javascript
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from '../../routes/QuestionPage.css';
const FormItem = Form.Item;

function QuestionForm({form, formIsShow, onAddQuestion, onToggleForm}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onAddQuestion(values);
        form.resetFields();
        message.success('提问成功！');
      }
    })
  }
  const formDisplay = formIsShow ? 'block' : 'none';
  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={handleSubmit} style={{display: formDisplay, overflow:'hidden', marginBottom:'20px'}}>
      <label style={{fontWeight:'bold',fontSize:'16px'}}>问题</label>
      <FormItem title="问题" hasFeedback>
        {
          getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入问题的标题'}]
          })(
            <Input placeholder="您的问题的标题是..." onPressEnter={handleSubmit} />
          )
        }
      </FormItem>
      <FormItem >
        {
          getFieldDecorator('description')(
            <Input type="textarea" rows="4" placeholder="问题的描述..." onPressEnter={handleSubmit} />
          )
        }
      </FormItem>
      <Button type="primary" htmlType="submit" className={styles.confirm} onClick={handleSubmit}>确认</Button>
      <Button type="default" htmlType="reset" className={styles.cancel} onClick={onToggleForm}>取消</Button>
    </Form>
  );
}
export default Form.create()(QuestionForm)
```

**QuestionList**
```javascript
import React from 'react';
import QuestionItem from './QuestionItem';

function QuestionList({questions, sortQuestion}) {
  //调用排序方法，由父组件通过props传入
  if (questions && questions.length > 0) {
    questions = sortQuestion(questions);
  }
  return (
    <div>
      {
        questions.map((q, index) => {
          return (
            <QuestionItem
                key={q.id} 
                index={index}
                question={q} 
            />
          )
        })
      }
    </div>
  );
}
export default QuestionList;
```

**QuestionItem**
```javascript
import React from 'react';
import { connect } from 'dva'
import styles from '../../routes/QuestionPage.css';
import { Button, Icon } from 'antd';

function QuestionItem({dispatch, index, question}) {
  function voteUp() {
    question = {...question, voteCount: question.voteCount + 1 }
    dispatch({
      type: 'question/changeVote',
      payload: {question, index}
    })
  }

  function voteDown() {
    question = {...question, voteCount: question.voteCount - 1 }
    dispatch({
      type: 'question/changeVote',
      payload: {question, index}
    })
  }
  return (
    <div className={styles.item}>
      <div className={styles.mediaLeft}>
        <Button type="default" onClick={voteUp} style={{width:'50px', marginBottom:'10px'}}>
          <span className={styles.voteCount}><Icon type="caret-up" /></span>
          <span className={styles.voteCount}>{question.voteCount}</span>
        </Button>
        <Button type="default" icon="caret-down" onClick={voteDown} style={{width:'50px'}} />
      </div>
      <div className={styles.mediaBody}>
        <h4 className={styles.title}>{question.title}</h4>
        <p className={styles.description}>{question.description}</p>
      </div>
    </div>
  );
}
export default connect()(QuestionItem);
```
注：
1.  `QuestionItem` connect 数据之后，该组件就有了 `dispatch `属性， `index` / `question` 是由父组件传入的属性。
2.  `dispatch({type:'question/changeVote'})` 表示触发了一个 `{question/changeVote'}` 的action ，将要传递的数据存入 `payload`，由 model 处理数据。

### Router Component

> 在 dva 中我们通常以页面维度来设计 Route Components 。通常需要 connect model 的组件都是 Route Components 

修改 `QuestionPage.js` ：
```javascript
import React from 'react';
import { connect } from 'dva';
import styles from './QuestionPage.css';
import ShowAddButton from '../components/question/ShowAddButton';
import QuestionForm from '../components/question/QuestionForm';
import QuestionList from '../components/question/QuestionList';

function IndexPage({ dispatch, questions, formIsShow }) {
  //转变 form 状态
  function handleToggleForm() {
    dispatch({
      type: 'question/toggleForm'
    })
  }
  //按投票数排序
  function sortQuestion(questions) {
    questions.sort((a, b) => {
      return b.voteCount - a.voteCount;
    })
    return questions;
  }
  //添加问题
  function handleAddQuestion(newQuestion) {
    newQuestion.id = questions.length + 1;
    newQuestion.voteCount = 0;
    dispatch({
      type: 'question/addQuestion',
      payload: newQuestion
    })
  }
  return (
    <div className={styles.normal}>
      <div className={styles.header}>
        <h1 style={{fontSize: '34px'}}>React 问答</h1>
        <ShowAddButton onToggleForm={handleToggleForm} />
      </div>
      <div className={styles.container}>
        <QuestionForm 
            onAddQuestion={handleAddQuestion}
            formIsShow={formIsShow}
            onToggleForm={handleToggleForm}
        />
        <QuestionList 
            questions={questions} 
            sortQuestion={sortQuestion} 
        />
      </div>
    </div>
  );
}
function mapStateToProps({question}) {
  return {...question}
}
export default connect(mapStateToProps)(IndexPage);
```
注：
- `mapStateToProps` 函数将 Model `question` 的 `state` 转换为组件自身的 `props`  。 
- `...` 是对象扩展运算符，用于取出参数对象所有可遍历属性，拷贝到当前对象，详见：[对象的扩展运算符](http://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)。
- 按投票数问题排序的逻辑：在 `QuestionPage` 中写入 `sortQuestion` 排序方法，通过 props 传递给 `QuestionList` 组件，每次获取 `questions` 数组时，调用该方法，重新渲染页面。

切换到浏览器（自动刷新），因为我们之前将 `QuestionPage` 设置为 `path="/"` 默认显示内容，现在问答页面已更新为下图：
![](http://i.imgur.com/0PiOmh1.png)

## 7. 构建应用

我们已在开发环境下进行了验证，现在需要部署给用户使用。敲入以下命令：

	$ npm run build

该命令成功执行后，编译产物就在dist目录下。

查看 dist / index.html ，修改以下内容：

```html
- <link rel="stylesheet" href="/index.css" />
+ <link rel="stylesheet" href="index.css" />
  ...
- <script src="/index.js"></script>
+ <script src="index.js"></script>
```

以上。

