const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function loadDom() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'shop.html'), 'utf8');
  return new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
}

describe('addToCart integration', () => {
  let dom;

  beforeEach(() => {
    dom = loadDom();
  });

  test('adds the specified quantity to localStorage', () => {
    const { window } = dom;
    const document = window.document;

    const qtyInput = document.getElementById('qty-Squirrelflight');
    qtyInput.value = '2';

    const addButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('qty-Squirrelflight'));

    addButton.dispatchEvent(new window.Event('click', { bubbles: true }));

    const cartData = JSON.parse(window.localStorage.getItem('cart'));
    expect(cartData).toHaveLength(2);
    expect(cartData[0]).toEqual({ id: 'Squirrelflight', name: 'Squirrelflight Sticker', price: 5 });
  });
});
