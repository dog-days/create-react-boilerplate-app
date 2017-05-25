export default function path(url) {
  if (!url) {
    console.error('url不能为空和未定义');
    return;
  }
  var prefixUrl = process.env.PREFIX_URL || '';
  //prefixUrl第一个字符必须是'/'
  if (prefixUrl[0] !== '/') {
    prefixUrl = '/' + prefixUrl;
  }
  //prefixUrl 最后一个字符不能是'/'
  if (prefixUrl[prefixUrl.length - 1] === '/') {
    prefixUrl = prefixUrl.slice(0, prefixUrl.length - 1);
  }
  //url第一个字符必须是'/'
  if (url[0] !== '/') {
    url = '/' + url;
  }
  url = prefixUrl + url;
  return url;
}
