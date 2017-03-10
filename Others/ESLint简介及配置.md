<h1>ESLint简介及配置</h1>

<h2 id="1">1 简介</h2>

ESLint最初是由Nicholas C. Zakas 于2013年6月创建的开源项目。它的目标是提供一个插件化的javascript代码检测工具，ESLint是一个QA工具，用来避免低级错误和统一代码的风格。ESLint被设计为完全可配置的，主要有两种方式来配置ESLint  
- 在注释中配置：使用JavaScript注释直接把配置嵌入到文件中  
- 配置文件：使用一个JSON或YAML文件来为全部的目录和它的子目录指定配置信息  

在ESLint中，有很多信息是可以被配置的（下面会进行详细介绍）：  
- Environments：你的脚步将要运行在什么环境中  
- Globals：额外的全局变量  
- Rules：开启规则和发生错误时报告的等级  

在许多方面，它和 JSLint、JSHint 相似，除了少数的例外：  
- ESLint 使用 Espree 解析 JavaScript  
- ESLint 使用 AST 去分析代码中的模式  
- ESLint 是完全插件化的。每一个规则都是一个插件并且你可以在运行时添加更多的规则  

EsLint提供以下支持  
- ES6  
- AngularJS  
- JSX  
- Style检查  
- 自定义错误和提示  

EsLint提供以下几种校验  
- 语法错误校验  
- 不重要或丢失的标点符号，如分号  
- 没法运行到的代码块（使用过WebStorm的童鞋应该了解）  
- 未被使用的参数提醒  
- 漏掉的结束符，如}  
- 确保样式的统一规则，如sass或者less  
- 检查变量的命名  

ESLint主要有以下特点    
- 默认规则包含所有 JSLint、JSHint中存在的规则，易迁移    
- 规则可配置性高：可设置「警告」、「错误」两个error等级，或者直接禁用    
- 包含代码风格检测的规则（可以丢掉 JSCS 了）    
- 支持插件扩展、自定义规则    

<h2 id="2">2 ESLint安装</h2>

**ESLint是依托在NodeJS之上的，要安装ESLint需要先安装NodeJS**，有两种方式安装 ESLint：全局安装和本地安装    

<h3 id="2.1">本地安装</h3>

本地安装前，需要配置package.json文件，用于记录已经安装完成的插件信息，可使用npm进行配置  
```javascript
$ npm init
```    
配置成功后如下图所示    

![package.json]()    

如果你想让ESLint成为项目构建系统的一部分，建议在本地安装。可以使用npm  
```javascript
$ npm install eslint --save-dev
```    
紧接着需要设置一个配置文件    
```javascript
$ ./node_modules/.bin/eslint --init
```    
配置成功后如下图所示    

![.eslintrc.js]()    

之后，就可以在任何文件或目录运行ESLint    
```javascript
$ ./node_modules/.bin/eslint yourfile.js
```    
如下图所示  

![runESLint]()  

**注意**：使用本地安装的ESLint时，你使用的任何插件或可分享的配置也都必须在本地安装    
**注意**：.eslintrc 放在项目根目录，则会应用到整个项目；如果子目录中也包含 .eslintrc 文件，则子目录会忽略根目录的配置文件，应用该目录中的配置文件。这样可以方便地对不同环境的代码应用不同的规则    

<h3 id="2.2">全局安装</h3>

如果想让ESLint适用于所有的项目，建议全局安装ESLint。你可以使用npm  
```javascript
$ npm install -g eslint
```    
紧接着应该设置一个配置文件    
```javascript
$ eslint --init
```    
之后，可以在任何文件或目录运行ESLint    
```javascript
$ eslint yourfile.js
```    
**注意**：eslint --init适用于对某个项目进行设置和配置ESLint，并将执行本地安装的ESLint和及它所运行的目录下的插件。如果使用全局安装的ESLint，配置中使用的任何插件也必须是全局安装的    

<h2 id="3">3 ESLint使用</h2>

在项目目录下，运行：eslint –init将会产生一个.eslintrc.js的文件（或json、YAML格式，用户可以自己选择），文件内容包含一些校验规则    
```javascript
{
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
}
```    
其中"semi"和"quotes"是规则名称    
EsLint还提供了error的级别（semi和quotes后面的[]中所对应的第一个数值），对应数字，数字越高错误的提示越高    
- "off" or 0 --> 关闭规则    
- "warn" or 1 --> 将规则视为一个警告（不会影响退出码）    
- "error" or 2 --> 将规则视为一个错误(退出码为1)    

