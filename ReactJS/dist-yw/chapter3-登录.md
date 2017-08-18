# 运维平台-登录页面

数慧运维平台的登录页面长这样：
![](http://i.imgur.com/29vh2Gr.png)

登录页面主要由头部、中部登录框、底部组成，我们可以把登录框单独封装成一个组件。

## 1. 定义 Model

1. 这个页面涉及的 `state` 包括 `loginname`（登录名）/  `password` （密码） / `status` （登录状态），用于保存登录信息。

2. `reducer` 接受 `state` 和 `action` , 返回新的 `state` ，该页面只需更新 `status` 登录状态。

3. 用 `effect` 来接收用户输入的用户名和密码，处理异步事件：
    - 验证用户登录信息，登录成功进入首页，即 `*validate`；
    - 当用户已登录，用户再访问该应用时告诉服务器用户已登录并进入首页，即 `*sso` 。

4. 用 `subscription` 来监听路由变化，当浏览器地址栏为 `'/login'` 且用户退出登录后触发 `sso` ，重定向跳转路由。

`models/login.js` ：

```javascript
import { hashHistory } from 'dva/router';
import { login, sso } from '../services/login';

let ssoChecked = false;  //判断是否登录
let ssoRedirect = "/";   //登录后重定向的地址

export default {
  namespace: 'login',
  state: {
    loginname: 'chenyp',
    password: 'pass',
    status: '登录',
  },
  reducers: {
    showLoginLoading (state) {},
    hideLoginLoading (state) {}
  },
  effects: {
    *validate({payload}, {put, call}) {}, 
    *sso({payload}, {put, call}) {}
  }
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(({pathname, query}) => {
        ssoRedirect = query.redirect || '/';
        if(pathname === "/login" && ssoChecked === false){
          dispatch({ type:"sso",payload:{
            redirect: ssoRedirect
          }});
        }
      })
    }
  },
};
```
### History

`React Router` 是建立在 `history` 之上的。 简而言之，一个 `history` 知道如何去监听浏览器地址栏的变化， 并解析这个 `URL` 转化为 `location` 对象， 然后 `router` 使用它匹配到路由，最后正确地渲染对应的组件。

常用的 `history` 有三种形式， 但是你也可以使用 React Router 实现自定义的 `history`。


**1.  browserHistory**

`browserHistory` 是使用 React Router 的应用推荐的 history。它使用浏览器中的 [History](https://developer.mozilla.org/en-US/docs/Web/API/History) API 用于处理 URL，创建一个像`example.com/some/path` 这样真实的 URL 。

**2.  hashHistory**
`hashHistory` 使用 URL 中的 hash（`#`）部分去创建形如 ：`example.com/#/some/path` 的路由。Hash history 不需要服务器任何配置就可以运行，可以在开发时使用，但不推荐在实际线上环境中使用它。

**3.  createMemoryHistory**

`createMemoryHistory` 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。和另外两种history的一点不同是你必须创建它，这种方式便于测试。

	const history = createMemoryHistory(location)


## 2. 配置 service

我们需要用服务器来验证用户输入的登录信息是否正确。

新增 `service/login` ：

```javascript
import { request, get, post } from '../utils/request';

export function login(loginUser) {
    return post(`yw/login`, loginUser);
}
export function sso() {
    return get(`yw/sso`);
}
export function logout() {
    return get(`yw/logout`);
}
```

修改 `utils/request.js` ：
```javascript
+  import Promise from 'promise-polyfill';
+  if (!window.Promise) {
+     window.Promise = Promise;
+  }
   ...
-  export default function request(url, options) {
-  return fetch(url, options)
-    .then(checkStatus)
-    .then(parseJSON)
-    .then(data => ({ data }))
-    .catch(err => ({ err }));
-  }
+  export async function request(url, options) {
+  const response = await fetch(url, options);
+  checkStatus(response);
+  const data = await response.json();
+  const ret = {
+    data,
+    headers: {},
+  };
+  if (response.headers.get('x-total-count')) {
+    ret.headers['total-count'] = Number.parseInt+(response.headers.get('x-total-count'));
+  }
+  return ret;
+  export async function get(url) {
+    const response = await fetch(url, {
+      credentials: "include"
+    });
+    return response.json();
+  }
+  export async function put(url, data) {
+    return await dataOpe(url, data, "PUT");
+  }
+  export async function post(url, data) {
+    return await dataOpe(url, data, "POST");
+  }
+  async function dataOpe(url, data, method) {
+    const response = await fetch(url, {
+      method: method,
+      headers: {
+        "Content-Type": "application/json"
+      },
+      credentials: "include",
+      body: JSON.stringify(data)
+    });
+    return await response.json();
+  }
```

## 3. 编写 Component

登录框单独封装成一个组件，引用 antd 中的 `Card` 和 `Form` ，并给登录框一个提交事件，触发 `dispatch` 中的 `validate` 事件。

Component 通常写成纯组件，根据传入的 props 渲染相应的效果，我们用 [stateless functions](https://facebook.github.io/react/docs/components-and-props.html) 方式创建组件。

新增 `components/login/LoginForm,js` ：
```javascript
import styles from './LoginForm.css';
import { Form, Icon, Input, Button, Card } from 'antd';
const FormItem = Form.Item;

const LoginForm = ({ validate, form, loginname, password, loading, status }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        validate(values);
      }
    });
  }
  const { getFieldDecorator } = form;
  return (
    <Card title="用户登录" extra={<a href="#">忘记密码？</a>} className={styles.loginForm}>
      <Form onSubmit={handleSubmit} >
        <FormItem hasFeedback>
          {
            getFieldDecorator('loginname', {
              rules: [{ required: true, message: '请输入用户名!' }],
              initialValue:loginname
            })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" onPressEnter={handleSubmit} />
            )
          }
        </FormItem>
        <FormItem hasFeedback>
          {
            getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
              initialValue:password
            })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" onPressEnter={handleSubmit}/>
            )
          }
        </FormItem>
        <Button type="primary" htmlType="submit" loading={loading} className={styles.loginFormButton} onClick={handleSubmit}>{status}</Button>
      </Form>
    </Card> 
  );
}
export default Form.create()(LoginForm)
```
注：


1. 通过 `props` 传入 validate / loginname / password / status 等属性，这些属性由父组件传入。
2. 用户输入的信息保存在 form 的 `values` 中，点击提交按钮或者按下 `Enter` 键盘事件，将 `values` 数据传递给 `payload` ，并触发 `validate` ，这里写成了 validate 属性，该属性是个回调函数 。


## 4. Route Component ，绑定数据

Route Component （在 `/routes/` 目录下） 通常是需要 connect Model 的组件，将 model 中的 state 转化为 props 传给自身或子组件。

新增 `routes/LoginPage.js` ：
```javascript
import { connect } from 'dva';
import { Layout } from 'antd';
import config from '../utils/config';
const { Header, Footer, Content } = Layout;
import LoginForm from '../components/login/LoginForm';
import styles from '../framework/MainLayout.css';

function LoginPage({dispatch, loading, login}){
  const loginProps = {
    ...login,
    loading,
    validate(values) {
      dispatch({
        type: 'login/validate',
        payload: values,
      })
    }
  }
  return (
    <Layout>
      <Header>
        <div className={styles.loginLogo} />
      </Header>
      <Content style={{ backgroundColor: 'white'}}>
        <LoginForm {...loginProps} />
      </Content>
      <Footer className={styles.footer}>{config.footerText}</Footer>
    </Layout>
  )
}
function mapStateToProps(state){
    return {
      loading: state.loading.models.login,
      login: state.login
    };
}
export default connect(mapStateToProps)(LoginPage);
```
注： 
1. connect 数据，将 `state` 转化为 `props` 传递给 `LoginPage` 组件 ， `LoginPage` 再将特定的 props 传给子组件 `LoginForm` ，这样 `LoginForm` 就有了之前的属性。	

2. 这里的 `loading` 是安装了 `dva-loading` 插件后的使用方法，记得在 `index.js` 里：
```javascript
+ import createLoading from 'dva-loading'; 
+ app.use(createLoading());
```
3.  `...` 是对象扩展运算符，用于取出参数对象所有可遍历属性，拷贝到当前对象，详见：[对象的扩展运算符](http://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6) 。

## 5. 修改 Model， 更新 state

- `*validate` 调用异步函数 login ，若验证成功则将用户数据返回，然后触发 `home/addUser` action，页面跳转到重定向的地址。
- `*sso` 接收退出登录前一步的地址， 调用异步函数 sso，然后登录且路由跳转到退出登录前的页面。

`models/login.js` ：

```javascript
+ import { message } from 'antd';
+ import constants from '../utils/constants';

export default {
  ...
  reducers: {
    showLoginLoading (state) {
      return { ...state, status:'正在登录'}
    },
    hideLoginLoading (state) {
      return { ...state, status:'登录'}
    }
  },
  effects: {
    *validate({payload}, { put, call }) {
      yield put({type:'showLoginLoading'});
      const result = yield call(login, payload);
      yield put({type: 'hideLoginLoading',});
      //触发Model `home` 的 `addUser` action，保存用户信息，多个 model 之间通信也是通过dispatch action
      yield put({ 
        type: 'home/addUser',
        payload: result.data
      })
      if (result.status === constants.HttpStatus.OK) {
        message.success('登录成功', 1, ()=> { hashHistory.push(ssoRedirect)})
      } else {
        message.error(`登录失败：${result.mesages}`);
      }
    },
    *sso({ payload }, { put, call }) {
      ssoChecked = true;
      const result = yield call(sso);
      if (result.status === constants.HttpStatus.OK) {
        yield put({
          type: 'home/addUser',
          payload: {user: result.data}
        });
        hashHistory.push(payload.redirect);
      } else {
        hashHistory.push("/login?redirect=" + payload.redirect);
      }
    }
  },
  ...
};

```

## 6. 更新路由表

`router.js`：
```javascript
+ import LoginPage from "./routes/LoginPage";
  function RouterConfig({ history }) {
  return (
    <Router history={history}>
+     <Route path="/login" component={LoginPage} />
      ...
    </Router>
  );
}
```
至此我们的登录页面搭建完毕，开启 Tomcat，使 [http://localhost:8080/dist-yw](http://localhost:8080/dist-yw) 的后台服务器开启，然后打开到 [http://localhost:8000/#/login](http://localhost:8000/#/login) 进入登录页面，输入信息查看是否完成页面跳转。

注：虽然我们完成了页面跳转，但在首页右上角仍显示“未登录”，退出登录也未完成，接下来我们回到首页的搭建，将“添加用户”和“退出登录”事件完成。

## 7. 首页

1. 首页获取用户登录信息，并显示用户名在右上角;
2. 完成异步逻辑 logout 。

修改 `models/home.js` ：
```javascript
import { hashHistory } from 'dva/router';
import { logout } from '../services/login';
reducers: {
  ...
  addUser(state, { payload }) {
    return {...state, user: payload }
  }
},
effects: {
  *logout({ payload }, { put,call }) {
    yield call(logout);
    hashHistory.push('/login');
  },
},
```
3. 传给 `Header` 组件 sso 函数，若用户不存在则触发 sso ，重新登录。

修改 `framework/MainLayout.js`：

```javascript
 const headerProps = {
   ...
+  sso() {
+    dispatch({ type: 'login/sso', payload: { redirect: pathname } })
+  }
 }
```

修改 `framework/Header.js`：
```javascript
function Header({ pathname, user, siderFold, switchSider, logout, sso }) {
  if (user.id === undefined) {
    sso();
  }
  ...
}
```
以上，首页修改完成，切换到浏览器（自动更新），进入[http://localhost:8000/#/](http://localhost:8000/#/)，当用户未登录时跳转到登录页面，登录成功后跳到首页，且右上角已有用户信息，查看退出登录是否有效。

首页效果如下：

![](http://i.imgur.com/AgLsQoV.png)

## 下一步

登录页面和首页的逻辑到此就基本完成了，下一步开始构造子组件了。

以上。
