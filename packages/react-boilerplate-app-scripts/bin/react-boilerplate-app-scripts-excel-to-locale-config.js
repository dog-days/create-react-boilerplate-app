#!/usr/bin/env node --harmony
'use strict';

const path = require("path");
const fs = require("fs-extra");
const xlsx = require("node-xlsx");
const chalk = require('chalk');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = 'react-boilerplate-app-scripts';

/**
 * 读取多语言excel，生成common/locale/多语言.js文件
 */
class ReadExecelAndCreateLocaleJS {
  constructor(config){
    const packageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);
    if(!config){
      config = {
        saveDir: packageJsonConfig.appLocalePath || 'src/locale',
        readDir: `${ packageJsonConfig.appLocalePath }/excel` || 'src/locale/excel',
      }
    }
    config = Object.assign({},{
      readFilePath: path.resolve(`${ config.readDir }/multi-language(translated).xlsx`),
    },config);
    this.config = config;
    this.run();
  }

  run(){
    var data = this.parseFile();
    var contents = this.formatContents(data[0].data);
    this.saveFiles(contents);
    //console.log(contents[0].title)
    
  }
  /**
   * 格式化读取的语言列表
   */
  formatContents(data){
    var prifix = "export default [ \r\n";
    var localeList = []; 
    data.forEach((v,k)=>{
      v.forEach((v2,k2)=>{
        if(k != 0 && v2 != "") {
          localeList[k2].contents += `  "${ v2 }",\r\n`;
        }else {
          //提取语言文件名，excel第一行
          if(!v2){
            return;
          }
          localeList.push(
            {
              title: v2,
              contents: prifix,
            }
          )
        }
      })
    })
    data && data[0] && data[0].forEach((v3,k3)=>{
      localeList[k3].contents += "]";
    })
    return localeList;
  }
  /**
   * 读取excel 
   */
  parseFile(){
    var data;
    try{
      data = xlsx.parse(this.config.readFilePath);
    }catch(e){
      console.log(e)
    }
    //console.log(data[0].data)
    return data;
  }
  /**
   * 保存多语言配置文件
   */
  saveFiles(contents){
    contents.forEach((v,k)=>{
      var save_path = path.resolve(this.config.saveDir,v.title + ".js");
      fs.writeFileSync(
        save_path,
        v.contents,
        {
          mode: 0o777,
        }
      )
      console.log(chalk.green('created successfully ') + "in " + chalk.cyan(save_path))
    })
  }
}
module.exports = ReadExecelAndCreateLocaleJS;
var obj = new ReadExecelAndCreateLocaleJS(); 










