import util from '../util'


/**
 * @return { array } 面包写数组列表。
 */
function getBreadCrumbs(){
  var breadcrumbs = [];
  if(this.props && this.props.children){
    breadcrumbs = this.props.children.props.breadcrumbs || [];
    //console.debug(this.props.children.props)
  }
  return Object.assign([],breadcrumbs);
}
function breadcrumbDecorator(component){
  component.prototype.getBreadCrumbs = getBreadCrumbs;
  return component;
}
breadcrumbDecorator.create = function(breadcrumbs){
  return function(component){
    component.defaultProps = Object.assign({ },component.defaultProps || {},{
      breadcrumbs: breadcrumbs
    });
    return component;
  }
}

export default breadcrumbDecorator;
