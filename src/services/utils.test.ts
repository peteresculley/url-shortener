import { isValidUrl, generateToken } from './utils';

describe('utils', () => {
  describe('#isValidUrl', () => {
    it('valid', () => {
      const url = 'http://github.com';
    
      expect(isValidUrl(url)).toBe(true);
    });
    
    it('invalid', () => {
      const url = '1234';
    
      expect(isValidUrl(url)).toBe(false);
    });
  });

  describe('#generateToken', () => {
    it('always changes', () => {
      expect(generateToken()).not.toBe(generateToken());
    });

    it('no special characters', () => {
      for(let i = 0; i < 100; i++) {
        expect(generateToken()).not.toMatch(/\/\+\=/);
      }
    });
  });
});
