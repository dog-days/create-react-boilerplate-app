import { q } from 'test/util';

describe('Page', function() {
  it('Content should render correctly.', function() {
    q('.app-intro')
      .innerText.replace('\r\n', '')
      .replace('\n', '')
      .should.equal(
        '请编辑src/container.jsx，保存后页面会自动更新编辑后内容，无需手动刷新页面。此模板是最简单的，只是用了React，没有其他依赖。'
      );
  });
});
