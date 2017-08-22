import React from 'react';
import { BrowserMVC as MVC, Controller } from 'mvc-react';

function modelRegister(register) {
  //配置这些目录时，没有目录会报错，新建目录后还报错，可以新建一个空文件，保存以下其他文件触发重编译，就没问题了
  Controller.set({
    readViewFile(viewId, firstLoad) {
      if (firstLoad) {
        import(/* webpackMode: "eager" */
        `./model/${viewId}.js`)
          .then(model => {
            //注册sagaModel
            register(model.default);
          })
          .catch(e => {
            //console.log(e);
            //console.trace();
          });
      }
      //view可以异步载入
      return import(`./view/${viewId}/index.jsx`).then(component => {
        return component.default;
      });
    },
    readControllerFile(controllerId) {
      //webpackMode: eager是使import变为不异步，跟require一样，
      //但是返回的时promise对象，不能使用require，require会把没必要的文件载入
      //最好不使用异步载入，可能导致一些问题
      return import(/* webpackMode: "eager" */
      `./controller/${controllerId}.js`)
        .then(controller => {
          return controller.default;
        })
        .catch(e => {
          //必须catch并返回false
          return false;
        });
    },
    //设置首页path（跳转路径，即react-router path='/'时，会跳转到indexPath）
    //第一个字符必须是'/'，不能是main/index，要是绝对的路径
    indexPath: '/main/index'
  });
}

export default function container(props) {
  return <MVC modelRegister={modelRegister} hot={props.hot} />;
}
