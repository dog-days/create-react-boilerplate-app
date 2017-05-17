const fs = require('fs-extra');
const path = require("path");
const chalk = require('chalk');
const util = require('react-boilerplate-app-utils');


/**
 * 移除协议标签'//@xxx--begin(end)'
 * @param { stirng } contents 需要移除标签的内容
 * @param { stirng } tag 部分正则表达式
 */
function removeTag(contents,tag){
  //mac linux
  contents = contents.replace(new RegExp(`\n\/\/≤${tag}--begin`,'g'),'');
  contents = contents.replace(new RegExp(`\n\/\/≤${tag}--end`,'g'),'');
  //windows
  contents = contents.replace(new RegExp(`\r\/\/≤${tag}--begin`,'g'),'');
  contents = contents.replace(new RegExp(`\r\/\/≤${tag}--end`,'g'),'');
  return contents;
}
/**
 * 移除tag中的内容
 * //@xxx--begin
 * contents to be removed
 * //@xxx--end
 * @param { stirng } contents 需要移除标签的内容
 * @param { stirng } tagId 命名的tag id(@id)，也可以是正则表达式.*
 */
function removeTagContents(contents,tagId){
  //mac linux
  var reg = new RegExp(`\n\/\/≤${tagId}--begin[^≤]*\/\/≤${tagId}--end`,'g');
  contents = contents.replace(reg,'');
  return contents;
}
/**
 * 保存经过commander options处理后的文件内容
 * @param { array } readFilesPath 需要读取的文件路径列表
 * @param { array } saveFilesPath 需要保存的文件路径列表，跟readFilesPath的索引和文件名一致。
 * @param { object } program commander对象
 * @param { boolean } showLogs 是否展示成功后的log
 */
function saveByFilesPath(readFilesPath,saveFilesPath,program,showLogs){
  if(!readFilesPath || !saveFilesPath || !program){
    console.error(chalk.red('参数缺漏！'))
    process.exit(1);
    return;
  }
  let {
    i18n,
    breadcrumb,
    all,
  } = program;
  readFilesPath.forEach((v,k)=>{
    //兼容windwos平台路径1
    v = v.replace(/\\/g,'');
    var contents = fs.readFileSync(v,{
      encoding : 'utf-8'
    })
    if(this.pageName){
      //处理viem template 中的替换，根据this.pageName来判断
      contents = contents.replace(/\${pageName}/g,this.pageName);
      contents = contents.replace(/\${pageNameFirstLetter}/g,util.toUpperCaseByPosition(this.pageName,0,1));
    }
    if(all){
      //启用全部特性功能
      contents = this.removeTag(contents,'.*');
    }else {
      if(i18n){
        //启用i18n功能
        contents = this.removeTag(contents,'Locale');
      }else {
        //否则移除this.t(xxx)，不移除会报错
        var m = contents.match(/\.t\(["'](.*)["']\)/g);
        m && m.forEach(v2=>{
          var t = v2.split('"');
          if(!t[1]){
            var t = v2.split("'");
          }
          contents = contents.replace(`this.t('${ t[1] }')`,`'${ t[1] }'`);
          contents = contents.replace(`this.t("${ t[1] }")`,`'${ t[1] }'`);
          contents = contents.replace(new RegExp(`{.*'${ t[1] }'.*}`,'g'),t[1]);
        })
      }
      if(breadcrumb){
        //启用面包屑功能
        contents = this.removeTag(contents,'BreadCrumb');
      }
    }
    //统一移除自定义tag（//≤--begin），包括tag内容
    contents = this.removeTagContents(contents,'.*');
    var filePahtSplit = v.split('/');
    var fileName = filePahtSplit[filePahtSplit.length - 1];
    var savePath = path.resolve(saveFilesPath[k]);
    fs.ensureFileSync(savePath);
    fs.writeFileSync(savePath,contents,{
      mode: 0o777,
    })
    if(showLogs){
      console.log(chalk.green(fileName + " is saved at:"));
      console.log(chalk.cyan(savePath));
    }
  })
}


function decorator(component){
  component.prototype.removeTag = removeTag;
  component.prototype.removeTagContents = removeTagContents;
  component.prototype.saveByFilesPath = saveByFilesPath;
  return component;
}
module.exports = decorator;
