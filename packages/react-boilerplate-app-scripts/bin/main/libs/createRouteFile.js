'use strict';

const fs = require("fs-extra")
const path = require("path")
const chalk = require('chalk');
const ReadTplInfo = require("react-boilerplate-app-utils/ReadTplInfo")
const FindFilesPathByDir = require("react-boilerplate-app-utils/FindFilesPathByDir")
const relative = require('relative');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = 'react-boilerplate-app-scripts';
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);

class Script {
  constructor(config){
    this.config = config;
    this.run();
  }

  run(){
    try{
      var tpls = this.getTpls();
      var filesPath = new FindFilesPathByDir(this.config)
      var routesInfo = this.getRoutesInfo(filesPath);
      this.writeRouteFile(routesInfo,tpls);
    }catch(e){
      console.log(e);
    }
  }

  getTpls(){
    return ReadTplInfo({
      path : this.config.tplPath,
    });
  }
  /**
   * 获取_route.js的所有文件信息
   */
  getRoutesInfo(filesPath){
    var routesInfo = [];
    filesPath.forEach(v=>{
      var sp = v.split("/")
      var name = sp[sp.length-2]
			routesInfo.push({
				name: name,
				absolutePath: v,
			})
    })
    return routesInfo;
	}

  writeRouteFile(routesInfo,tpls){
    var _this = this,
      name = "routes" ;
    var tpl = tpls[name],
      content = tpl.contents;
    var im = "",
      index = "";
    //指定layout是否是第一次
    var state = {};
    //处理一级route，判别方式为每个_route.js中是否有layout变量。
    routesInfo.forEach(v=>{
      var routes_file_contents = fs.readFileSync(v.absolutePath,{
        encoding : 'utf-8'
      })
      var routes_match = routes_file_contents.match(/layout.*\:.*("|')(.*)("|')/i);
      var layout,route_require_path;
      if(routes_match && routes_match[2]){
        layout = routes_match[2];
      }
      if(!layout){
        //获取相对位置，require使用
        var route_require_path = ('./' + relative(cwdPackageJsonConfig.routesPath,v.absolutePath)).replace(/\\/g,'/');
        if(v.name != "index"){
          im += tpl.tagsInfo.tagContents['require']
              .replace(/\$\{path\}/g,route_require_path)
        }else{
          index += tpl.tagsInfo.tagContents['index']
              .replace(/\$\{path\}/g,route_require_path)
        }
      }else{
        var layout_path = path.resolve(this.config.layoutPath,layout)
        if(!fs.existsSync(layout_path)){
          console.error(chalk.red(`layout：${ layout }，${ layout_path }不存在`));
          this.error = true;
          return;
        }
        var child_routesPath = path.resolve(layout_path,'.child_routes.js');
        //获取相对位置，require使用
        var route_require_path = ('./' + relative(child_routesPath,v.absolutePath)).replace(/\\/g,'/');
        //.child_routes.js文件不存在，创建新的
        if(!fs.existsSync(child_routesPath)){
          fs.writeFileSync(child_routesPath,"export default [\n\r  //routes//\n\r]")
        }
        if(fs.existsSync(child_routesPath)){
          if(!state[layout]){
            //首次初始化，文件内容
            fs.writeFileSync(child_routesPath,"export default [\n\r  //routes//\n\r]")
            state[layout] = true;
          }
          var child_routes = fs.readFileSync(child_routesPath,{
            encoding : 'utf-8'
          })
          child_routes = child_routes.replace(/\/\/routes\/\//g,'require("'+route_require_path+'").default, \n\r  //routes//')
          fs.writeFileSync(child_routesPath,child_routes)
        }else{
          console.error(v.absolutePath + "：不存在layout---"+layout)
        }

      }
    })
    content = content.replace(tpl.tagsInfo.tagRegex['require'],im)
    content = content.replace(tpl.tagsInfo.tagRegex['index'],index)
    // console.log(content)
    var savePath = path.resolve(this.config.savePath);
    fs.writeFileSync(savePath,content,{
      mode: 0o777,
    })
    console.log(chalk.green("Routes created successfully!"));
    console.log(chalk.cyan("Routes: " + savePath));
  }

}

module.exports = Script;




