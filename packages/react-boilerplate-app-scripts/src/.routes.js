var childRoutes = [
  
  require('src/view/layout/main/_route.js').default,
  
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
