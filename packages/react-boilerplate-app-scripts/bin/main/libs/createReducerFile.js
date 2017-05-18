'use strict';

const fs = require("fs")
const path = require("path")
const chalk = require('chalk');
const ReadTplInfo = require("react-boilerplate-app-utils/ReadTplInfo")
const FindFilesPathByDir = require("react-boilerplate-app-utils/FindFilesPathByDir")
const relative = require('relative');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = 'react-boilerplate-app-scripts';
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);

class createReducerFile {
  constructor(config){
    this.config = config;
    this.run();
  }

  run(){
    try{
      var tpls = this.getTpls();
      var filesPath = new FindFilesPathByDir(this.config)
      var reducersInfo = this.getReducersInfo(filesPath);
      this.writeReducerFile(reducersInfo,tpls);
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
   * 获取reducer.js的所有文件信息
   */
  getReducersInfo(filesPath){
		var reducersName = [];
    var reducersInfo = [];
    filesPath.forEach(v=>{
 			var contents = fs.readFileSync(v,{
				encoding : 'utf-8'
			})
			var reducers = this.getReducersFunc(contents);
			reducers.forEach(r=>{
				var index = reducersName.indexOf(r);
				if(index != -1){
					console.error(chalk.red("重复的reducer名"))
					console.log(chalk.yellow(r))
					console.log(chalk.yellow(v))
					console.log(chalk.yellow(reducersInfo[index].absolutePath))
          process.exit(1);
				}
				reducersName.push(r);
				reducersInfo.push({
					name: r,
          path: ('./' + relative(cwdPackageJsonConfig.reducersPath,v)).replace(/\\/g,'/'),
					absolutePath: v,
				})
			})
    })
    return reducersInfo;
	}
  /**
	 *	提取所有reducer.js文件中定义的reducers方法
   *	格式如下
   *  export function get_today_message(state = {}, action) {
   *    switch (action.type) {
   *      default:
   *        return state;
   *    }
   *  }
	 *@param {string} content reducer文件内容
	 *@return {array} 匹配的reducer方法名
	 */
	getReducersFunc(content){
		var con = content.match(/[^//()]*export(.*?)function(.*?)\(/g);
		var reducers = [];
		if(con){
			con.forEach(function(data){
				var re = data.split('function')[1].replace('(','')
												.replace(/\ /g,'');
				reducers.push(re);
			})
		}
		return reducers;
	}

  //根据reducers name，读取的tpl信息
  //替换匹配一些字符，保存最终的reducers文件
  writeReducerFile(reducersInfo,tpls){
    var _this = this,
      name = "reducers" ;
    var tpl = tpls[name],
      content = tpl.contents;
    var require = "",
      reducer = "";
    reducersInfo.forEach(v=>{
      require += tpl.tagsInfo.tagContents['reducer_import']
            .replace(/\$\{reducer\}/g,v.name)
            .replace(/\$\{path\}/g,v.path)
      reducer += tpl.tagsInfo.tagContents['reducer_reducer']
            .replace(/\$\{reducer\}/g,v.name)
    })
    content = content.replace(tpl.tagsInfo.tagRegex['reducer_import'],require)
    content = content.replace(tpl.tagsInfo.tagRegex['reducer_reducer'],reducer)
    var savePath = path.resolve(this.config.savePath);
    fs.writeFileSync(savePath,content,{
      mode: 0o777,
    })
    console.log(chalk.green("Reducers created successfully!"));
    console.log(chalk.cyan("Reducers: " + savePath));
  }
}

module.exports = createReducerFile;






