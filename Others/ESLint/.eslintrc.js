module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "amd": true,
        "es6": true,
        "mocha": true,
        "jquery": true
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
        "no-div-regex": 2,
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
        "no-lone-blocks": 2,
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
        //禁用with语句
        "no-with": 2,
        //强制在parseInt()使用基数参数
        "radix": 2,
        //要求所有的var声明出现在它们所在的作用域顶部
        "vars-on-top": 0,
        //要求IIFE使用括号括起来（IIFE，立即执行函数）
        "wrap-iife": [2, "any"],
        //要求或禁止"Yoda"条件
        "yoda": [2, "never"],
        //要求或禁止使用严格模式指令
        "strict": 2,

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
        "consistent-this": [1, "widget"],
        //强制使用命名的function表达式
        "func-names": 0,
        //文件末尾强制换行
        "eol-last": 2,
        //"SwitchCase"（默认：0）强制switch语句中的case子句的缩进水平
        "indent": [2, 4, {"SwitchCase": 1}],
        //强制在对象字面量的属性中键和值之间使用一致的间距
        "key-spacing": [2, {"beforeColon": false, "afterColon": true}],
        //强制使用一致的换行风格
        "linebreak-style": [1, "windows"],
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
        //强制function定义中最多允许的参数数量（最多允许2个参数）
        "max-params": [1, 2],
        //强制function块中最多允许的语句数量
        "max-statements": [1, 100],
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
};