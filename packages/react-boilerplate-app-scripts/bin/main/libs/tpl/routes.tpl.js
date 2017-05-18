var childRoutes = [
  <!--require_begin-->
  require('${path}').default,
  <!--require_end-->
  {
    path: '*',
    getComponent(location, cb) {
      require.ensure([], function(require){
        cb(null, require('src/view/nopage').default)
      },"nopage")
    }
  },

];
export default {
  childRoutes: childRoutes 
}
