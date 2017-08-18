# 运维平台-首页布局

数慧运维平台首页长这样：

![](http://i.imgur.com/eZUpLeX.png)

由上图可以看到首页的布局方式是侧边-顶部-布局，侧边导航栏和顶部导航固定不动，内容区可以根据内容高度上下滚动，我们可以使用 antd 的侧边布局方式，将首页分解成 Header（顶部导航）、Sider（侧边栏）、MainLayout（主界面）组件，在 MainLayout 组件内的 Content（内容区）中嵌入组织机构、角色、用户等组件作为子组件，组成整个页面。

## 1. 文件结构

如上图，我们的首页由导航栏、侧边栏、内容主体构成，那么我们可以将主界面分解成 MenuBar（导航栏） / FeatureBar （侧边栏） / MainLayout（主界面） 组件，将它们另放在framework文件夹内。

`src` 目录结构：

```
├── assets
│ └── logo.png
├── components
│ └── base            # 基础组件
│ └── login           # 登录页面相关组件
│ └── organizaiton    # 组织机构页面相关组件    
│ └── role            # 角色页面相关组件
│ └── user            # 用户页面相关组件
├── framework
│ └── Header.js       # 顶部导航栏
│ └── MainLayout.css  # 首页样式
│ └── MainLayout.js   # 整体布局组件
│ └── Sider.js        # 侧边菜单栏
├── models
│ └── home.js
├── routes
│ └── HomePage.js
├── services
├── utils
│ └── config.js
│ └── constants.js
│ └── request.js
├── index.css
├── index.js
├── router.js
```

首页的布局结构：

> * Sider
>   * SiderComponent
> * Header
>   * HeaderComponent
> * Content
> * Footer

## 2. 划分组件

**Component 还是 Route Component ?**

Component （在 `/components/` 目录下） 通常是纯组件，是通过父组件传递的 props 来获取数据和更改数据的 ， Route Component （在 `/routes/` 目录下） 通常是需要 connect Model 的组件。

|  | Route Component | Component |
| ------| ------ | ------ |
| 位置 | 最顶层、路由处理 | 中间和子组件 |
| 读取数据 | 从 model 中获取 state | 从 props 获取数据 / 从 model 获取 state |
| 修改数据 | dispatch ation | 从 props 调用回调函数 / dispatch action |

对于上图的首页可以粗略地划分为以下几个 `Components` ：

- `Sider` ：左边部分是侧边菜单栏

- `Header` ： 上部分是顶部导航

将 `MainLayout` 作为 `Route Component` 。

## 3. 定义Model

> dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，处理异步逻辑的 effects，订阅数据源的 subscriptions 。
> 通俗的说，reducers 用来处理数据， effects 用来接收数据， subscriptions 用来监听数据。

这个页面涉及的 `state` 包括 user（已登录用户）/ siderFold（侧边栏是否折叠）/ darkTheme （侧边栏是否为 dark 主题）；

`reducers` 包括改变 siderFold / darkTheme 状态 ，登录之后保存用户信息；

异步任务 `effects` 包括退出登录事件。

新增 model `models/home.js` ：

```javascript
export default {
  namespace: 'home',
  state: {
    user: {},
    siderFold: false,
    darkTheme: false
  },
  reducers: {
    switchSider() {},
    switchTheme() {},
    addUser() {}
  },
  effects: {
    *logout() {}
  }
};
```

注：
1. 方法前面的 `*` 号，dva 是基于  [redux-saga](https://github.com/redux-saga/redux-saga)  的封装，用来表示这个方法是异步用法，相当于 `async/await` 中的 `async` 。
2. 别忘了在 `index.js` 文件内添加： `app.model(require("./models/home"));`


## 4. 构造 Component

完成 Model 之后，我们来编写 Component 。组织 Component 有三种方式：

1. 函数式定义的 `无状态组件`，即 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html) ：该组件不会被实例化、组件不能访问 `this` 对象、无生命周期、只能访问输入的 props，同样的 props 会得到同样的渲染结果，不会有副作用。**尽量使用无状态组件创建方式。**

2. es5原生方式 `React.createClass` 定义组件：创建有状态组件、可以实例化、可访问生命周期方法，但是会自绑定函数方法（React.Component只绑定需要关心的函数）。
3. es6形式的 `extends React.Component` 定义组件：**若需要state、生命周期方法，尽量使用这种方式创建组件。**

### 4.1 Header（导航栏）

Header 组件： Header 左部有个折叠图标，点击该图标，触发 switchSider 事件， switchSider 是父组件传入的 props 中的回调函数，dispatch `home/switchSider` action，由 model 更新 siderFold 状态，然后更新界面，使侧边栏折叠。

新增 `framework/Header.js` ：

```javascript
import React, {PropTypes} from 'react';
import { Menu, Icon } from 'antd';
import { Link, IndexLink } from 'dva/router';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './MainLayout.css';
const SubMenu = Menu.SubMenu;

function Header({ pathname, user, siderFold, switchSider, logout }) {
  return (
    <div className={styles.header}>
      <div className={styles.button} onClick= {switchSider}>
        //引入classnames，当 siderFold 为 true 时选择 'menu-unfold' 样式图标，否则选择'menu-fold'样式图标
        <Icon type={classnames({'menu-unfold':siderFold, 'menu-fold':!siderFold})} />
      </div>
      <div className={styles.userInfo}>
        <Menu mode="horizontal" >
          <SubMenu title={<span><Icon type="user" />{user.username || '未登录'}</span>}>
            <Menu.Item>
              <Link to="/own" activeClassName={styles.activeFeature}><span>我的资源</span></Link>
            </Menu.Item>
            <Menu.Item>
              <div onClick={logout}>退出登录</div>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
      <Menu mode="horizontal" className={styles.headerMenu}>
        <Menu.Item>
          <IndexLink to="/" activeClassName={styles.activeFeature}><Icon type="home" />首页</IndexLink>
        </Menu.Item>
        <Menu.Item>
          <a><Icon type="appstore"/>系统</a>
        </Menu.Item> 
        <SubMenu title={<span><Icon type="database"/>数据库</span>}>
          <Menu.Item>
             <a href={`http://localhost:8080/dist-yw/db`} target="_blank" style={{textAlign:'center'}}><Icon type="search"/>查看</a>
          </Menu.Item>
          <Menu.Item>
            <a href={`http://localhost:8080/dist-yw/druid/index.html`} target="_blank" style={{textAlign:'center'}}><Icon type="line-chart"/>监控</a>
          </Menu.Item>
        </SubMenu>
        <Menu.Item>
          <a href={`http://localhost:8080/dist-yw/swagger-ui.html`} target='_blank'><Icon type='book' />API文档</a>
        </Menu.Item>
        <Menu.Item>
          <Link to="/about" activeClassName={styles.activeFeature}><Icon type="info-circle" /><span>关于</span></Link>
        </Menu.Item>
      </Menu>
    </div>
  )
}
Header.propTypes = {
  pathname: PropTypes.string.isRequired,
  siderFold: PropTypes.bool.isRequired,
  switchSider: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}
