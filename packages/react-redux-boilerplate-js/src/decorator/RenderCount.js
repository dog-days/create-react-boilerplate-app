function getComponentName(component) {
  var str = component.toString();
  var match = str.match(/function (.*)\(/);
  return match[1];
}

//用作调试组件实例化后render函数运行次数
function renderCountDecorator(component) {
  component.prototype.temp_render = component.prototype.render;
  var name = getComponentName(component);
  function render() {
    if (!this.renderCount) {
      this.renderCount = 0;
    }
    this.renderCount++;
    if (this.props.location) {
      console.log(
        `%c ${name},router:${this.props.location.pathname}`,
        'color:green',
        `第${this.renderCount}次渲染`
      );
    } else {
      console.log(`%c ${name}:`, 'color:green', `第${this.renderCount}次渲染`);
    }
    return this.temp_render();
  }
  component.prototype.render = render;
  return component;
}
export default renderCountDecorator;
