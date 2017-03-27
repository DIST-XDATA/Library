# Configuring Dojo with dojoConfig

dojoConfig对象（以前版本中叫做djConfig）让你能够为dojo设置各种属性以及默认行为。本节教程我们将解释dojoConfig是如何起作用的以及怎么在你的代码中使用dojoConfig.

## 概览
dojoConfig(在dojo1.6版本之前叫做djConfig)是在网页或者应以程序中对dojo进行配置的一项机制。dojoConfig通过模块加载机制进行引用，并且以全局变量的形式成为dojo的一个组件。如果需要的话dojoConfig还可以用作自定义应用程序的配置点。
dojoConfig原来的名称djConfig已经被弃用，但是现在使用djConfig的代码在2.0版本之前仍旧可以运行，两种写法作用是相同的，但是最好使用dojoConfig这种写法。

dojoConfig是在dojo.js加载之前定义在一个脚本代码块中的，就是说dojoConfig的定义必须放在前面，若颠倒两者的顺序则dojoConfig中的所有设置都不会起作用。
要注意对dojoConfig和dojo/_base/config进行区分。dojoConfig是纯粹的用来进行参数输入——将配置参数传递给加载器和模块。而dojo/_base/config则是由事先dojoConfig设置的相关键值对组成用于后续的模块查询。

## Loader 配置

dojo在1.7及之后的版本里面使用了新的加载器以适应AMD机制。新的加载器添加一些比较重要的配置项比如说包的定义、maps还有其他的一些内容。比较重要的加载项包括：

 * `baseUrl` 即dojo.js文件目录，实际上可以不用指定，因为我们引入dojo.js时已经明确了路径，但是因为有些库可能需要这个，比如ArcGIS javascript API，指定baseUrl就不用专门修改太多配置。
 * `packages` 是一个数组用来指定包的名称以及路径
  ```
  packages: [{
name: "myapp",
location: "/js/myapp"
}]
  ```
 * `paths` 设置包路径与package共用
 
 ```
var dojoConfig = {
packages: [
"package1",
"package2"
],
paths: {
package1: "../lib/package1",
package2: "/js/package2"
}
};

//等同于
var dojoConfig = {
packages: [
        { name: "package1", location: "../lib/package1" },
{ name: "package2", location: "/js/package2" }
    ]
};
 ```
 * `deps` Dojo加载完成后需要引用的资源的路径的数组
 * `callback` deps中的资源引用完成后执行的函数
 * `cacheBust` 如果是true则会在每个模块后面添加时间戳来避免缓存
 * `map` 设置模块或文件的别名。
 ```
 map: {
// Instead of having to type "dojo/domReady!", we just want "ready!" instead
"*": {
        ready: "dojo/domReady"
}
}
 ```
 
