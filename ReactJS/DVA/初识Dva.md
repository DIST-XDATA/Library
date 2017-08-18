# 初识Dva
> dva 是基于现有应用架构 (redux + react-router + redux-saga 等)的一层轻量封装，概念来自elm，支持side effects、热替换、动态加载、react-native、SSR等。

## 1. React基础知识

> React 的核心目的是创建 UI 组件，也就是它是 MVC 架构中的 V 层，React是仅仅关注 Component 的库，与你的技术架构无关。

### JSX语法

JSX语法规则：遇到 HTML 标签（以 `<` 开头），就用 HTML 规则解析；遇到代码块（以 `{` 开头），就用 JavaScript 规则解析。

```javascript

render(){
  const names = ['YangHJ', 'Reiko', 'Kris'];
  return (
    <div>
      { names.map(function (name) {
          return <div>Hello, {name}!</div>
        })
      }
    </div>
  )
};
```


### 组件

React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。组件类只能包含一个顶层标签。

**组件的生命周期**

组件的生命周期可以落入以下三个环节：

- 初始化，Initialzation
- state/props 更新，State/Propety Updates
- 销毁，Desctruction

![](https://camo.githubusercontent.com/08601e21214b60c108aae3eb76aec217a0c57459/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f45556365494f735747506c5167455066696759632e706e67)

在这三个类别下分别对应着一些 React 的抽象方法，这些方法都是在组件特定生命周期中的钩子，这些钩子会在组件整个生命周期中执行一次或者多次。

比如：
- `componentWillMount` : 在组件 render 之前执行且永远只执行一次。

- `componentDidMount` : 组件加载完毕之后立即执行，并且此时才在 DOM 树中生成了对应的节点，因此我们通过 this.getDOMNode() 来获取到对应的节点。

详细请看 [React文档](https://facebook.github.io/react/docs/react-component.html) 。


**Component的三种创建方式：**

1. React 写法

```javascript
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'

var SayHi = React.createClass({
  getInitialState(){//设置初始状态
    return {};
  },
  getDefaultProps(){ //设置组件属性的默认值
    return { from: 'YangHJ' };
  }
  propTypes:{//PropTypes属性，用来验证组件事例的属性是否符合要求
    title: PropTypes.string.isRequired,
  },
  render(){
    return(
      <p>{from} says: hello {this.props.name}! </p>
    );
  }
})
//将模板转为HTML语言，并插入指定的DOM节点
ReactDOM.render(
  <SayHi name='world'/>,
  document.getElementById('demo')
)
```

2. ES6写法

```javascript
import React, { Component, PropTypes } from 'react';
import { Popover, Icon } from 'antd';

class PreviewQRCodeBar extends Component { // 组件的声明方式
  constructor(props) { // 初始化的工作放入到构造函数
    super(props); // 在 es6 中如果有父类，必须有 super 的调用用以初始化父类信息
    this.state = { // 初始 state 设置方式
      visible: false,
    };
  }
  // 因为是类，所以属性与方法之间不必添加逗号
  hide() {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange(visible) {
    this.setState({ visible });
  }

  render() {
    const { dataurl } = this.props;
    return (
      <Popover
        placement="rightTop"
        content={<img src={dataurl} alt="二维码" />}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange.bind(this)} // 通过 .bind(this) 来绑定
      >
        <Icon type="qrcode" />
      </Popover>
    );
  }
}
// 在react写法中，直接通过 propTypes {key:value} 来约定
PreviewQRCodeBar.proptypes = {
  dataurl: PropTypes.string.isRequired,
};
// 在ES6类声明中无法设置 props 只能在类的外面使用 defaultProps属性来完成默认值的设定
// 而在react中则通过 getDefaultProps(){} 方法来设定
PreviewQRCodeBar.defaults = {
  // obj
}
export default PreviewQRCodeBar;
```


3. Stateless function写法

```javascript
import React, { PropTypes } from 'react';

// 组件无 state，pure function
const HelloMessage = ({ name }) =>{ // 箭头函数，解构赋值
  <h1>Hello, {name}! </h1>
}
	
HelloMessage.proptype = {
  name: PropTypes.string.isRequired,
};

export default HelloMessage;
// 此类组件不支持 ref 属性，不能访问 this 对象，没有组件生命周期的相关方法，仅支持 propTypes
// 此类组件用以简单呈现数据
```
注：
1. 尽可能使用无状态组件 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html)  创建方式；
2. 若需要state、生命周期方法，尽量使用 es6 写法创建组件。


想了解更多请戳：
- [dva-knowledgemap](https://github.com/dvajs/dva-knowledgemap "dva-knowledgemap")
- [es6](http://es6.ruanyifeng.com/ "es6")

### 获取真实DOM节点

组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM ，只有当它插入文档以后，才会变成真实的 DOM。若要从组件获取真实的DOM节点，使用 `this.refs.[refName]` 。

```javascript
class MyComponent extends Component {
  handleClick () {
    this.refs.myTextInput.focus();
  },
  render () {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick.bind(this)} />
      </div>
    );
  }
};

```
### Flux架构

[Flux](https://github.com/voronianski/flux-comparison) 是一种架构思想，和 MVC 一样，用以解决软件结构的问题，Flux 中最为显著的特点就是它的单向数据流，核心目的是为了在多组件交互时能避免数据的污染。

![](https://camo.githubusercontent.com/b25eb7670d266187a45bf35d8b6e0ca4bf5e8e0b/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f62657347587a7863646a486a566a6266616f68582e706e67)

在 flux 模式中 Store 层是所有数据的权利中心，任何数据的变更都需要发生在 store 中，Store 层发生的数据变更随后都会通过事件的方式广播给订阅该事件的 View，随后 View 会根据接受到的新的数据状态来更新自己。任何想要变更 Store 层数据都需要调用 Action，而这些 Action 则由 Dispatcher 集中调度，在使用 Actions 时需要确保每个 action 对应一个数据更新，并同一时刻只触发一个 action。

### dva中的数据流

![](https://camo.githubusercontent.com/c826ff066ed438e2689154e81ff5961ab0b9befe/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f505072657245414b62496f445a59722e706e67)

在 web 应用中，数据的改变通常发生在用户交互行为或者浏览器行为（如路由跳转等），当此类行为改变数据的时候可以通过 `dispatch` 发起一个 `action`，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为会先触发 `Effects` 然后流向 `Reducers `最终改变 `State` 。


## 2. dva的基础概念

> 简而言之 dva 是基于现有应用架构 (redux + react-router + redux-saga 等)的一层轻量封装

我们将基于 dva 完成一个简单的小应用，并熟悉它的主要概念。

该应用最终效果：

<div align="center">

 ![](http://i.imgur.com/JhXaDSb.gif)

</div>


我们要完成的是一个测试鼠标点击速度的 App，记录1秒内用户最多能点击几次。顶部的 Higheset Record 记录最高点击次数，中间部分是当前点击次数，下方是点击按钮。

注：参考 [dva入门](https://github.com/sorrycc/blog/issues/8) ，这篇文章是将所有代码都写入 index.js ，我稍微改了一点，将记录框抽离成一个纯组件，component / model / route 存入相应的目录下，实现该应用。


### 开始之前：
* 确保安装了node
* 用 [cnpm](https://github.com/cnpm/cnpm) 或 [yarn](https://github.com/yarnpkg/yarn) 能节约安装依赖的时间

### 2.1 安装 [dva-cli](https://github.com/dvajs/dva-cli) 并创建应用

`dva-cli` 是 dva 的命令行工具，包含 init、new、generate 等功能，目前最重要的功能是可以快速生成项目以及你所需要的代码片段。

	//Install dva-cli
	$ npm install -g dva-cli
	
	//Create app and start
	$ dva new myapp
	$ cd myapp
	$ npm start
	

浏览器会自动开启，并打开 [http://localhost:8000](http://localhost:8000 "http://localhost:8000")，若看到 Dva 欢迎界面表示你创建成功啦。

如果出现 "Failed to compile" 界面，请先安装 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 再 `npm start`。

	$ npm intall babel-plugin-import

若想节约你的安装依赖时间，可以使用 `yarn`

	$ npm install yarn -g	
	$ yarn add babel-plugin-import

注：
1. 如需关闭 server ，请按 Ctrl+C ；
2. 可通过 `dva -v` 查看 dva 版本，`dva-h` 查看帮助信息。

最后得到的 myapp 项目 `src` 目录结构如下：
```
.
├── assets
│   └── yay.jpg
├── components
│   └── Example.js
├── models
│   └── example.js
├── routes
│   ├── IndexPage.css
│   └── IndexPage.js
├── services
│   └── example.js
├── utils
│   └── request.js
├── index.css
├── index.js
├── router.js
```



- `assets` ： 我们可以把项目 `assets` 资源放在这边。

- `components` ：纯组件，在 dva 应用中 components 目录中应该是一些 logicless 的 component, logic 部分均由对应的 route-component 来承载。我们可以通过 ` $ dva g component componentName` 的方式来创建一个 component。
 
- `models` ：该目录结构用以存放 model，在通常情况下，一个 model 对应着一个 route-component，而 route-component 则对应着多个 component，我们可以通过 ` $ dva g model modelName` 的方式来创建一个 model。该 model 会在 `index.js` 中自动注册。


- `routes` ： route-component 存在的地方，可以通过 `$ dva g route route-name` 的方式去创建一个 `route-component`，该路由配置会被自动更新到 `route.js` 中。`route-component` 是一个重逻辑区，一般业务逻辑全部都在此处理，通过 connect 方法，实现 model 与 component 的联动。


- `services` ： 全局服务，如发送异步请求


- `utils`: 全局类公共函数


- `index.css` ： 首页样式


- `index.js` ：dva 应用启动 `五部曲` ，这点稍后再展开


- `router.js` ： 页面相关的路由配置，相应的 route-component 的引入


### 2.2 dva - Model


在这个需求中，我们定义 model 如下：

 `models/count.js` ：

```javascript
app.model({
    namespace: 'count',
    state: {
        record: 0,
        current: 0,
    },
});
```
**state**

model 中的 state 表示这个应用最初的状态数据，namespace 是 model state 在全局 state 所用的 key ，state 里的 record 表示highest record，current 表示当前点击次数。


### 2.3 dva - component

完成 Model 之后，我们来编写 Component 。在这个需求中我们只需要一个 Count 组件，推荐尽量通过 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html "stateless functions") 的方式组织 Component 。

`components/Count.js` ：

```javascript
import PropTypes from 'prop-types';
import styles from './Count.css';
const Count = ({count, onAdd}) => {
    return (
        <div className={styles.normal}>
            <div className={styles.record}>Highest Record: {count.record}</div>
            <div className={styles.current}>{count.current}</div>
            <div className={styles.button}>
                <button onClick={onAdd}>+</button>
            </div>
        </div>
    );
};
Count.propTypes = {
  count: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired
}
export default Count;
```

**Action**

Action 是一个 javascript 对象，它是改变 State 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。

**dispatch 函数**

用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dispatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

注：
1. 这里先 `import styles from './Count.css';` ，再通过 `styles.xxx` 的方式声明 css className 是基于 css-modules 的方式。
2. 通过 props 传入两个值， `count` 和 `onAdd` ， `count` 对应 model 上的 state ，`onAdd` 是传入的回调函数。
3. `dispatch({type:'count/add'})` 表示触发了一个 `{type:'count/add'}` 的action 。



### 2.4 dva - Reducer


> reducer 是唯一可以更新 state 的地方, reducer 是 pure function，他接收参数 state 和 action，返回新的 state，通过语句表达即 `(state, action) => newState`。详见[Reducers@redux.js.org](http://redux.js.org/docs/basics/Reducers.html "Reducers@redux.js.org") 。

这个需求里，我们需要定义两个 reducer， `count/add` 和 `count/minus` ，分别用于计数的增和减。值得注意的是 `count/add` 时 record 的逻辑，他只在有更高的记录时才会被记录。

```javascript
app.model({
    namespace: 'count',
    ...
  + reducers: {
  +   add(state) {
  +     const newCurrent = state.current + 1;
  +     return { ...state,
  +       record: newCurrent > state.record ? newCurrent : state.record,
  +       current: newCurrent,
  +     };
  +   },
  +   minus(state) {
  +     return { ...state, current: state.current - 1};
  +   },
  + },
});
```

注：
1. `{ ...state }` 里的 `...` 是对象扩展运算符，类似`Object.extend`，详见：[对象的扩展运算符](http://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)
2. `add(state) {}` 等同于 `add: function(state) {}` 。

### 2.5 dva - Effect

> `Effect` 被称为副作用，在我们的应用中，最常见的就是异步操作，`Effects` 的最终流向是通过 `Reducers` 改变 `State`。

在此之前，我们所有的操作处理都是同步的，用户点击 + 按钮，数值加 1。现在我们要开始处理异步任务，dva 通过对 model 增加 effects 属性来处理 side effect(异步任务)，这是基于 [redux-saga](https://github.com/redux-saga/redux-saga) 实现的，语法为 generator。

在这个需求里，当用户点 + 按钮，数值加 1 之后，会额外触发一个 side effect，即延迟 1 秒之后数值 -1 。

```javascript
app.model({
  namespace: 'count',
+ effects: {
+   *add(action, { call, put }) {
+     yield call(delay, 1000); //用于调用异步逻辑，支持promise
+     yield put({ type: 'minus' }); //用于触发action
+   },
+ },
...
+ function delay(timeout){
+   return new Promise(resolve => {
+     setTimeout(resolve, timeout);
+   });
+ }
```
注：
1. `*add() {}` 等同于  `add: function*(){}` 。
2. put 所触发的 action 调用的 reducer 或 effects 来源于本 model 那么在 type 中不需要声明命名空间，如果需要触发其他非本 model 的方法，则需要在 type 中声明命名空间，如 `yield put({ type: 'namespace/fuc', payload: xxx });` 。
2. `call` 和 `put` 都是 redux-saga 的 effects，call 表示调用异步函数，put 表示 dispatch action，其他的还有 select, take, fork, cancel 等，详见 [redux-saga](https://github.com/redux-saga/redux-saga) 。
3. 默认的 effect 触发规则是每次都触发(`takeEvery`)，还可以选择 `takeLatest`，或者完全自定义 `take` 规则。
4. `select`写法： `const count = yield select(state => state.count);` 这边的 state 来源于全局的 state，select 方法提供获取全局 state 的能力，即在这边如果你需要其他 model 的数据，则可以通过 state.modelName 来获取。
     

### 2.6 dva - Subscription

> Subscriptions 是一种从 **源** 获取数据的方法，它来自于 elm。
Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

订阅键盘事件，首先安装 `keymaster` 依赖。
	
	$ npm install react-keymaster

然后在 model 里添加订阅事件。

```javascript
+import key from 'keymaster';
...
 app.model({
   namespace: 'count',
  ...
+  subscriptions: {
+    keyboardWatcher({ dispatch }) {
+      key('⌘+up, ctrl+up', () => { dispatch({type:'count/add'}) });
+    },
+  },
});
```

### 2.7 dva - Route Components

>还记得之前的 Component 里用到的 count 和 dispatch 吗? 会不会有疑问他们来自哪里?

在 dva 中我们通常以页面维度来设计 Container Components。

所以在 dva 中，通常需要 `connect` Model的组件都是 Route Components，组织在 `/routes/` 目录下，而 `/components/` 目录下通常是纯组件（Presentational Components）。

**通过 connect 绑定数据**

`routes/HomePage.js`

```javascript
import { connect } from 'dva';
import Count from '../components/Count';

const App = ({count,dispatch}) => {
  const handleAdd = () => {
    dispatch({
      type: 'count/add'
    })
  }
  return (
    <div>
      <h1>MY APP</h1>
      <Count count={count} onAdd={handleAdd}/>
    </div>
  )
}

function mapStateToProps(state) {
  return { count: state.count };
}
export default connect(mapStateToProps)(App);
```
这样在 Count 组件里就有了 `count` 和 `onAdd` 两个属性。

注：这里的 `connect` 来自 [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options "react-redux") 。

### 2.8 dva - Router

> 这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑，通过浏览器提供的 History API 可以监听浏览器url的变化，从而控制路由相关操作。

dva 实例提供了 router 方法来控制路由，使用的是 [react-router](https://github.com/ReactTraining/react-router "react-router") 。


`router.js` ：

```javascript
import { Router, Route } from 'dva/router';
import HomePage from '../routes/HomePage';
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);
```

### 2.9 添加样式

默认是通过 css modules 的方式来定义样式，这和普通的样式写法并没有太大区别，由于之前已经在 Component 里 hook 了 className，这里只需要在 `components/Count.css` 里写入：

```css
.normal {
  width: 200px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 20px #ccc;
}
.record {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  color: #ccc;
}
.current {
  text-align: center;
  font-size: 40px;
  padding: 40px 0;
}
.button {
  text-align: center;
  button {
    width: 100px;
    height: 40px;
    background: #aaa;
    color: #fff;
  }
}
```

若样式无效，请查看.roadhogrc文件，修改 `disableCSSModules` 。

	"disableCSSModules": false,

### 2.10 dva五部曲

`index.js` ：

```javascript
import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins插件 - 该项为选择项
//app.use({});

// 3. Model 的注册
app.model(require('./models/count'));

// 4. 配置 Router
app.router(require('./router'));

// 5. Start
app.start('#root');
```


到这里，我们的小应用基本完成，最终效果为上一张图所示。


### 2.11. 构建应用

我们已在开发环境下进行了验证，现在需要部署给用户使用。敲入以下命令：

	$ npm run build

该命令成功执行后，编译产物就在dist目录下。
![](http://i.imgur.com/r4B4VOT.png)

## 3. 脚手架代码自动生成

	
	$ dva g route HomePage   #有js和css文件
	$ dva g route HomePage --no-css  #无css文件
	$ dva g model count   #仅js文件
	$ dva g component Count   #js和css文件
	

添加路由模块后，`index.js` 会自动添加以下代码：

```javascript
app.model(require("./models/count"));
```

`router.js` 自动添加路由：

```javascript
import HomePage from './routes/HomePage';
<Route path="/home" component={HomePage} />
```

若是人为新增 model 和 route 要在相应文件中手动添加上述代码。

以上。