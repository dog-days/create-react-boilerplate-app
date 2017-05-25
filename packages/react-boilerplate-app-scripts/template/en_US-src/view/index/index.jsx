import React from 'react';
import { connect } from 'react-redux';
//≤Locale--begin
import Locale from 'react-redux-boilerplate-js/libs/decorator/Locale';
//≤Locale--end
import PageTitle from 'react-redux-boilerplate-js/libs/decorator/PageTitle';

//connect to redux store,refer to redux.
//set page title
//≤Locale--begin
//muti-language decorator,it's different from the first route layout view component.
//it provides `this.t(xxx)` to the component.
//if you want the locale function worked,you must use this to pass the string.
//you can use `npm run view-locale-to-excel` to generate the default language excel lists(must use `this.t`,donot change it).
//you can use `npm run excel-to-locale-config` to generate the default language javascirpts array lists.
//refer to the api.
//≤Locale--end
//the view is the second route page veiw component.
//you can eidit `./_route.js` file to change the url path for the current page.
@connect(state => {
  return {};
})
@PageTitle('Home')
@Locale
class IndexView extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.t('Home')}</h1>
        {this.t('To get started, edit src/view/index/index.jsx.')}
        <br />
        {this.t(
          'When you save the file,it will be updated to the browser automatically.'
        )}
      </div>
    );
  }
}

export default IndexView;
