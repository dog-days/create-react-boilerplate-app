/**
 * 获取fetch的默认配置 
 *@return { object } options 配置选项 
 *  options.bodyType是自定义新增的一项，发送信息的body体，
 *  一般分两种json数据和form data数据（上传文件时）,
 *  当然也可以或略这一项，安装fetch原来的写法传body数据也是可以的
 */
export function getFetchOptions(options) {
  let opt = {
    bodyType: 'json',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8',
    },
    //include允许跨域传cookie，same-origin允许同域传cookie
    //必须设置，要不不会传cookie
    credentials: 'include',
  };
  Object.assign(opt, options);
  if (opt.body) {
    //params根据body类型区分
    if (opt.bodyType === 'json') {
      opt.body = JSON.stringify(opt.body);
    } else if (opt.bodyType === 'form-data') {
      opt.body = new FormData(opt.body);
    }
  }
  return opt;
}

/**
 * fetchOne 获取接口数据
 *@param { string } url 目标请求url 
 *@param { object } options 配置继承fetch中所有配置项的
 *@return { promise } 返回Promise对象，参数为请求的结果
 */
export function fetchOne(url, options) {
  options = getFetchOptions(options);
  //console.debug(options)
  var status = 0;
  return fetch(url, options)
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(json => {
      return {
        data: json,
        status,
      };
    });
}
/**
 * fetchMore 获取多个接口数据
 *@param {array} urls 目标请求urls 
 *@param { array || object } options 配置组，跟urls索引对应，配置继承fetch中所有配置项的
 * 如果不是object类型，就属于全部urls的共同配置
 *@return { promise } 返回Promise对象，参数为所有请求的结果 
 */
export function fetchMore(urls, options) {
  var _urls = [];
  urls.forEach(function(v, k) {
    let i = k;
    var re;
    if (Object.prototype.toString.apply(options) === '[object Array]') {
      re = fetchOne(v, options[k] || {});
    } else {
      re = fetchOne(v, options, {});
    }
    _urls.push(re);
  });
  return Promise.all(_urls).then(function(jsonArray) {
    return jsonArray;
  });
}
