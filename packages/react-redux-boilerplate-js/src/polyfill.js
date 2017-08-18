'use strict';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');
// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object.assign');
Object.keys = Object.keys || Object.keys.shim;
//兼容父类构造器不运行问题
(function() {
  var testObject = {};
  if (!(Object.setPrototypeOf || testObject.__proto__)) {
    var nativeGetPrototypeOf = Object.getPrototypeOf;

    Object.getPrototypeOf = function(object) {
      if (object.__proto__) {
        return object.__proto__;
      } else {
        return nativeGetPrototypeOf.call(Object, object);
      }
    };
  }
})();

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}
