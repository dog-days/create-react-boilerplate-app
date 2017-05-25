function titleDecorator(title) {
  return function(component) {
    class ViewComponent extends component {
      static displayName = component.displayName || component.name;

      constructor(props) {
        super(props);
        this.setTitle();
      }

      setTitle() {
        //多语言处理
        var t_title = title;
        if (this.t) {
          t_title = this.t(title);
        }
        document.title = t_title;
      }

      render() {
        if (this.props.changedLocale) {
          this.setTitle();
        }
        return super.render();
      }
    }
    return ViewComponent;
  };
}

export default titleDecorator;
