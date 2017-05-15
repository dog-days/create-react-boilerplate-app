# R2手脚架

[R2框架](https://github.com/dog-days/r2)(Redux React Framework)主要是基于React、Redux而构建的，其中还是用了`react-router`、`react-router-redux`、`react-redux`、`immutable.js`。同时使用webpack模块加载工具，采用ES62015语法。所有如果要使用本框架，这些知识多多少少都要会点的。同时也使用了[Ant Design React](http://ant.design/#/docs/react/introduce)组件,生成的页面使用的UI是Ant Design,目前只支持这种，后面页面生成也会支持多种UI组件。 R2框架旨在快速搭建页面，减少重复工作，减少重复代码，提高开发效率。

特别说明：下面的环境是在mac下搭建的，在windows上会有差异。

## 安装使用

### 安装node

由于还没有正式的版本，可以clone或者下载本框架文件,然后运行下面命令。
通过nvm安装node（nvm可以管理多个版本node,可以来回切换,请使用v6.0.0以上）

```sh
//安装nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
//安装最新版node,并可以立刻使用node不用重启终端,安装时好像被墙了，通过vpn装成功
nvm install node && nvm alias default node
```

npm安装如果被墙可以使用[淘宝镜像](http://npm.taobao.org/)，单不建议使用cnpm，使用cnpm有时候会安装不完全，直接在~/.npmrc中直接配置：

```sh
registry=https://registry.npm.taobao.org
```

### 安装R2手脚架

```sh
npm install r2-cli -g #安装全局r2命令工具
mkdir xxxx && cd xxxx
r2 init #r2初始化，按提示进行处理
npm install #等待依赖包安装
npm start
```

然后直接在浏览中打开`http://localhost:8888/`,即可访问。

## 初始化后的目录

```shell
R2/
    + public/                      		#初始化是没有的（打包后生成），直接拷贝到服务环境下即可访问
    - src/                         		#框架和应用代码目录
        index.jsx                  		#框架应用入口文件
        + libs/                    		#框架公共接口方法等，如fetch封装等(非公共组件)
        - common                   		#当前项目公共component和设置等
        	+ locale			       #国际化
        	+ components                #公共组件
        	common.js				   #公共变量和一些设置
        	function.js				   #公共处理方法
        	global.js				   #全局变量设置 
        	Fetch.js			       #基于antd的fetch拓展，可以自行修改
        - page/                    		#页面级代码
            App.js                 		#路由第一层"/"component
            action.js        	   	    #可自定义的公共actionCreator
            reducer.js             		#可自定义的公共reducer
            + nopage               		#404页面
            - view                 		#各个页面存放位置
                + layout           		#layout文件存放处
            		- main/
            			_route.js 	   		#路由设置处
            			.child_routes.js 	#自动生成，后面详解
                - index/           		#应用页面demo,参考使用
                	_route.js 	   	    #路由设置处
                    index.js       		#index页面入口文件
                    action.js      		#Redux action，demo action任务定义处，当然也可以没有
                    reducer.js     		#Redux reducer，demo reducer定义处，当然也可以没有
    - style/                       		#样式图片存放处,这个看喜好吧,约定方式
        + css/                     		#css样式
        + img/                     		#图片存放处
    Gruntfile.js                   		#grunt配置文件，根据需要自己拓展配置h打包生成环境
    server.js                      		#启动服务配置文件,开发环境
    webpack.config.js              		#webpack配置，根据需要自己拓展配置，开发环境 
    package.js                     		#npm配置文件
    .babelrc                       		#babel设置
    .gitignore                     		#git提交忽略设置
```

### R2命令

r2中自定义了如下命令

```sh
#运行服务
npm start 
```

```sh
#打包生成生产环境文件
npm run build 
```

```sh
#智能Route和Reducer生成命令，相当于r2 ac，情况后续说明
npm run ac
```

r2-cli命令请参考[r2-cli项目]()。

## 智能构建

经过上面的步骤可以运行看到页面了，现在开始看如何搭建一个新的页面，在搭建页面前先介绍R2框架自带的一些功能。

### 智能构建route和reducer

何为智能route和reducer,在R2框架中，只要遵循view文件位置约定规则，route和reducer就可以通过命令生成！你没听错，是用r2是不用怎么关注路由和reducer绑定的！
运行一下命令即可

```sh
npm run ac  #ac全称auto creator
```

不过要注意的是，view文件要按照约定位置放好，`R2/src/page/view`目录下新建文件夹就属于一个新页面(必须包含文件_route.js，layout是特殊的view，有点不一样),而reducer生成条件是在view目录下新建reducer.js就会被视为新建reducer，强烈建议在当前页面文件夹中新建reducer.js。

`_route.js`请看下面的基本使用。

`reducer.js`需要遵守一定格式！ `reducer.js`格式如下:

```jsx
export function origin(state = {}, action) {
    switch (action.type) {
        case RECIEVEORIGIN:     
        default:
            return state;
    }
}
```

不要使用下面这样的格式,虽然是没错，但目前r2还不支持智能识别这种格式。

```jsx
module.exports = {
    origin(state,action){}
}
```

## 基本使用

### layout模式

layout是特殊的一种view，其实就是react-router中的第二层组件（第一个是"/"，本框架是`src/page/App.jsx`），view是其子组件。以一种layout为例：

layout包括以下必要文件

- `_route.js`，用作路由生成，可自行修改，单务必按照以下格式。

```jsx
'use strict';
var view = function(){
	//这里try在浏览器中是多此一举，在智能路由中，node环境就需要,跳过r2Common未定义异常
	var re; 
	try{
		re = `${r2Common.prefixUrl}`;
	}catch(e){}
	return re;
}
var childRoutes = function(){
    //这里try在浏览器中是多此一举，在智能路由中，node环境就需要,跳过r2Common未定义异常
	var re;
	try{
		re = require('./.child_routes.js');
	}catch(e){}	
	return re;
}
var indexRoute = function(){
    //这里try在浏览器中是多此一举，在智能路由中，node环境就需要,跳过r2Common未定义异常
	var re;
	try{
		re = require("src/page/view/index/_route.js");//indexRoute指定位置
	}catch(e){}	
	return re;
}
module.exports = {
	path: view(), 
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require("./index"))
        },"main")
    },
   	indexRoute: indexRoute(),
    childRoutes: childRoutes(),
}
```
其中`r2Common.prefixUrl`是公共path部分（详细看下面公共path部分），可自行定义默认为空。如果定义后为`/r2`访问`/`会跳转到`/r2`路由。有点需要注意的是：**indexRoute**需要自己手动指定位置。

- `index.jsx`，传进react-router处理

```jsx
import React from 'react'
import Component from 'r2/module/ModuleComponent'
import { connect } from 'react-redux'

class View extends Component {
	constructor(props){
		super(props);//使用了构造器,必须要super(props)继承 
	}
    render() {
		super.render();//需要继承，本框架做了些处理，不继承，热替换失效。
		return (
			<div>
				{ this.props.children || "" }
			</div>
		)	
    }
}
var ReduxView = connect((state)=>{
	return {
	};
})(View)
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
	homeLink: {
		label:<Antd.Icon type="home"/>,
		link:'/',
	},
});
export default ReduxView; 
```

- .child_routes.js

  `.child_routes.js`是个隐藏文件，自动生成。

### view模式

view是我们代码开发主要地方，以下是必要文件，`action.js`和`reducer.js`看需要。

- `_route.js`,可当做二级路由（没layout）或三级路由（有layout），可自行修改，单务必按照以下格式。

```jsx
'use strict';
var view = function(){
	//这里try在浏览器中是多此一举，在智能路由中，node环境就需要,跳过异常
	var re; 
	try{
		re = `${r2Common.prefixUrl}/about`;
	}catch(e){}
	return re;
} 
//以下配置请参照React-Router官方文档
module.exports = {
	layout: "main",//在这里设置layout，r2自定义的，跟react-router没关系
	path: view(), 
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require("./index"))
        },"about")//webpack生成文件命名
    },
}
```

- `index.jsx`代码结构

```jsx
import React from 'react'
import Component from 'r2/module/ModuleComponent'

class View extends Component {
    constructor(props){
        super(props);//使用了构造器,必须要super(props)继承 
    }
    render() {
        super.render();//需要继承，本框架做了些处理，不继承，热替换失效。
        return (
            <div></div>
        )
    }
}

var ReduxView = connect((state)=>{
    return {
    };
})(View)
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
    title: "title设置处",
    breadcrumb:[
        {
            label:'home',
            link: '/',
        },
        {
            label:'导播活动列表',
        },
    ],
});
export default ReduxView; 
```

### 设置公共path

假设我们的域名是localhost，平常我们都是直接访问http://localhost就看访问了页面主页。但是也有特殊要求，要在http://localhost/main访问主页，访问http://localhost也跳转到http://localhost/main(当然通过ngnix可以做些特殊处理)。这个功能就是给你设置main的。

通过`r2Common.prefixUrl`（位置在`src/common/common.js`）设置，默认为空，如果不为空第一个字符必须是`/`，如

```jsx
r2Common.prefixUrl = '/main';//如果只设置为'main',访问时会报404。
```

### 设置浏览器标签title

R2框架是通过react default props设置title的， 在页面index.jsx中设置如下

```jsx
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
    title: "title设置处",
});
```

### layout切换

layout默认是`page/view/layout/main`，设置位置为每个view中的`_route.js`，代码如下。

```jsx
'use strict';
var view = function(){
	//这里try在浏览器中是多此一举，在智能路由中，node环境就需要,跳过异常
	var re; 
	try{
		re = `${r2Common.prefixUrl}/about`;
	}catch(e){}
	return re;
} 
module.exports = {
	layout: "main",//在这里设置layout
	path: view(), 
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require("./index"))
        },"about")
    },
}
```

当设置为false时或者不设置，就没有layout。

### 面包屑

面包屑功能稍微特殊点，需要结合layout页面使用，目前的面包写是针对Ant Design UI做处理的。
面包屑默认自带首页，如果需要修改可以在layout组件中的default props修改。

修改layout组件默认的首页：

```jsx
//此处为layout组件
var ReduxView = connect((state)=>{
	return {
	};
})(View)
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
	homeLink: {
		label:<Antd.Icon type="home"/>,
		link:'/',
	},
});
module.exports = ReduxView; 
```

在当前页面组件的index.jsx中设置如下：

```jsx
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
    title: "title设置处",
    breadcrumb:[
        {
            //还支持函数
            label:function(params){
                //params是R2从路由参数`:id`中解析处理，以`-`为分隔符。
                //如果当前路由为`/test/page/9_demo`,params = [9,'demo']
                return params[1];
            },
            link: function(parms){
                //同label
                return "test/page/"+params[0]; 
            },
        },
        {
            label:'循环存储查询',
            link: "/test",
        },
        {
            label:'循环存储查询',
        },
    ]
});
```

**展示**需要手动在当前的layout组件中添加，位置自定义：

```jsx
<div className="r2-breadcrumb">
	{ this.breadcrumb || "" }
</div>
```

### 定义公共actionCreator

R2框架公共actionCreator定义于`R2/src/page/action`,建议公共的actionCreator就定义在这里（当然你想定义在其他地方也可以）。commonAction代码如下

```jsx
import * as r2ActionCreator from "r2/actionCreator"

let requestPosts = r2ActionCreator.requestPosts; 
let receivePosts = r2ActionCreator.receivePosts; 
export const REQUESTLOGOUT = "REQUESTLOGOUT"
export const RECIEVELOGOUT = "RECIEVELOGOUT"

export function logout(successCallback,callbackAllStatus) {
    var url = r2Common.REQUESTURL + "/sop/v1/operators/logout";
    return r2fetch({
        method: 'POST',
        params:{},
        callbackAllStatus,
        successMessage: true,
    }).dispatchFetchOne(url,requestPosts(REQUESTLOGOUT,"logout"),receivePosts(RECIEVELOGOUT,"logout"),successCallback)
}
```

### 定义公共reducer

R2框架公共reducer定义于`R2/src/page/reducer`,建议公共的reducer就定义在这里（当然你想定义在其他地方也可以）,然后运行`npm run ac`进行reducer绑定。代码如下

```jsx
import * as actionCreator from './action' 

export function logout(state = {}, action) {
    switch (action.type) {
        
        case actionCreator.REQUESTLOGOUT: 
        case actionCreator.RECIEVELOGOUT:   
            return Object.assign({}, state,action);
        
        default:
            return state;
    }
}
```

### 全局变量定义

目前R2框架的全局变量如下，详细情况API。

- r2fn,公共常用方法
- r2ActionCreator,公共actionCreator
- r2fetch,R2封装的fetch方法
- r2Common,当前项目公共配置或方法

## 国际化功能

国际化语言包位置在`R2/src/common/locale`文件中，`index.js`文件是默认是当地开发中语言。配置语言位置在`R2/src/common/common.js`中，如下：

```js
//国际化处理，language未定义就是默认使用./locale/index.js
export const language = require("./locale/en_US")
```

使用方式如下：

```jsx
...
return (
	<div>{r2fn.t("主页")}</div>
)
...
```

`locale/index.js`

```jsx
module.exports = [
	"R2框架",
	"主页",
	"关于",
	"这是一个主页页面！",
	"这是一个关于页面！",
]
```

`locale/en_US.js`，索引位置要跟上面的一一对应，所以最好以index.js模板进行翻译，**注意空格**哦

```js
module.exports = [
	"R2 framework",
	"Home",
	"About",
	"This is a home page!",
	"This is a  about page!",
]
```

## 其他的一些特殊模式

为了更好的管理代码，R2框架建议，所有React组件继承`r2-js/libs/module/BasicComponent`(layout组件式特殊的一种)。之后新的组件包括页面index.jsx组件，数据逻辑处理请全部写在方法dataAdapter中，事件处理写在events中,redux 的dispatch actionCreator写在方法actions中。代码示例如下：

```jsx
import React from 'react'
import Component from 'r2/module/ModuleComponent'
import { connect } from 'react-redux'

class View extends Component {
    constructor(props){
        super(props); 
    }
    
    actions(){
        return {
            getData(){
                this.props.dispatch(actionCreator());
            },
        }
    }
        
    dataAdapter(){
        return {
            sortData(){
                this.props.data.sort((a,b)=>{
                    return b-a;
                })
            },
        } 
    }
    
    events(){
        return {
            handleClick(text){
                return (e)=>{
                    console.debug(text)
                    console.debug(e)
                }
            }
        }
    }
    
    render() {
        super.render();
        this.sortData();
        return (
            <div onClick={this.handleClick("骚年！")}>
                Hello Word!
            </div>
        )   
    }
}
module.exports = View; 
```

定义在dataAdapter和events中的方法可以被组件`this`直接访问，R2框架内部做了处理。

## FAQ

正在整理。 



