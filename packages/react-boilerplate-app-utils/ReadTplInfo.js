var fs = require('fs');
var path = require('path');
/**
 * 读取指定模板，获取所有符合规则的匹配信息，方便处理。
 * 文件名格式为xxxx.tpl.xx，tagName获取为xxxx
 * 或者文件名格式为fileNamexxx.xx，tagName获取为fileNamexxx
 *@param { object } config 构造函数配置参数
 *  config.path { string } 绝对路径，必填，如果是文件读取当前文件，如果是文件夹读取所有文件夹中的文件
 *  config.ignoreFiles { array } path为数组时，忽略的文件名。
 *  config.ignoreFilesWithSffix { array } path为数组时，忽略的文件后缀名。
 *@return {object} 构造函数不返回this，返回一个对象，如下：
 * eg.
 * {
 *   _reducer:{
 *     contents,
 *     tagsInfo
 *   },
 *   _route:{
 *     contents,
 *     tagsInfo
 *   }
 *   ...
 * }
 * _reducer和_route是文件名
 * contents 文件内容，例如
 *   <!--reducer_import_begin-->
 *   import { ${reducer} } from '${path}'
 *   <!--reducer_import_end-->
 *   var reducer = {
 *     <!--reducer_reducer_begin-->
 *     ${reducer},
 *     <!--reducer_reducer_end-->
 *   }
 *   export default reducer;
 * tagsInfo是标签信息，例如下面的标签匹配的信息
 * <!--reducer_import_begin-->
 *   import { ${reducer} } from '${path}'
 * <!--reducer_import_end-->
 * 如下
 * tagsInfo = {
 *   tagName: reducer_import,
 *   //我们是可以不用理会直接用了匹配替换
 *   tagRegex: /\<!--reducer_import_begin--\>([^^]+)\<!--reducer_import_end--\>/,
 *   //tagContents可以进一步处理替换。
 *   tagContents: "import { ${reducer} } from '${path}'"
 * }
 * 标签如何格式参考上面的contents
 */
class ReadTplInfo {
  constructor(config) {
    if (!config) {
      config = {};
    }
    this.config = Object.assign(config, {
      ignoreFiles: [],
      ignoreFilesWithSffix: [],
    });
    if (!config.path) {
      console.error('config.path is isRequired.');
      return;
    }
    //兼容windows路径
    this.config.path = this.config.path.replace(/\\/g, '/');
    this.setIgnoreInfo();
    return this.getDirFilesInfo();
  }

  /**
	 *	文件忽略设置
	 */
  setIgnoreInfo() {
    //苹果系统的文件忽略
    this.ignoreFiles = ['.DS_Store'];
    this.ignoreFilesWithSffix = ['.swp', '.swo'];
    this.ignoreFiles = this.ignoreFiles.concat(this.config.ignoreFiles);
    this.ignoreFilesWithSffix = this.ignoreFilesWithSffix.concat(
      this.config.ignoreFilesWithSffix
    );
  }
  /**
	 *	获取标签名,标签正则表达式
	 *@param {string} text 文件内容
	 *@return {object} 对象{ tagName : [标签名], tagRegex: [标签正则表达式],tagContents:[标签内容] }
	 */
  getTagsInfo(text) {
    var indexTags = text.match(/\<!--(.*)?_begin--\>/g);
    if (indexTags && indexTags[0]) {
      //存储各个标签名
      var tagName = [];
      indexTags.forEach(function(v) {
        tagName.push(v.match(/\<!--(.*)_begin/)[1]);
      });
      //存放各个标签正则表达式
      var tagRegex = {};
      //存放各个标签内容
      var tagContents = {};
      tagName.forEach(function(v) {
        var regex = new RegExp(`\<!--${v}_begin--\>([^^]+)\<!--${v}_end--\>`);
        tagRegex[v] = regex;
        //匹配内容
        tagContents[v] = text.match(regex)[1];
      });
      var tagsInfo = {
        tagName,
        tagRegex,
        tagContents,
      };
      return tagsInfo;
    }
    return {};
    //console.log(indexRegex)
  }

  /**
	 *	读取文件夹文件,和文件内容
	 *@return {object} 返回{文件名:{contents,tagsInfo}},tagsInfo参考getTagsInfo函数说明
	 */
  getDirFilesInfo() {
    try {
      fs.readdirSync(c_path);
    } catch (e) {}
    if (!fs.statSync(this.config.path).isDirectory()) {
      var pathSplit = this.config.path.split('/');
      var files = [pathSplit[pathSplit.length - 1]];
      pathSplit.pop();
      var c_path = pathSplit.join('/');
    } else {
      var c_path = this.config.path;
      var files = fs.readdirSync(c_path);
    }
    var filesObj = {};
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var filePath = path.resolve(c_path, file);
      var stat = fs.lstatSync(filePath);
      if (!stat.isDirectory()) {
        //过滤忽略文件
        if (this.ignoreFiles.indexOf(file) == -1) {
          var suffix = file.match(/\..*/)[0];
          //过滤忽略后缀名
          if (this.ignoreFilesWithSffix.indexOf(suffix) != -1) {
            continue;
          }
          var contents = fs.readFileSync(filePath, {
            encoding: 'utf-8',
          });
          var index = file.replace(/\..*/, '');
          filesObj[index] = {
            contents: contents,
            tagsInfo: this.getTagsInfo(contents),
          };
        }
      }
    }
    return filesObj;
  }
}
module.exports = function(config) {
  return new ReadTplInfo(config);
};
