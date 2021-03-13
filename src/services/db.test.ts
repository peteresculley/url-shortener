import { init, addUrl, getUrl } from './db';

let connectMock: jest.Mock;
let queryMock: jest.Mock;
jest.mock('pg', () => ({
  Client: class pgClientMock {
    constructor() {
      connectMock = this.connect;
      queryMock = this.query;
    }
    connect = jest.fn();
    query = jest.fn();
  },
}));

describe('db', () => {
  describe('#init', () => {
    afterEach(() => {
      connectMock.mockReset();
      queryMock.mockReset();
    });

    it('calls connect', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ exists: 't' }], rowCount: 1 });
      await init();
      expect(connectMock).toBeCalled();
    });
  });

  describe('#addUrl', () => {
    afterEach(() => {
      queryMock.mockReset();
    });

    it('use old token if already added', async () => {
      const testToken = 'test token';
      queryMock.mockResolvedValueOnce({ rows: [{ token: testToken }], rowCount: 1 });
      expect(await addUrl('test url')).toBe(testToken);
    });
  });

  describe('#getUrl', () => {
    afterEach(() => {
      queryMock.mockReset();
    });

    it('can get url if exists', async () => {
      const testUrl = 'test url';
      queryMock.mockResolvedValueOnce({ rows: [{ url: testUrl }], rowCount: 1 });
      expect(await getUrl('test token')).toBe(testUrl);
    });

    it('cannot get url if not exists', async () => {
      queryMock.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      expect(await getUrl('test token')).toBe(undefined);
    });
  });
});
