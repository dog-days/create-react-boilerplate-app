import { q, mockMouseEvent, childListChangeObserver } from 'test/util';

let spyMainIndexSagaObj;

describe('Page "main/index"', function() {
  //因为test匹配.spec文件会根据字母顺序来处理，可能没有在之前执行，所有要切换回到首页
  it('Switch to "main/index"', function(done) {
    setTimeout(function() {
      mockMouseEvent(q('.navbar-nav').children[1].children[0], 'click');
      done();
      //渲染时间具体情况具体处理
    }, 1000);
  });

  it('Contents should render correctly.', function() {
    q('.main-contents').innerText.should.equal('当前位置主页：显示');
  });

  it('Redux model/about shuold run correctly.', function(done) {
    this.timeout(5000);
    spyMainIndexSagaObj = window.spyModelObj.sagas.mainAbout;
    childListChangeObserver('.main-contents', function() {
      //eslint-disable-next-line
      (!!q('.show-item')).should.be.true;
      spyMainIndexSagaObj.toggleShow.callCount.should.equal(1);
      done();
    });
    //点击显示按钮
    mockMouseEvent(q('.show-action'), 'click');
  });
});
