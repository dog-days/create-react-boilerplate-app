import { q } from 'test/util';

describe('Layout', function() {
  it('The number of navbar item should be correct.', function() {
    q('.navbar-nav').children.length.should.equal(5);
  });
  it('Logo should be render correctly.', function() {
    //eslint-disable-next-line
    (!!q('.logo-con')).should.be.true;
  });
});
