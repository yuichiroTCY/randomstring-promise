import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import random from '../src/randomstring-promise';

describe('randomstringPromise', () => {
  it('provides Promise interface', (done) => {
    random()
    .then(res => {
      expect(res).to.be.a('string');
    })
    .catch(err => done.fail(err))
    .then(done);
  });

  it('generates string', () =>
    expect(random()).to.eventually.be.a('string')
  );

  it('accepts length paramter', () =>
    expect(random(16)).to.eventually.have.lengthOf(16)
  );

  it('generates unique strings', () => {
    const num = 1000;
    const promises = Array(num);
    for (let i = 0; i < num; ++i) { promises[i] = random(); }

    return Promise.all(promises)
    .then(strings => {
      const results = {};
      strings.forEach(s => {
        expect(results[s]).not.to.be.true;
        results[s] = true;
      });
    });
  });

  it('generates unbiased strings', () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const slen = 1000000;

    return random(slen)
    .then(s => {
      const counts = {};
      for (let i = 0; i < s.length; ++i) {
        const c = s.charAt(i);
        counts[c] = (counts[c] || 0) + 1;
      }

      const avg = slen / chars.length;

      Object.keys(counts).sort().forEach(key => {
        const diff = counts[key] / avg;
        expect(diff).to.closeTo(1, 0.05);
      });
    })
  })
});
