import { setUserInfo } from '../auth';


describe('Authentication', () => {
  it('should get userInfo from User object', () => {
    expect(setUserInfo({
      id: '1234',
      name: 'ttester',
      email: 'ttester@example.com',
      test: 'test',
    })).toEqual({
      id: '1234',
      name: 'ttester',
      email: 'ttester@example.com',
    });
  });
});
