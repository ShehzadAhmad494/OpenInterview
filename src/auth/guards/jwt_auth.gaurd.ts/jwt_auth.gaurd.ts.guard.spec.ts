import { JwtAuthGaurdTsGuard } from './jwt_auth.gaurd.ts.guard';

describe('JwtAuthGaurdTsGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGaurdTsGuard()).toBeDefined();
  });
});
