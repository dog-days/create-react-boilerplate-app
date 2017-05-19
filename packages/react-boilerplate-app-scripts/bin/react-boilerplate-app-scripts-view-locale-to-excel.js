#!/usr/bin/env node
'use strict';

const path = require("path");
const fs = require("fs-extra");
const xlsx = require("node-xlsx");
const chalk = require('chalk');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = 'react-boilerplate-app-scripts';

/**
 * 读取指定文件夹并生成多excel语言列表，同时会对比翻译后的ecxel（如果有新的文案，会列在最后）
 * @property dirs 指定文件夹中的所有子文件夹（子子孙孙）
 * @property allFiles 指定文件夹中的所有文件（子子孙孙）
 * @property langList 提取的语言文案列（文案可能重复）
 * @property uniqueLangList 提取的不重复的语言文案列表
 */
class ReadAndGenerateLocaleExeclList {
  constructor( config ){
    const packageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);
    if(!config) {
      config = {
        readDir: packageJsonConfig.appSrcPath || "src",
        excelSaveDir: `${ packageJsonConfig.appLocalePath }/excel` || "src/locale/excel",
      }
    }
    config = Object.assign({},{
      saveNotUniqueLangPath: path.resolve(`${ config.excelSaveDir }/multi-language(file-position).xlsx`),
      saveUniqueLangPath: path.resolve(`${ config.excelSaveDir }/multi-language(no repetition).xlsx`),
      translatedLangPath: path.resolve(`${ config.excelSaveDir }/multi-language(translated).xlsx`),
    },config)
    this.config = config;
    this.dirs = [];
    this.allFiles = [];
    //根据package.json中的配置去顶默认语言
    this.langList = [["position",packageJsonConfig.language || 'en_US']];
    //不重复的语言文案列表
    this.uniqueLangList = [];
    //和excel比较后语言文案列表
    this.compareUniqueLangList = [];
    this.run();
  }

  run(){
    fs.ensureDirSync(path.resolve(this.config.excelSaveDir));
    this.getAllFiles(path.resolve(this.config.readDir));
    this.readAllFilesAndGetLocaleText();
    this.getUniqueLocaleUText();
    if(fs.existsSync(this.config.translatedLangPath)){
      this.compareAndGetLangList();
    }else {
      this.compareUniqueLangList = this.uniqueLangList;
    }
    this.generateExcel();
  }
  /**
  * 获取指定文件夹所有文件,除去忽略的文件
  */
  getAllFiles(c_path){
    if(!fs.existsSync(c_path)){
      return;
    }
    try{
      var files = fs.readdirSync(c_path)
      files && files.forEach(v=>{
        //begin--------忽略处理
        if(v.indexOf(".swp") != -1){
          return;
        }
        if(v.indexOf(".swo") != -1){
          return;
        }
        switch(v){
          case "reducer.js":
            return;
          case "action.js":
            return;
          case ".DS_Store":
            return;
        }
        //end-------忽略处理
        var filePath = path.resolve(c_path,v);
        var stat =	fs.lstatSync(filePath);
        if(stat.isDirectory()){
          this.dirs.push(filePath);
          this.getAllFiles(filePath);
        }else {
          this.allFiles.push(filePath);
        }
      })
    }catch(e){
      console.log(e)
    }
  }
  /**
  * 读取所有文件内容，获取语言文案列表（可能重复）
  */
  readAllFilesAndGetLocaleText(){
    this.allFiles.forEach((v,k)=>{
      var short_path = v.split("src")[1];
      var contents = fs.readFileSync(v,{
        encoding : 'utf-8'
      })
      //匹配.t("")
      var m = contents.match(/\.t\("(.*)"\)/g);
      m && m.forEach(v2=>{
        var t = v2.split('"');
        this.langList.push([short_path,t[1]]);
      })
      //匹配.t('')
      var m = contents.match(/\.t\('(.*)'\)/g);
      m && m.forEach(v2=>{
        var t = v2.split("'");
        this.langList.push([short_path,t[1]]);
      })
    })
  }
  /**
  * 读取所有文件内容，获取语言文案列表（可能重复）
  */
  getUniqueLocaleUText(){
    var temp = [];
    this.langList.forEach(v=>{
      if(temp.indexOf(v[1]) === -1){
        temp.push(v[1]);
        this.uniqueLangList.push([v[1]]);
      }
    })
  }
  /**
  * 读取excel文件内容
  */
  parseExcelFile(c_path){
    var data;
    try{
      data = xlsx.parse(c_path);
    }catch(e){
      console.log(e)
    }
    //console.log(data[0].data)
    return data;
  }
  /**
  * 对比已存在的excel，获得语言最终列表
  */
  compareAndGetLangList(){
    var data = this.parseExcelFile(this.config.translatedLangPath);
    var firstData = [];
    data[0].data.forEach(v=>{
      firstData.push(v[0]);
    })
    this.uniqueLangList.forEach((v,k)=>{
      var index = firstData.indexOf(v[0]);
      if(index !== -1){
        this.compareUniqueLangList.push(data[0].data[index])
      }
    })
    this.uniqueLangList.forEach((v,k)=>{
      var index = firstData.indexOf(v[0]);
      if(index === -1){
        this.compareUniqueLangList.push(v);
      }
    })
    //console.log(this.compareUniqueLangList);
    //console.log(data[0].data.length,this.uniqueLangList.length,this.compareUniqueLangList.length);
  }
  /**
  * 生成Excel，给对应人员翻译
  */
  generateExcel(){
    //console.log(this.compareUniqueLangList);
    var buffer = xlsx.build([{name: "multi-language", data: this.compareUniqueLangList}]);
    fs.writeFileSync(this.config.saveUniqueLangPath,buffer);
    fs.writeFileSync(this.config.translatedLangPath,buffer);
    var buffer2 = xlsx.build([{name: "multi-language", data: this.langList}]);
    fs.writeFileSync(this.config.saveNotUniqueLangPath,buffer2)
    console.log(chalk.green('Excel created successfully in '));
    console.log(chalk.cyan(path.resolve(this.config.excelSaveDir)));
  }

}
module.exports = ReadAndGenerateLocaleExeclList;
var obj = new ReadAndGenerateLocaleExeclList();
//console.log(obj.langList)










