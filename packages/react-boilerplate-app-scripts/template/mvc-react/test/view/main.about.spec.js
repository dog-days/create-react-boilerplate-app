import { q, mockMouseEvent, childListChangeObserver } from 'test/util';

let spyMainAboutSagaObj;

describe('Page "main/about"', function() {
  it('Router switch correctly.', function(done) {
    this.timeout(6000);
    q('.breadcrumb').children.length.should.equal(0);
    childListChangeObserver('.breadcrumb', function() {
      q('.breadcrumb').children.length.should.equal(1);
      done();
    });
    //点击关于导航
    mockMouseEvent(q('.navbar-nav').children[2].children[0], 'click');
  });
  it('Contents should render correctly.', function() {
    q('.main-contents').innerText.should.equal('当前位置关于页面：显示');
  });
  it('Redux model/about shuold run correctly.', function(done) {
    this.timeout(5000);
    spyMainAboutSagaObj = window.spyModelObj.sagas.mainAbout;
    childListChangeObserver('.main-contents', function() {
      //eslint-disable-next-line
      (!!q('.show-item')).should.be.true;
      spyMainAboutSagaObj.toggleShow.callCount.should.equal(1);
      done();
    });
    //点击显示按钮
    mockMouseEvent(q('.show-action'), 'click');
  });
});
