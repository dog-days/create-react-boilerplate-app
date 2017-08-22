import Controller from 'react-router-controller';
import LayoutComponent from '../view/layout/main';

export default class MainController extends Controller {
  LayoutComponent = LayoutComponent;
  indexView(params) {
    return this.render(
      {
        title: '主页',
        breadcrumbs: [],
      },
      params
    );
  }
  aboutView(params) {
    if (!this.checkParams(params, ['id'])) {
      return false;
    }
    return this.render(
      {
        title: '关于',
        breadcrumbs: [],
      },
      params
    );
  }
}