export default Header;
```
### 4.2 Sider（侧边栏）

Sider 组件：


1. Sider 底部有个 switch 按钮，点击该图标，触发 changeTheme 事件，  changeTheme 是父组件传入的 props 中的回调函数，dispatch `home/switchTheme` action，由 model 更新 darkTheme 状态，然后更新界面，修改侧边栏的背景色。
2. 当 header 点击折叠图标时，更新 siderFold 状态，根据 siderFold 的状态，来决定是否显示 switch 图标。

新增 `framework/Sider.js` ：

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch, Menu, Tooltip } from 'antd';
import { Link } from 'dva/router';
import config from '../utils/config';
import styles from './MainLayout.css';
import logo from '../assets/logo.png';

function Sider({ pathname, darkTheme, siderFold, changeTheme }) {
  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={logo} style={{width: '48px', height: '48px', marginRight:'10px'}}/>
        { siderFold ? '' : <span style={{fontFamily:'微软雅黑', fontSize:'20px',fontWeight:'bold'}}>{config.name}</span>}
      </div>
      <Menu theme={darkTheme ? 'dark':'light'} mode="inline" style={{transition: 'all 0.3s ease-out'}}>
        <Menu.Item key="/orgs">
          <Tooltip placement="right" title="组织机构管理">
            <Link to="/orgs" activeClassName={styles.activeFeature}><Icon type="team" /><span>组织机构</span></Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="/roles">
          <Tooltip placement="right" title="角色管理">
            <Link to="/roles" activeClassName={styles.activeFeature}><Icon type="solution" /><span>角色</span></Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="/users">
          <Tooltip placement="right" title="用户管理">
              <Link to="/users" activeClassName={styles.activeFeature}><Icon type="user" /><span>用户</span></Link>
          </Tooltip>
        </Menu.Item>
      </Menu>
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Switch Theme &nbsp;</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Dark" unCheckedChildren="Light" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  pathname: PropTypes.string.isRequired,
  darkTheme: PropTypes.bool.isRequired,
  siderFold: PropTypes.bool.isRequired,
  changeTheme: PropTypes.func.isRequired
}
export default Sider;

```

