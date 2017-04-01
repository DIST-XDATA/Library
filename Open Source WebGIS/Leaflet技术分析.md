# Leaflet技术分析 
[Leaflet](http://leafletjs.com)是一个用于移动友好交互式地图的开源JavaScript库。  
最新版本：1.0.3（2017/1/23）  
轻量级，大约38kb的JS，具有大多数开发人员所需要的映射功能；设计简单、性能高可用，可以高效地在所有主要的桌面和移动平台上工作，在现代浏览器上会利用HTML5和CSS3的优势，同时也支持旧的浏览器访问；易扩展，且拥有大量的插件；易于使用、方便快捷开发，源码可读性高  。

## 特性  
- **多源数据支持**：
Tile layers, WMS、Markers, Popups、Vector layers、Image overlays、GeoJSON。
- **浏览器及移动设备的支持**：
Chrome、Firefox、 Safari 5+、Opera 12+、IE 7–11；
适用于iOS 7+的Safari、Android浏览器2.2+，3.1+，4+、Chrome移动版、Firefox移动版、IE10 + for Win8设备。
- **高效的性能**：
在移动设备上的硬件加速使它感觉像原生应用程序一样顺畅；
利用CSS3功能，使平移和缩放真的很流畅；
智能折线/多边形渲染与动态剪辑和简化使它非常快；
模块化构建系统，可以省掉不需要的功能；
在移动设备上点按延迟消除。
- **易于自定义和强大的扩展能力**：
纯CSS3制定控件样式，基于图像和Html的标记；
自定义图层和地图控件，自定义地图投影；
强大的OOP，易于扩展；
轻量级，没有外部依赖。

## 主要的API接口  
Leaflet源码托管在github上（https://github.com/Leaflet/Leaflet）  
- **地图控制器**  
地图的核心，包含了PanTo和缩放的动画；浏览器HTML5定位；地图的相关操作 控件图层，包含缩放、比例尺、属性等等。  
 Map、Usage example、Creation、Options、Events、Map Methods、Modifying map state、Getting map state、Layers and controls、Conversion methods、Map Misc、Properties、Panes  
- **多源数据加载类**  
图层包含，marker、切片图层、矢量图层。  
Raster Layers（TileLayer、TileLayer.WMS、ImageOverlay）  
Vector Layers（Path、Polyline、Polygon、Rectangle、Circle、CircleMarker、SVG、Canvas）  
UI Layers（Marker、Popup、Tooltip）  
Other Layers（LayerGroup、FeatureGroup、GeoJSON、GridLayer）  
- **可视化控制类**  
核心代码，包含了浏览器的UA判断，移动端的机型判断；js面向对象；事件监听和触发机制；以及工具类等等 关于地图的dom渲染和dom事件。  
Utility（Browser、Util、Transformation、LineUtil、PolyUtil、DomEvent、DomUtil、PosAnimation、Draggable）  
- **地图控件**  
（Zoom、Attribution、Layers、Scale）  
- **基本的几何要素图形**  
地理图形，包含边界、点、多边形等等。  
LatLng、LatLngBounds、Point、Bounds、Icon、DivIcon  
- **基础的类**  
事件控制，地图投影和坐标，比如国内适配的墨卡托（UTM）投影。  
Class、Evented、Layer、Interactive layer、Control、Handler、Projection、CRS、Renderer、Event objects、global switches、noConflict  

## 扩展插件  
Leaflet强大的开源库插件涉及到地图应用的各个方面包括地图服务，数据提供，数据格式，地理编码，路线和路线搜索，地图控件和交互等类型的插件数百种。  
- **官方的插件**  
官方提供插件：[Leaflet plugins](http://leafletjs.com/plugins.html)  
- **其他的插件**  
[angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive)：AngularJS指令嵌入与由Leaflet库管理的地图的交互  
[mapbox.js](https://github.com/mapbox/mapbox.js)：Mapbox JavaScript API  
[Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)：多彩的图标和视网膜标记  
[esri-leaflet](https://github.com/Esri/esri-leaflet)：用于在Leaflet中使用ArcGIS服务的一组轻量级工具  
[leaflet-hash](https://github.com/mlevans/leaflet-hash)：记录位置哈希表的变化值  
[leaflet-zoom-min](https://github.com/alanshaw/leaflet-zoom-min)：最小化zoomControl，并添加定位按钮  
[leaflet-sidebar](https://github.com/Turbo87/leaflet-sidebar)：侧边栏  
[leaflet-miniMap](https://github.com/Norkart/Leaflet-MiniMap)：小地图导航  
[leaflet-search](https://github.com/stefanocudini/leaflet-search)：搜索 marker 或者 feature 的内容  
[leaflet-spin](https://github.com/makinacorpus/Leaflet.Spin)：载入条  
[leaflet-editInOSM](https://github.com/yohanboniface/Leaflet.EditInOSM)：OSM编辑器（主要是他的id编辑功能非常好，但整个Demo非常复杂）  
[leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)：为Leaflet提供漂亮动态聚类功能  
[angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive)：用AngularJS directive完成更容易的交互地图  
[leaflet.draw](https://github.com/Leaflet/Leaflet.draw)： 矢量画图工具  
[Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)： 漂亮的高清图片markers基于Glyphicons / Font-Awesome icons   
[leaflet-providers](https://github.com/leaflet-extras/leaflet-providers)：底图免费提供设置  
[leaflet-dvf](https://github.com/humangeo/leaflet-dvf)：leaflet数据可视化  
[leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen)：全屏功能  
[leaflet-editable](https://github.com/Leaflet/Leaflet.Editable)：几何可编辑工具  
[leaflet-geocoder](https://github.com/mapzen/leaflet-geocoder)：查找地理编码通过Pelias Geocoder API  
[esri-leaflet-geocoder](https://github.com/Esri/esri-leaflet-geocoder)：用于使用带有Leaflet的ArcGIS地理编码服务进行地理编码  
[react-leaflet](https://github.com/PaulLeCam/react-leaflet)：用于构建用户界面  
[vue-leaflet](https://github.com/brandonxiang/vue-leaflet)：提供高效的数据绑定和灵活的组件系统  

## 库设计规范  
没有外部依赖，使用原生的javascript，严格遵循了[ES6](http://es6.ruanyifeng.com/)规范。  
