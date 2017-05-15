import React from 'react'
import _ from 'lodash'

export default {
  /**
   * Get the display name of a component
   * @param  {Object} Comp Specified Component
   * @return {String}      Display name of Component
   */
  getDisplayName(Comp){
    if (!Comp) { return ''; }
    if (typeof Comp === 'string') {
      return Comp;
    }
    return Comp.displayName || Comp.name || 'Component';
  },
  /*
   * 递归查找
   * Find and return all matched children by type. `type` can be a React element class or
   * string
   */
  findAllComponentByType(children, type){
    let result = [];
    let types = [];

    if (_.isArray(type)) {
      types = type.map(t => this.getDisplayName(t));
    } else {
      types = [this.getDisplayName(type)];
    }

    React.Children.forEach(children, (child) => {
      const childType = child && child.type && (child.type.displayName || child.type.name);
      if (types.indexOf(childType) !== -1) {
        result.push(child);
      }else {
        if(child && child.props && child.props.children){
          var result2 = this.findAllByType(child.props.children,type); 
          result2.forEach((v,k)=>{
            result.push(v);
          })
        }
      }
    });

    return result;
  }, 
}