注：
1. 以上两个组件都是使用 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html) 创建组件方式。
2. 解构赋值：`{pathname, darkTheme, siderFold, changeTheme}` 从 props 对象中获取部分数据存在变量中，详见 [变量的解构赋值](http://es6.ruanyifeng.com/#docs/destructuring)。

## 5. Route Component，绑定数据

MainLayout 组件： 虽然我们没有把它放在 `/routes/` 目录下，但它是一个 Route Component，用来和 model connect 起来，绑定数据。

`framework/MainLayout.js` ：

```javascript
import { connect } from 'dva';
import { Layout } from 'antd';
import config from '../utils/config';
import HeaderComponent from './Header';
import SiderComponent from './Sider';
import styles from './MainLayout.css';
import classnames from 'classnames';
const { Content, Sider, Header, Footer } = Layout;

function MainLayout({dispatch, home, location, children }) {
  const { pathname } = location;
  const { siderFold, darkTheme, user } = home;
  const siderProps = {
    siderFold,
    darkTheme,
    pathname,
    changeTheme () {
      dispatch({ type: 'home/switchTheme'})
    }
  }
  const headerProps = {
    user,
    siderFold,
    pathname,
    switchSider() {
      dispatch({ type:'home/switchSider'})
    },
    logout() {
      dispatch({ type: 'home/logout'})
    }
  }
  return (
    <Layout className={styles.baseLayout}>
      <Sider 
        trigger={null}
        collapsible
        collapsed={siderFold}
        //使用styles.sider的样式，当 darkTheme 为 false 时再同时使用styles.light 的样式
        className={classnames(styles.sider, { [styles.light]: !darkTheme })}
      >
        <SiderComponent {...siderProps} />
      </Sider>
      <Layout>
        <Header style={{backgroundColor:'#fff',padding:'0'}}>
          <HeaderComponent {...headerProps} />
        </Header> 
        <Content className={styles.mainContent} >
          {children || 'content'}
        </Content>
        <Footer className={styles.footer}>{config.footerText}</Footer>
      </Layout>
    </Layout> 
  )
}
function mapStateToProps({home}) {
	return {home};
}
export default connect(mapStateToProps)(MainLayout);
```
注：
1. 通过 props 传入 dispatch / home / location / children 给 MainLayout 组件，dispatch 在 connect 的时候绑定，用来触发 action ， home 是该 model 在全局 state 下的 key，location 是组件对应的地址，children 指该组件的子组件。
2. 对象字面量改进：如 `headerProps = {user, siderFold, pathname}`，解构赋值的反向操作，用于重新组织一个 Object 。
3. react 原生添加多个 className 会报错，那引入 `classnames` 库 （`$ npm install classnames`），可以直接在 classnames 内部进行条件判断。

## 6. 修改 model，更新 state

修改 `route/home.js` 文件：

```javascript
export default {
  ...
  reducers: {
    switchSider(state) {
      return {...state, siderFold: !state.siderFold}
    },
    switchTheme(state) {
      return {...state, darkTheme: !state.darkTheme}
    },
    addUser(state, { payload }) {}
  },
  effects: {
    *logout({ payload }, { put,call }) {
    }
  },
};
```
注：“退出登录逻辑” 和 “保存用户信息” 还未完成，这部分在创建登录页面时详细说明。

## 7. 定义路由

> dva 实例提供了 router 方法来控制路由，使用的是 [react-router](https://github.com/ReactTraining/react-router "react-router") 。

`router.js` ：

```javascript
import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import MainLayout from './framework/MainLayout';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={MainLayout}>
      </Route>
    </Router>
  );
}
export default RouterConfig;
```
将路径修改为 `path="/"`，浏览器（[http://localhost:8000/](http://localhost:8000/)）自动刷新，如果页面展示为以下效果，则首页创建成功啦。
![](http://i.imgur.com/nMZpytG.png)

注：

1. 页面右上角仍然显示 “未登录”，因为我们还有没有写登录逻辑，所以当前的 user 对象为空，登录页面我们放在布局后边写。
2. 除退出登录外，我们的 “折叠侧边栏” 、“修改侧边栏主题” 两个功能已完成。

## 8. 嵌入子组件

Content 内容框可以放置内嵌在 MainLayout 页面里的组件。children 表示子节点。

### 8.1 HomePage

设置首页默认展开的界面，我们使用 [Echarts](http://echarts.baidu.com/api.html#echarts) 完成制图的操作，我们把每一个图表用 antd 的 `Card` 包裹， 然后使用 [Grid](https://ant.design/components/grid-cn/) 栅格布局，保证页面的每个区域能稳健地排布起来。

首先安装 [echarts](http://echarts.baidu.com/api.html#echarts) 依赖：

	$ yarn add echarts

将每一个 Chart 单独封装成一个 Chart 基础组件，然后在 Route Component 中引用它，新增 `components/base/Chart.js` ：

```javascript
import React, {Component} from 'react';
import echarts from 'echarts';
 
export default class Chart extends Component {
  constructor(props){
    super(props); //继承父组件的 props
    this.state = { //设置 Chart 组件自己的 state
      height: this.props.height,
      options: this.props.options
    };
    this.chart = null;
  }
  //当组件构造成DOM元素且添加至页面之后，展示图表
  componentDidMount = () => {
    this.displayData();
    window.addEventListener('resize', this._chartResize);// 窗口大小改变时改变图表大小
  }
  //组件更新之后渲染图表
  componentDidUpdate = () => {
    this.displayData();
  }
  //图表组件即将从页面删除时，移除监听图表大小改变事件
  componentWillUnmount = () => {
    window.removeEventListener('resize', this._chartResize);
  }
  //获取真实的chart节点，在该节点内添加图表
  displayData() {
    this.chart = echarts.init(this.refs.chart);
    this.chart.setOption(this.state.options);
  }
  //改变图表大小
  _chartResize = () => {
    if (this.chart) {
      this.chart.resize();
    }
  }
  render() {
    return (
      <div ref="chart" style={{width:'100%', height:this.state.height}}></div>
    )
  }
}

```
注： `Chart` 组件需要使用生命周期方法，故使用 ES6 写法（`class ComponentName extends Component`）创建组件。

新增 `routes/HomePage.js` ：

```javascript
import React from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import Chart from '../components/base/Chart';

function HomePage() {
  let options1 = {};
  let options2 = {};
  let options3 = {
    tooltip: {},
    xAxis: {
      data: ["管理员","杨慧娟","YHJ1","YHJ2","YHJ3","YHJ4"]
    },
    yAxis: {},
    series: [{
      name: '登录次数',
      type: 'bar',
      data: [15, 20, 36, 10, 10, 20]
    }]
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="登录统计" extra={<a>详情</a>}>
            <Chart height="300px" options={options3}/>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="专题访问统计" extra={<a>详情</a>}>
            <Chart height="300px" options={options1}/>
          </Card>
        </Col>
      </Row>
      ...
    </div>
  );
}
export default HomePage;
```

### 8.2 OrganizationPage / RolePage / UserPage

`OrganizationPage` ： 

	$ dva g route OrganizationPage --no-css  
	$ dva g model organization   
	$ dva g component organization/OrganizationList --no-css
	$ dva g component organization/OrganizationModal --no-css

注： 
1. RolePage / UserPage 脚手架代码自动生成步骤如上。
2. 子组件在下一节详细展开。

`router.js` 修改为：
```javascript
<Router history={history}>
  <Route path="/" component={Mainlayout}>
    <IndexRoute component={HomePage} />
    <Route path="orgs" component={OrganizationPage} />
    <Route path="roles" component={RolePage} />
    <Route path="users" component={UserPage} />
  </Route>
</Router>
```
通过上面的配置，这个应用知道该如何渲染下面四个 `URL` ：

| URL | component |
| ------| ------ | 
| / | APP -> HomePage |
| /orgs | APP -> OrganizationPage |
| /roles | APP -> RolePage |
| /users | APP -> UserPage |


注：
1. `history` 监听浏览器地址栏的变化，并解析这个 `URL` 转化为 `location` 对象，然后 `router` 使用它匹配到路由，最后正确地渲染相应的组件。 
2. `IndexRoute` 表示默认路由，当用户访问 `'/'` 时，默认展示 `HomePage` 组件。


最后效果：

**首页 HomePage :**
![](http://i.imgur.com/jOF8fNp.png)

**用户管理界面:**

![](http://i.imgur.com/YCol2pz.png)

## 下一步

首页布局到此就基本完成了，下一步开始构建登录页面，与服务器交互实现登录。

以上。





