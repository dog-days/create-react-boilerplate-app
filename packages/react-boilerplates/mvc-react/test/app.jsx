import React from 'react';
import { MemoryMVC as MVC, Controller } from 'mvc-react';
import i18n from 'react-router-controller/libs/plugins/i18n';
import sinon from 'sinon';

/**
 * 根据位置，小写转大写，默认转换第一个字母
 * @param  {string} string 传进来的字符串
 * @param  {number}  start  开始位置，默认0
 * @param  {number}  end  介绍位置，默认1
 * @return {string}
 */
function toUpperCaseByPosition(string, start = 0, end = 1) {
  var str1 = string.substr(start, end).toUpperCase();
  var str2 = string.substr(end);
  return str1 + str2;
}

function modelRegister(register) {
  //配置这些目录时，没有目录会报错，新建目录后还报错，可以新建一个空文件，保存以下其他文件触发重编译，就没问题了
  Controller.set({
    readViewFile(viewId, controllerId, firstLoad) {
      if (firstLoad) {
        const model = require(`src/model/${viewId}.js`).default;
        const sagaSpyObj = (window.spyModelObj.sagas[
          `${controllerId}${toUpperCaseByPosition(viewId)}`
        ] = {});
        if (model.sagas) {
          for (let key in model.sagas) {
            sagaSpyObj[key] = sinon.spy(model.sagas[key]);
            model.sagas[key] = sagaSpyObj[key];
          }
        }
        const reducerSpyObj = (window.spyModelObj.reducers[
          `${controllerId}${toUpperCaseByPosition(viewId)}`
        ] = {});
        if (model.reducers) {
          for (let key in model.reducers) {
            reducerSpyObj[key] = sinon.spy(model.reducers[key]);
            model.reducers[key] = reducerSpyObj[key];
          }
        }
        register(model);
      }
      return new Promise(function(resolve) {
        const component = require(`src/view/${controllerId}/${viewId}/index.jsx`)
          .default;
        resolve(component);
      });
    },
    readControllerFile(controllerId) {
      if (!controllerId) {
        return new Promise(function(resolve) {
          resolve();
        });
      }
      return new Promise(function(resolve) {
        const controller = require(`src/controller/${controllerId}.js`).default;
        resolve(controller);
      });
    },
    //插件
    plugins: [
      i18n(language => {
        return new Promise(function(resolve) {
          const i18n = require(`src/i18n/${language}.js`);
          resolve(i18n);
        });
      }, require('src/i18n/zh_CN').default),
    ],
    //设置首页path（跳转路径，即react-router path='/'时，会跳转到indexPath）
    //第一个字符必须是'/'，不能是main/index，要是绝对的路径
    indexPath: '/main/index',
  });
}

export default function container(props) {
  return (
    <MVC
      basename={process.env.basename}
      modelRegister={modelRegister}
      {...props}
    />
  );
}