ESLint支持几种格式的配置文件，如果同一个目录有多个配置文件，ESLint只会使用一个，优先级顺序如下    
- JavaScript-使用.eslintrc.js然后输出一个配置对象    
- YAML-使用.eslintrc.yaml或.eslintrc.yml去定义配置的结构    
- JSON-使用.eslintrc.json去定义配置的结构，ESLint的JSON文件允许JavaScript风格的注释    
- Deprecated-使用.eslintrc，可以是JSON，也可以是YAML    
- package.json-在package.json里创建一个eslintConfig属性，在那里定义你的配置    

<h3 id="3.1">3.1 自定义配置ESLint</h3>

可以关掉所有EsLint默认的验证，自行添加所确切需要的验证规则。为此EsLint提供了2个种方式进行设置    
- Configuration Comments: 在所要验证的文件中，直接使用Javascript注释嵌套配置信息  
- Configuration Files: 使用JavaScript、JSON或YAML文件，比如前面提到的.eslintrc文件，当然你也可以在package.json文件里添加eslintConfig字段，EsLint都会自动读取验证    

<h4 id="3.1.1">parserOptions（指定解析器的选择）</h4>

EsLint通过parserOptions，允许指定校验的ecma的版本，及ecma的一些特性    
```javascript
{
    "parserOptions": {
        "ecmaVersion": 6,  // 指定ECMAScript支持的版本，6为ES6
        "sourceType": "module",  // 指定来源的类型，有两种"script"或"module"
        "ecmaFeatures": {
            "jsx": true  // 启动JSX
        },
    }
}
```    
ecmaVersion-可以设置为3、5（默认值）、6、7或8以指定要使用的ECMAScript语法的版本    
sourceType-可以设置为script或module，默认值为script，如果您的代码在ECMAScript模块中则将其设置为module    
ecmaFeatures-指示要使用哪些其他语言功能    
- globalReturn-允许在全局范围内使用return语句    
- impliedStrict-启用全局严格模式（如果ecmaVersion为5或更高的版本）    
- jsx-启用JSX    
- experimentalObjectRestSpread-启用对实验性对象的rest/spread属性支持（该功能目前仍处于实验阶段）    

