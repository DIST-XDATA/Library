# DIST运维平台

数慧运维平台的登录页面长这样：

![](http://i.imgur.com/H3eo9H2.png)

首页长这样：

![](http://i.imgur.com/beAowiP.png)


## 目录结构
```
├── /dist/           # 项目输出目录
├── /public/         # 公共文件
├── /src/            # 项目源码目录
│ ├── /assets/       # 图片文件
│ ├── /components/   # UI组件
│ ├── /framework/    # 布局组件
│ ├── /models/       # 数据模型
│ ├── /routes/       # 路由组件
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ ├── /utils/        # 工具函数
│ │ ├── config.js    # 项目常规配置
│ │ ├── constants.js # 常数配置
│ │ ├── request.js   # 异步请求函数
│ ├── index.css      # 主页样式
│ ├── index.js       # 入口文件
│ └── router.js      # 路由配置
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .roadhogrc.js    # roadhogrc配置
```

## 整体架构

> * 登录页 /login
> * 首页 /
>   * 组织机构管理 /orgs
>   * 角色管理 /roles
>   * 用户管理 /users
> * 关于 /about
> * 我的资源 /own

以上是该运维平台目前的整体结构，是基于react、dva和antd的应用，接下来我们开始一步步创建这个应用。

## 准备工作

- Node 环境
- VSCode

## 1. 安装 [dva-cli](https://github.com/dvajs/dva-cli) 并创建应用


> `dva-cli` 是dva的命令行工具，包含init、new、generate等功能，目前最重要的功能是可以快速生成项目以及你所需要的代码片段。

通过 npm 安装 `dva-cli` 并确保版本是 `0.7.0` 或以上。

	$ npm install -g dva-cli
	$ dva -v
	0.7.0
	
安装完 `dva-cli` 之后，就可以在命令行里访问到 `dva` 命令。现在，你可以通过 `dva new` 创建新应用。

	$ dva new dist-yw
	$ cd dist-yw

这会创建 `dist-yw` 目录，包含项目初始化目录和文件，并提供开发服务器、构建脚本、数据 mock 服务、代理服务器等功能，然后我们 `cd` 进入 `dist-yw` 目录。

## 2. 配置 [antd](https://github.com/ant-design/ant-design) 和 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

> `antd` 是 Ant Design 的 React 实现，提供高质量 React 组件。

通过 npm 安装 `antd` 和 `babel-plugin-import` 。`babel-plugin-import` 是用来按需加载 `antd` 的脚本和样式的，详见  [repo](https://github.com/ant-design/babel-plugin-import)。
	
	$ npm install antd
	$ npm intall babel-plugin-import

若想节约你的安装依赖时间，可以使用 `yarn`

	$ npm install yarn -g	
	$ yarn add antd
	$ yarn add babel-plugin-import

修改 `.roadhogrc`，使 `babel-plugin-import` 插件生效，在"extraBabelPlugins"里加上：

	["import", { "libraryName": "antd", "style": "css" }]

然后启动应用

	$ npm start

浏览器会自动开启，并打开[http://localhost:8000](http://localhost:8000 "http://localhost:8000")，你会看到dva的欢迎界面。

注：`dva-cli` 基于 `roadhog` 实现 build 和 server，更多 `.roadhogrc` 的配置详见 [roadhog#配置](https://github.com/sorrycc/roadhog#配置) 。

## 3. 配置代理

修改 `.roadhogrc` ，加上 `"proxy"` 设置：

	"proxy": {
        "/yw": {
        "target": "http://localhost:8080/dist-yw/yw/",
        "changeOrigin": true,
        "pathRewrite": { "^/yw" : "" }
        }
  	}

设置代理，以上表示设置后可以使用 `'/yw'` 代替 `'http://localhost:8080/dist-yw/yw/'` ，比如之后用到的 `'yw/login'`表示的就是 `'http://localhost:8080/dist-yw/yw/login'`。

## 4. 项目常规配置

在 `config.js` 中添加如下内容：

```javascript
export default {
  name: '运维平台',
  prefix: 'dist-yw',
  footerText: '上海数慧系统技术有限公司 ● 运维平台V1.0.1',
  logo: '/logo.png',
}
```
注：
1. `name` ：首页左上角显示的文字。
2. `footerText`： 页面底部 Footer 显示的文字。
3. `logo` : 该项目 logo 的路径。

 
## 5. 配置常数

在 `utils` 文件夹下添加 `constants.js` 文件，代码如下：

```javascript
export default {
    PAGESIZE:3, 
    RESULT:{
        SUCCESS:1,
        FAIL:-1
    },
    HttpStatus:{
        OK:200
    },
    DEFAULT:-1,
    getKey(){
        return new Date().getTime();
    }
}
```
由于以上数据会经常被使用，所以我们设置成常数，后面需要可以直接引用。

## 6. 安装其他依赖

1. `dva-loading` 插件： 自动处理 loading 状态；

		$ npm install dva-loading

修改 `index.js` 加载插件：

```javascript
+ import createLoading from 'dva-loading';
+ app.use(createLoading());
```

2. `echarts` ： 使用 echarts 绘制图表；
		
		$ npm install echarts

3. `promise-polyfill` 

		$ npm install promise-polyfill


## 7. 手脚架代码自动生成

比如生成 LoginPage 页面的 route / model / component ：
	
	$ dva g route LoginPage  #有js和css文件
	$ dva g model Login  #仅js文件
	$ dva g component login/LoginForm  #js和css文件
	$ dva g route LoginPage --no-css #无css文件

添加路由模块后，index.js会自动添加以下代码：

	app.model(require("./models/Login"));

router.js 自动添加路由：

	import LoginPage from './routes/LoginPage';
	<Route path="/LoginPage" component={LoginPage} />

若是人为新增 model 和 route 要在相应文件中手动添加上述代码。

## 下一步

基本环境配置好之后，我们要开始搭建我们的应用了。