# React dva 中的数据流

我们将使用 React+Dva+antd 完成一个留言板的功能，并了解 dva 架构中的数据流。

该留言板效果如下：
![](http://i.imgur.com/PpH06pR.png)

## dva架构中的数据流

由 Model 统一管理 state ，state 通过 mapStateToProps 函数转化为 props 传递给组件，组件通过 dispatch action ，让 model 更新 state , 用户界面随 state 改变而改变。 

## 1. 组件划分

> React.js 中一切都是组件，React 构建的功能其实就是由各种组件组合而成。所以拿到一个需求后，我们要做的第一件事就是理解需求、分析需求、划分需求由哪些组件构成。

对于上面留言板的功能，可以粗略地划分成以下几个部分：

- `MessageForm` ：左边部分是负责用户输入可操作的输入区域，包括用户名、留言内容和发布按钮，这一部分划分在 `MessageForm` 组件中。

- `MessageList` ：右边部分是评论列表，用 `MessageList` 组件负责列表的展示。

- `MessageItem` ：每条留言由独立的组件 `MessageItem` 负责显示，这个组件被 `MessageList` 所用。

## 2. 安装 [dva-cli](https://github.com/dvajs/dva-cli) 并创建应用

> `dva-cli` 是 dva 的命令行工具，包含 init、new、generate 等功能，目前最重要的功能是可以快速生成项目以及你所需要的代码片段。

通过 npm 安装 `dva-cli` 并确保版本是 `0.7.0` 或以上。

	$ npm install -g dva-cli
	$ dva -v
	0.7.0
	
安装完 `dva-cli` 之后，就可以在命令行里访问到 `dva` 命令。现在，你可以通过 `dva new` 创建新应用。

	$ dva new mes-board
	$ cd mes-board

这会创建 `mes-board` 目录，包含项目初始化目录和文件，并提供开发服务器、构建脚本、数据 mock 服务、代理服务器等功能，然后我们 `cd` 进入 `mes-board` 目录。

## 3. 配置 [antd](https://github.com/ant-design/ant-design) 和 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

> `antd` 是 Ant Design 的 React 实现，提供高质量 React 组件。

通过 npm 安装 `antd` 和 `babel-plugin-import` 。`babel-plugin-import` 是用来按需加载 `antd` 的脚本和样式的，详见  [repo](https://github.com/ant-design/babel-plugin-import)。

	$ npm install antd babel-plugin-import --save

或者使用 `yarn` ：

	$ yarn add antd
	$ yarn add babel-plugin-import

编辑 `.roadhogrc`，使 `babel-plugin-import` 插件生效。


	"extraBabelPlugins": [
	-   "transform-runtime"
	+   "transform-runtime",
	+   ["import", { "libraryName": "antd", "style": "css" }]
  	],


然后启动服务器：

	$ npm start

浏览器会自动开启，并打开[http://localhost:8000](http://localhost:8000 "http://localhost:8000")，你会看到dva的欢迎界面。

注：`dva-cli` 基于 `roadhog` 实现 build 和 server，更多 `.roadhogrc` 的配置详见 [roadhog#配置](https://github.com/sorrycc/roadhog#配置) 。

## 4. 定义 Model

> dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，处理异步逻辑的 effects，订阅数据源的 subscriptions 。

在这个需求中， state 为 以数组形式表示的留言列表， reducers 包括添加留言和删除留言事件。

新增 model `models/message.js`：

	$ dva g model message

在 `models/message.js` 中添加以下内容：

```javascript
export default {
  namespace: 'messages',
  state: [],
  reducers: {
    addMess(state, payload) {
    },
    deleteMess(state, payload) {
    },
  },
};
```
添加路由模块后，`index.js` 会自动添加以下代码：

```javascript
app.model(require("./models/count"));
``` 

注：
1. 若人为新增 model 请手动在 `index.js` 中添加上述内容。
2. `namespace` 表示在全局 state 上的 key。
3. `state` 是初始值，在这里是空数组。
4. `reducers` 等同于 redux 里的 reducer，接收 `action` ，同步更新 `state`。

## 5. 编写 UI Component

完成 Model 之后，我们来编写 Component 。推荐尽量通过 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html "stateless functions") 的方式组织 Component 。

脚手架自动生成代码：

	$ dva g component MessageForm --no-css
	$ dva g component MessageList --no-css
	$ dva g component MessageItem --no-css

MessageForm 组件：点击发布按钮，将 username / content / timeString(当前发布时间) 数据传给 payload 对象，触发 `addMess` action ，由 model 处理添加事件，将 payload 对象中的数据添至 messages 数组。

`components/MessageForm.js` ：

```javascript
import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Card } from 'antd';
const FormItem = Form.Item;

const MessageForm = ({dispatch,form}) => {
  const handleSubmit = (e) => {
    const timeString = new Date().toString().substring(4,24);
    e.preventDefault();
    form.validateFields((err, values) => {
      const username = values.username;
      const content = values.content;
      if (!err) {
        dispatch({
          type: 'messages/addMess',
          payload: {username, content, timeString}
        })
      }
    })
  }
  const { getFieldDecorator } = form;
  return (
    <Card title="Leave a Message" >
      <Form onSubmit={handleSubmit}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message:'Please input your username!'}],
          })(
            <Input prefix={<Icon type="user" style={{fontSize: 13}} />} placeholder="yout name" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('content',{
            rules:[{required: true, message:'Please input your message!'}],
          })(
            <Input type="textarea" rows="4" prefix={<Icon type="mail"/>} placeholder="your message..." />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit">发布</Button>
      </Form>
    </Card>
  );
}
export default connect()(Form.create()(MessageForm));
```

注：
1. 通过props传入两个值， `disatch` 和 `form` ， `dispatch` 用于触发 action，在 connect model 的时候绑定， `form` 表示 Form 组件 。
2.  `dispatch({type:'message/addMess'})` 表示触发了一个 `{type:'message/addMess'}` 的action 。
3. 解构赋值：从 Object 或 Array 里取部分数据存为变量。上述的函数参数 `{dispatch, form}` 表示从 this.props 对象中获取 dispatch / form 对应数据存为 dispatch / form 变量。详见 [dva-knowledgemap](https://github.com/dvajs/dva-knowledgemap#%E6%9E%90%E6%9E%84%E8%B5%8B%E5%80%BC) 。
4. 箭头函数，详见 [Arrow_functions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 。


----------

MessageList 组件：接收 messages 数组，将数组展开后的每一个对象传递给 MessageItem 组件。

`components/MessageList.js` ：

```javascript
import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({messages}) => {
  return (
    <div>
      <h2>Placeholder Message</h2>
      {
        messages.map((item, i) =>{
          return (
            <MessageItem  
              message={item}
              key={i}
              index={i} />
          )
        })
      }
    </div>
  )
}
export default MessageList;
```

注： 

1. 这里的 `messages` 由 props 属性传入。
2. 因为在这个组件中没有用到 model 中的数据，所以不用 connect 。


----------

MessageItem 组件：接收每一条 message ，进行渲染；点击删除按钮，将 message 的 index 传递给 payload ，并触发 `deleteMess ` action ，由 model 处理删除事件，将 index 对应的数据从 messages 数组中删除。

`components/MessageItem.js` ：

```javascript
import React from 'react';
import { connect } from 'dva';
import {Popconfirm, Button} from 'antd';

const MessageItem = ({dispatch, message, index }) => {
  const { username, content, timeString } = message;
    const deleteMess = (index) => {
      dispatch({
        type: 'messages/deleteMess',
        payload: index
      })
    }

  return (
    <div>
      <p>{username} 留言于（<span>{timeString}</span>）</p>
      <p>{content}</p>
      <Popconfirm title='Delete?' onConfirm={()=>deleteMess(index)}>
        <Button type='danger'>删除</Button>
      </Popconfirm>
    </div>
  )
}

export default connect()(MessageItem);
```
注： 

1. 通过 props 传入三个值 `disatch` 、 `message` 、 `index`， `dispatch` 用于触发 action ，在 connect 的时候绑定， `message` 和 `index` 由父组件 `MessageList` 作为 props 属性传入。 
2.  `dispatch({type:'message/deleteMess'})` 表示触发了一个 `{type:'message/deleteMess'}` 的action 。
3.  解构赋值：从 Object 或 Array 里取相应数据存为变量。`const { username, content, timeString } = message;` 表示从 message 对象中获取 username  /content / timeString 数据。详见 [dva-knowledgemap](https://github.com/dvajs/dva-knowledgemap#%E6%9E%90%E6%9E%84%E8%B5%8B%E5%80%BC) 。

## 6. 更新 state

> reducer 是唯一可以更新 state 的地方, reducer 是 pure function，他接收参数 state 和 action，返回新的 state，通过语句表达即 `(state, action) => newState`。详见[Reducers@redux.js.org](http://redux.js.org/docs/basics/Reducers.html "Reducers@redux.js.org") 。

`models/message.js` ：

```javascript
export default {
  namespace: 'messages',
  state: [],
  reducers: {
    addMess(state, { payload }) {
      return [...state, payload]
    },
    deleteMess(state, { payload: index }) {
      return [...state.slice(0, index), ...state.slice(index+1)]
    },
  },
};
```

注：
1. `[ ...state, payload] ` 里的 `...` 是对象扩展运算符，用于取出参数对象所有可遍历属性，拷贝到当前对象，详见：[对象的扩展运算符](http://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)
2. `addMess(state) {}` 等同于 `addMess: function(state) {}` 。
3. 解构传入的函数参数： `addMess(state, { payload }) ` 中的 `{payload}` 表示取 payload 对象中的全部数据存为 payload 变量。详见 [dva-knowledgemap](https://github.com/dvajs/dva-knowledgemap#%E6%9E%90%E6%9E%84%E8%B5%8B%E5%80%BC) 。

## 7. Route Components

> 在 dva 中我们通常以页面维度来设计 Route Components 。通常需要 connect model 的组件都是 Route Components 。

	$ dva g route MessagePage

`router.js` 自动添加路由：

```javascript
import MessagePage from './routes/MessagePage';
<Route path="/MessagePage" component={MessagePage} />
```

若是人为新增 route 请在 `router.js` 中手动添加上述代码。

**通过 connect 绑定数据**


```javascript
import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import styles from './MessagePage.css';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';

const { Header,Content, Footer } = Layout;

function MessagePage({messages}) {

  return (
    <div>
      <Header>留言板 - Build with React, Dva, antd</Header>
      <Content>
        <MessageForm {...messages}/>
        <MessageList messages={messages} /> 
      </Content>
      <Footer>Copyright @ YHJ 2017.08.08</Footer>
    </div>
  );
}
function mapStateToProps(state) {
  return {messages: state.messages};
}
export default connect(mapStateToProps)(MessagePage);
```

注：
1. 将 `{...messages}` 作为 prop 传给 `MessageForm` 组件，且 `MessageForm` 组件也 connect model ，这样该组件就有了 `dispatch` 属性。 
2. 将 `{messages}`作为 messages 属性传给 `MessageList` 组件，这样该组件就有了 messages 属性。  

## 8. 定义路由

> 这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑，通过浏览器提供的 History API 可以监听浏览器url的变化，从而控制路由相关操作。

dva 实例提供了 router 方法来控制路由，使用的是 [react-router](https://github.com/ReactTraining/react-router "react-router") 。

`router.js` ：

```javascript
import React from 'react';
import { Router, Route } from 'dva/router';
import MessagePage from "./routes/MessagePage.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={MessagePage} />
    </Router>
  );
}
export default RouterConfig;
```
将首页 `path="/"` 设置为我们的留言板页面，到这里，我们的留言板基本完成，最终效果如本文第一张图所示。

## 9. 构建应用

我们已在开发环境下进行了验证，现在需要部署给用户使用。敲入以下命令：

	$ npm run build

该命令成功执行后，编译产物就在dist目录下。

以上。