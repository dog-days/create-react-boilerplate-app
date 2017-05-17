'use strict';

const path = require("path")
const fs = require("fs-extra")
const util = require('react-boilerplate-app-utils');

/**
 * @param {object} config
 * {
 * 		path: [],//数组,查找的路径
 * 		fileName:"",//查找的文件名
 *    //如果fileName="*",代表所有文件
 * }
 * @this {Array} dirs 查找后的指定文件所有文件夹路径
 * @this {Array} filesPath 查找后的指定文件的所有文件路径
 */
class Script {
	constructor(config){
		this.config = config;
		//所有找到的文件夹路径数组
		this.dirs = [];
		//查找所指定文件后的路径
		this.filesPath = [];
		this.run();
	}
  run(){
		this.config.path.forEach(v=>{
      //当前文件夹也要考虑进去
      this.dirs.push(v);
			this.getAllDirPath(path.resolve(v));
		})
		try{
			this.dirs.map((v,k)=>{
        if(this.config.fileName === '*'){
          var files = util.readdirSync(v);
          files.forEach((v2,k2)=>{
            var f_path = path.resolve(v,v2)
            //replace是处理windows的反斜杠，网页上都是使用斜杠
            //生成routes和reducers时要处理
            this.filesPath.push(f_path.replace(/\\/g,"/"));
          })
        }else {
          //判断指定文件是否存在
          var f_path = path.resolve(v,this.config.fileName)
          if(fs.existsSync(f_path)){
            //replace是处理windows的反斜杠，网页上都是使用斜杠
            //生成routes和reducers时要处理
            this.filesPath.push(f_path.replace(/\\/g,"/"));
          }
        }
			})
//console.log(this.filesPath)
		}catch(e){
			console.log(e);
      process.exit()
		}
	}
	/**
	 * getAllDirPath 遍历给定的路径中所有的文件夹
	 */
	getAllDirPath(c_path){
		if(!fs.existsSync(c_path)){
			return;
		}
		try{
			var files = fs.readdirSync(c_path)
			files && files.forEach(v=>{
				var filePath = path.resolve(c_path,v);
				var stat =	fs.lstatSync(filePath);
				if(stat.isDirectory()){
					this.dirs.push(filePath);
					this.getAllDirPath(filePath);
				}
			})
		}catch(e){
			console.log(e)
      process.exit()
		}
	}

}

module.exports = Script;