**注意**：JSX就是Javascript和XML结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。当遇到<，JSX就当HTML解析，遇到{就当JavaScript解析    

<h4 id="3.1.2">parser（指定解析器）</h4>

默认情况下，ESLint使用Espree作为其解析器，可以选择指定在配置文件中使用不同的解析器，只要解析器满足以下要求    
- 它必须是本地安装的npm模块    
- 它必须有一个Esprima兼容的接口（必须导出一个parse()方法）    
- 必须产生Esprima兼容的AST和令牌对象    

EsLint默认使用esprima做脚本解析，当然也可以切换他，比如切换成babel-eslint解析    
```javascript
{
    "parser": "esprima"  // 默认，可以设置成babel-eslint，支持jsx
}
```    
以下解析器与ESLint兼容    
- Esprima    
- Babel-ESLint-一个围绕Babel解析器生成的包装器，使其与ESLint兼容    

当使用自定义解析器时，parserOptions仍然需要配置属性才能使ESLint和默认情况下不在ECMAScript5中的功能正常工作，解析器都通过parserOptions中的属性设置来确定需要启用哪些功能    

<h4 id="3.1.3">environments（指定环境）</h4>

environment可以预设好的其他环境的全局变量，如brower、node环境变量、es6环境变量、mocha环境变量等    
```javascript
{
    "env": {
        "browser": true,
        "node": true
    }
}
```    
可用的环境包含    
- browser-浏览器全局变量    
- node-Node.js全局变量和Node.js范围    
- commonjs-CommonJS全局变量和CommonJS范围（对于使用Browserify/WebPack的浏览器端代码使用过此参数）    
- shared-node-browser-节点和浏览器通用的全局变量    
- es6-启用除模块之外的所有ECMAScript6功能（使用此参数将自动把ecmaVersion分析器选项设置为6）    
- workder-web工作者全局变量    
- amd-根据amd规范定义require()和define()作为全局变量    
- mocha-添加所有的摩卡测试全局变量（Mocha：JavaScript测试框架）    
- jasmine-为版本1.3和2.0添加所有Jasmine测试全局变量    
- jest-Jest全局变量    
- phantomjs-PhantomJS全局变量    
- protractor-量角器全局变量    
- qunit-QUnit全局变量    
- jquery-JQuery全局变量    
- prototypejs-Prototype.js全局变量    
- shelljs-ShellJS全局变量    
- meteor-流星全局变量    
- mogo-MongoDB全局变量    
- applescript-AppleScript全局变量    
- nashorn-Java 8 Nashorn全局变量    
- serviceworker-服务工作者全局变量    
- atomtest-Atom测试帮助程序全局变量    
- embertest-Ember测试帮助程序全局变量    
- webextensions-WebExtensions全局变量    
- greasemonkey-GreaseMonkey全局变量    

以上的环境不是相互排斥的，因此可以一次定义多个环境，如果要使用插件的环境，要确保在plugins数组中指定插件名称，然后使用无前缀的插件名称，后跟斜杠，后跟环境名称    
```javascript
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
```    

<h4 id="3.1.4">globals（指定全局变量）</h4>

如果在文件中使用全局变量，则要指定相应的全局变量，这样ESLint就不会对其使用进行警告，在配置文件中配置全局变量，使用globals键，并指定要使用的全局变量，设置每个全局变量名称的属性    
- true-允许覆盖变量    
- false-禁止覆盖变量    
```javascript
{
    "globals": {
        "var1": true,
        "var2": false
    }
}
```    
以上例子允许var1在代码中覆盖，但不允许var2在代码中覆盖    

<h4 id="3.1.5">plugins（配置插件）</h4>

如果想使用插件中的环境变量，可以使用plugins指定    
```javascript
{
    "plugins": ["example"],
    "env": {
        "example/custom": true
    }
}
{
    "plugins": [
        "react"    
     ]
}
```    
ESLint支持使用第三方插件，在使用插件之前，必须使用npm对其进行安装    
**注意**：全局安装的ESLint实例只能使用全局安装的ESLint插件，本地安装的ESLint可以使用本地和全局安装的ESLint插件    

<h4 id="3.1.6">rules（配置规则）</h4>

自定义规则，一般格式："规则名称":error级别系数。系数0为不提示(off)、1为警告(warn)、2为错误抛出(error)，可指定范围，可以包括Strict模式、也可以是code的方式提醒，如符号等。还可以是第三方的校验，如react    
```javascript
{
    "plugins": [
        "react"
    ],
    "rules": {
         //Javascript code 默认校验
        "eqeqeq": "off",  // off = 0
        "curly": "error",  // error = 2
        "quotes": ["warn", "double"],  // warn = 1
         //使用第三方插件的校验规则
        "react/jsx-quotes": 0
    }
}
```    
要配置在插件中定义的规则，必须在规则ID前面添加插件名称和一个/    
```javascript
{
    "plugins": ["plugin1"],
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"],
        "plugin1/rule1": "error"
    }
}
```    

<h3 id="3.2">3.2 ESLint在IDEA中的使用</h3>

如果直接使用命令窗口运行ESLint对js文件进行代码规范的检查，结果输出在命令窗口内，不方便代码的检查及修改，也不方便在开发过程中实时对代码的规范性进行验证。现在很多编译器均支持使用ESLint，下面以IDEA为例    
打开IDEA的File-->Setting选项    

![Setting]()    

弹出Setting对话框，对ESLint进行配置    

![ESLint-setting]()    

成功后效果如下所示    

![ESLint-result]()    

<h2 id="4">4 ESLint规则配置示例</h2>

```javascript
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "amd": true,
        "es6": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "script",
        "ecmaFeatures": {
            "globalReturn": true,
            "impliedStrict": true,
            "jsx": true
        }
    },
    "rules": {

        /*
        *"off"或0-关闭规则
        *"warn"或1-开启规则，使用警告级别的错误:warn（不会导致程序退出）,
        *"error"或2-开启规则，使用错误级别的错误：error（当被触发时，程序会退出）
        */

        ////////////////////////////////////////////
        //可能出现的错误
        ////////////////////////////////////////////

        //禁止条件表达式中出现赋值操作符
        "no-cond-assign": 2,
        //禁止console
        "no-console": 0,
        //禁止在条件中使用常量表达式
        //例如：if(false)
        "no-constant-condition": 2,
        //禁止在正则表达式中使用控制字符
        //例如：new RegExp("\x1f")
        "no-control-regex": 2,
        //数组对象键值对最后一个逗号，never参数：不能带末尾的逗号，always参数：必须带末尾的逗号
        //always-multiline：多行模式必须带逗号，单行模式不能带逗号
        "comma-dangle": [1, "always-multiline"],
        //禁止debugger
        "no-debugger": 2,
        //禁止function定义中出现重名参数
        "no-dupe-args": 2,
        //禁止对象字面量中出现重复的key
        "no-dupe-keys": 2,
        //禁止重复的case标签
        "no-duplicate-case": 2,
        //禁止空语句块
        "no-empty": 2,
        //禁止在正则表达式中使用空字符集
        //例如：/^abc[]/
        "no-empty-character-class": 2,
        //禁止对catch子句的参数重新赋值
        "no-ex-assign": 2,
        //禁止不必要的布尔转换
        "no-extra-boolean-cast": 2,
        //禁止不必要的括号
        //例如：(a*b)+c
        "no-extra-parens": 0,
        //禁止不必要的分号
        "no-extra-semi": 2,
        //禁止对funciton声明重新赋值
        "no-func-assign": 2,
        //禁止在嵌套的块中出现function或var声明
        "no-inner-declarations": [2, "functions"],
        //禁止RegExp构造函数中无效的正则表达式字符串
        "no-invalid-regexp": 2,
        //禁止在字符串和注释之外不规则的空白
        "no-irregular-whitespace": 2,
        //禁止在in表达式中出现否定的左操作数
        "no-negated-in-lhs": 2,
        //禁止把全局对象（Math和JSON）作为函数调用
        //例如：var math = Math();
        "no-obj-calls": 2,
        //禁止直接使用Object.prototypes的内置属性
        "no-prototype-builtins": 0,
        //禁止正则表达式字面量中出现多个空格
        "no-regex-spaces": 2,
        //禁用稀疏数组
        "no-sparse-arrays": 2,
        //禁止出现令人困惑的多行表达式
        "no-unexpected-multiline": 2,
        //禁止在return、throw、continue和break语句之后出现不可达代码
        /*例如：
         function foo(){
         return true;
         console.log("done");  //错误
         }
         */
        "no-unreachable": 2,
        //要求使用isNaN()检查NaN
        "use-isnan": 2,
        //强制使用有效的JSDoc注释
        "valid-jsdoc": 1,
        //强制typeof表达式与有效的字符串进行比较
        //例如：typeof foo == "undefined"  //错误
        "valid-typeof": 2,

        ////////////////////////////////////////////
        //最佳实践
        ////////////////////////////////////////////

        //定义对象的set存取其属性时，强制定义get
        "accessor-pairs": 2,
        //强制数组方法的回调函数中有return语句
        "array-callback-return": 0,
        //强制把变量的使用限制在其定义的作用域范围内
        "block-scoped-var": 0,
        //限制圈复杂度，也就是类似if else能连续接多少个
        //以下参数是只复杂度为2-9，若超过9个分支将报错
        "complexity": [2, 9],
        //要求return语句要么总是指定返回的值，要么不指定
        "consistent-return": 0,
        //强制所有控制语句使用一致的括号风格
        "curly": [2, "all"],
        //switch语句强制default分支，也可以在js注释中添加// no default注释取消此次警告
        "default-case": 2,
        //强制object.key中，"."的位置
        //参数property表示："."号应与属性在同一行
        //参数object表示："."号应与对象名在同一行
        "dot-location": [2, "property"],
        //强制使用.号取属性
        //参数allowKeywords为true的时候使用保留字做属性名，只能使用"."方式去属性
        //参数allowKeywords为false的时候使用保留字做属性名时，只能使用[]方式取属性
        //参数allowPattern：当属性名匹配提供的正则表达式时，允许使用[]方式取值，否则只能用"."取值，例如：[2,{"allowPattern":"^[a-z]+(_[a-z]+)+$"}]
        "dot-notation": [2, {"allowKeywords": false}],
        //使用===替代==，参数allow-null允许null和undefined相等（==）
        "eqeqeq": [2, "allow-null"],
        //要求for-in循环中有一个if语句
        "guard-for-in": 2,
        //禁用alert、confirm和prompt
        "no-alert": 0,
        //禁用arguments.caller或arguments.callee
        "no-caller": 2,
        //不允许在case子句中使用词法声明
        "no-case-declarations": 2,
        //禁止除法操作符显式的出现在正则表达式开始的未知
        "no-dive-regex": 2,
        //禁止if语句中有return之后有else
        "no-else-return": 0,
        //禁止出现空函数，如果一个函数包含了一条注释，它将不会被认为有问题
        "no-empty-function": 2,
        //禁止使用空解构模式
        "no-empty-pattern": 2,
        //禁止在没有类型检查操作符的情况下与null进行比较
        "no-eq-null": 1,
        //禁止使用eval()
        "no-eval": 2,
        //禁止扩展原生类型
        "no-extend-native": 2,
        //禁止不必要的.bind()调用
        "no-extra-bind": 2,
        //禁止不必要的标签
        "no-extra-label": 0,
        //禁止case语句落空
        "no-fallthrough": 2,
        //禁止数字字面量中使用前导和末尾小数点
        "no-floating-decimal": 2,
        //禁止使用短符号进行类型转换
        "no-implicit-coercion": 0,
        //禁止在全局范围内使用var和命名的function声明
        "no-implicit-globals": 1,
        //禁止使用类似eval()的方法
        "no-implied-eval": 2,
        //禁止this关键字出现在类和类对象之外
        "no-invalid-this": 0,
        //禁用iterator属性
        "no-iterator": 2,
        //禁用标签语句
        "no-labels": 2,
        //禁用不必要的嵌套块
        "no-long-blocks": 2,
        //禁止在循环中出现function声明和表达式
        "no-loop-func": 1,
        //禁用幻数（魔术数字，例如3.14应用常量代替使用，不能直接使用）
        "no-magic-numbers": [1, {"ignore": [0, -1, 1]}],
        //禁止使用多个空格
        "no-multi-spaces": 2,
        //禁止使用多行字符串，在JavaScript中，可以在新行之前使用斜线创建多行字符串
        "no-multi-str": 2,
        //禁止对原生对象赋值
        "no-native-reassign": 2,
        //禁止在非赋值或条件语句中使用new操作符
        "no-new": 2,
        //禁止对Function对象使用new操作符
        "no-new-func": 0,
        //禁止对String、Number和Boolean使用new操作符
        "no-new-wrappers": 2,
        //禁用八进制字面量
        "no-octal": 2,
        //禁止在字符串中使用八进制转义序列
        "no-octal-escape": 2,
        //不允许对Function的参数进行重新赋值
        "no-param-reassign": 0,
        //禁用proto属性
        "no-proto": 2,
        //禁止使用var多次声明同一变量
        "no-redeclare": 2,
        //禁用指定的通过require加载的模块
        "no-return-assign": 0,
        //禁止使用javascript:url
        "no-script-url": 0,
        //禁止自我赋值
        "no-self-assign": 2,
        //禁止自身比较
        "no-self-compare": 2,
        //禁用逗号操作符
        "no-sequences": 2,
        //禁止抛出非异常字面量
        "no-throw-literal": 2,
        //禁用一成不变的循环条件
        "no-unmodified-loop-condition": 2,
        //禁止出现未使用过的表达式
        "no-unused-expressions": 0,
        //禁止未使用过的标签
        "no-unused-labels": 2,
        //禁止不必要的.call()和.apply()
        "no-useless-call": 2,
        //禁止不必要的字符串字面量或模版字面量的连接
        "no-useless-concat": 2,
        //禁用不必要的转义字符
        "no-useless-escape": 0,
        //禁用void操作符
        "no-void": 0,
        //禁止在注释中使用特定的警告术语
        "no-warning-comments": 0,
        //禁用width语句
        "no-width": 2,
        //强制在parseInt()使用基数参数
        "radix": 2,
        //要求所有的var声明出现在它们所在的作用域顶部
        "vars-on-top": 0,
        //要求IIFE使用括号括起来（IIFE，立即执行函数）
        "wrap-iife": [2, "any"],
        //要求或禁止"Yoda"条件
        "yoda": [2, "never"],
        //要求或禁止使用严格模式指令
        "strict": 0,

        ////////////////////////////////////////////
        //变量声明
        ////////////////////////////////////////////

        //要求或禁止var声明中的初始化（初值）
        "init-declarations": 0,
        //不允许cathc子句的参数与外层作用域中的变量同名
        "no-catch-shadow": 0,
        //禁止删除变量
        "no-delete-var": 2,
        //不允许标签与变量同名
        "no-label-var": 2,
        //禁用特定的全局变量
        "no-restricted-globals": 0,
        //禁止var声明与外层作用域的变量同名
        "no-shadow": 0,
        //禁止覆盖受限制的标识符
        "no-shadow-restricted-names": 2,
        //禁用未声明的变量，除非它们在/*global*/注释中被提到
        "no-undef": 2,
        //禁止将变量初始化为undefined
        "no-undef-init": 2,
        //禁止将undefined作为标识符
        "no-undefined": 0,
        //禁止出现未使用过的变量
        "no-unused-vars": [2, {"vars": "all", "args": "none"}],
        //不允许在变量定义之前使用它们
        "no-use-before-define": 0,

        ////////////////////////////////////////////
        //代码风格
        ////////////////////////////////////////////

        //指定数组的元素之间要以空格隔开（,后面）
        //参数never表示[之前以及]之后不能带空格
        //参数always表示[之前以及]之后必须带空格
        "array-bracket-spacing": [2, "never"],
        //禁止或强制在单行代码块中使用空格（禁用）
        "block-spacing": [1, "never"],
        //强制使用一致的缩紧，第二个参数为"tab"时，会使用tab
        //if while function后面的{必须和if while function在同一行
        "brace-style": [2, "1tbs", {"allowSingleLine": true}],
        //双驼峰命名格式
        "camelcase": 2,
        //控制逗号前后的空格
        "comma-spacing": [2, {"before": false, "after": true}],
        //控制逗号在行尾出现还是在行首出现（默认行尾）
        "comma-style": [2, "last"],
        //以方括号取对象属性时，[后面和]前面是否需要空格，可选参数never，always
        "computed-property-spacing": [2, "never"],
        //用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，这个rule便失去了意义
        //例如：[0,"that"]指定只能var that = this; that不能指向其他任何值，this也不能赋值给that以外的其他值
        "consistent-this": [1, "that"],
        //强制使用命名的function表达式
        "func-names": 0,
        //文件末尾强制换行
        "eol-last": 2,
        //"SwitchCase"（默认：0）强制switch语句中的case子句的缩进水平
        "indent": [2, 4, {"SwitchCase": 1}],
        //强制在对象字面量的属性中键和值之间使用一致的间距
        "key-spacing": [2, {"beforeColon": false, "afterColon": true}],
        //强制使用一致的换行风格
        "linebreak-style": [1, "unix"],
        //要求在注释周围有空行（要求在块级注释之间有一空行）
        "lines-around-comment": [1, {"beforeBlockComment": true}],
        //强制一致地使用函数声明或函数表达式，方法定义风格
        //参数declaration：强制使用方法声明的方式，function f(){} [2,"declaration"]
        //参数expression：强制使用方法表达式的方式，var f = function(){} [2,"expression"]
        //参数allowArrowFunctions：declaration风格中允许箭头函数，[2,"declaration",{"allowArrowFunctions":true}]
        "func-style": 0,
        //强制回调函数最大嵌套深度5层
        "max-nested-callbacks": [1, 5],
        //禁止使用指定的标识符
        "id-blacklist": 0,
        //强制标识符的最新和最大长度
        "id-length": 0,
        //要求标识符匹配一个指定的正则表达式
        "id-match": 0,
        //强制在JSX属性中一致地使用双引号或单引号
        "jsx-quotes": 0,
        //强制在关键字前后使用一致的空格（前后都需要）
        "keyword-spacing": 2,
        //强制一行的最大长度
        "max-len": [1, 120],
        //强制最大行数
        "max-lines": 0,
        //强制function定义中最多允许的参数数量（最多允许6个参数）
        "max-params": [1, 6],
        //强制function块中最多允许的语句数量
        "max-statements": [1, 200],
        //强制每一行中所允许的最大语句数量
        "max-statements-per-line": 0,
        //要求构造函数首字母大写（要求调用new操作符时有首字母大写的函数，允许调用首字母大写的函数时不使用new操作符）
        "new-cap": [2, {"newIsCap": true, "capIsNew": false}],
        //要求调用无参数的构造函数时有圆括号
        "new-parens": 2,
        //要求或禁止var声明语句后有一行空行
        "newline-after-var": 0,
        //禁止使用Array构造函数
        "no-array-constructor": 2,
        //禁用按位运算符
        "no-bitwise": 0,
        //要求return语句之前有一行空行
        "newline-before-return": 0,
        //要求方法链中每个调用都有一个换行符
        "newline-per-chained-call": 1,
        //禁用continue语句
        "no-continue": 0,
        //禁止在代码行后使用内联注释
        "no-inline-comments": 0,
        //禁止if作为唯一的语句出现在else语句中
        "no-lonely-if": 0,
        //禁止混合使用不同的操作符
        "no-mixed-operators": 0,
        //不允许空格和tab混合缩进
        "no-mixed-spaces-and-tabs": 2,
        //不允许多个空行
        "no-multiple-empty-lines": [2, {"max": 2}],
        //不允许否定的表达式
        "no-negated-condition": 0,
        //不允许使用嵌套的三元表达式
        "no-nested-ternary": 0,
        //禁止使用Object的构造函数
        "no-new-object": 2,
        //禁止使用一元操作符++和--
        "no-plusplus": 0,
        //禁止使用特定的语法
        "no-restricted-syntax": 0,
        //禁止function标识符和括号之间出现空格
        "no-spaced-func": 2,
        //不允许使用三元操作符
        "no-ternary": 0,
        //禁止行尾空格
        "no-trailing-spaces": 2,
        //禁止标识符中有悬空下划线_bar
        "no-underscore-dangle": 0,
        //禁止可以在有更简单的可替代的表达式时使用三元操作符
        "no-unneeded-ternary": 2,
        //禁止属性前有空白
        "no-whitespace-before-property": 0,
        //强制花括号内换行符的一致性
        "object-curly-newline": 0,
        //强制在花括号中使用一致的空格
        "object-curly-spacing": 0,
        //强制将对象的属性放在不同的行上
        "object-property-newline": 0,
        //强制函数中的变量要么一起声明要么分开声明
        "one-var": [2, {"initialized": "never"}],
        //要求或禁止在var声明周围换行
        "one-var-declaration-per-line": 0,
        //要求或禁止在可能的情况下要求使用简化的赋值操作符
        "operator-assignment": 0,
        //强制操作符使用一致的换行符
        "operator-linebreak": [2, "after", {"overrides": {"?": "before", ":": "before"}}],
        //要求或禁止块内填充
        "padded-blocks": 0,
        //要求对象字面量属性名称用引号括起来
        "quote-props": 0,
        //强制使用一致的反勾号、双引号或单引号
        "quotes": [2, "single", "avoid-escape"],
        //要求使用JSDoc注释
        "require-jsdoc": 1,
        //要求或禁止使用分号（语句强制分号结尾）
        "semi": [2, "always"],
        //强制分号之前和之后使用一致的空格
        "semi-spacing": 0,
        //要求同一声明块中的变量按顺序排列
        "sort-vars": 0,
        //强制在块之间使用一致的空格
        "space-before-blocks": [2, "always"],
        //强制在function的左括号之前使用一致的空格
        "space-before-function-paren": [2, "always"],
        //强制在圆括号内使用一致的空格
        "space-in-parens": [2, "never"],
        //要求操作符周围有空格
        "space-infix-ops": 2,
        //强制在一元操作符前后使用一致的空格
        "space-unary-ops": [2, {"words": true, "nonwords": false}],
        //强制在注释中//或/*使用一致的空格
        "spaced-comment": [2, "always", {"markers": ["global", "globals", "eslint", "eslint-disable", "*package", "!"]}],
        //要求或禁止Unicode BOM
        "unicode-bom": 0,
        //要求正则表达式被括号括起来
        "wrap-regex": 0
    }
```    

*敬请各位批评指正*
