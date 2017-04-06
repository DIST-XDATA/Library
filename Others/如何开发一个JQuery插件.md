# 如何开发一个JQuery插件

用插件来拓展JQuery十分方便，将功能封装到插件中可以节省大部分的开发时间。

<h2 id = '1'>开始</h2>
要编写一个 jQuery 插件，需要为 jQuery.fn 对象增加一个新的函数属性，属性名就是插件的名字
```javascript
jQuery.fn.myPlugin = function() {

    // 插件的具体内容放在这里

};
```
为了确保你的插件不与其它使用 $ 的库发生冲突，有一个最佳实践： 把 jQuery 传递给 IIFE（立即调用函数），并通过它映射成 $ ，这样就避免了在执行的作用域里被其它库所覆盖。
```javascript
(function( $ ) {
    $.fn.myPlugin = function() {
    
        // 插件的具体内容放在这里
    
    };
})( jQuery );
```
<h2 id='2'>上下文</h2>
现在，已经有了外壳，可以开始编写真正的插件代码了。但在这之前，我们来介绍下上下文。在插件函数的立即作用域中，关键字 this 指向调用插件的 jQuery 对象。这是个经常出错的地方，因为有些情况下 jQuery 接受一个回调函数，此时 this 指向原生的 DOM 元素。这常常导致开发者在 jQuery 函数中对 this 关键字多作一次无必要的包装。
```javascript
(function( $ ){
    $.fn.myPlugin = function() {
    
        // 没有必要再作 $(this) ，因为"this"已经是 jQuery 对象了
        // $(this) 与 $($('#element')) 是相同的
           
        this.fadeIn('normal', function(){
            // 在这里 this 关键字指向 DOM 元素
        });		    		    
    };  		
})( jQuery );

   
$('#element').myPlugin();
```
<h2 id='3'>基础</h2>
现在理解了 jQuery 插件的上下文以后， 我们来写一个真正能做点儿事儿的插件。
```javascript
(function( $ ){

  $.fn.maxHeight = function() {
  
    var max = 0;

    this.each(function() {
      max = Math.max( max, $(this).height() );
    });

    return max;
  };
})( jQuery );

--
var tallest = $('div').maxHeight(); // 返回最高 div 的高度
```
这个简单的插件利用` .height()` 来返回页面中最高 div 的高度
<h2 id='4'>保持 chainability</h2>
前面的例子返回了页面上最高 div 的一个整数值，但很多时候插件只是以某种方式修改元素集合，并把它们传给调用链的下一个方法。 这正是 jQuery 设计的漂亮之处，也是它如此流行的原因之一。为保持插件的 chainability ，必须确保插件返回 this 关键字。
```javascript
(function( $ ){

  $.fn.lockDimensions = function( type ) {  

    return this.each(function() {

      var $this = $(this);

      if ( !type || type == 'width' ) {
        $this.width( $this.width() );
      }

      if ( !type || type == 'height' ) {
        $this.height( $this.height() );
      }

    });

  };
})( jQuery );

--
$('div').lockDimensions('width').css('color', 'red');
```
