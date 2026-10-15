import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authMiddleware, roleMiddleware, type AuthenticatedRequest } from '../middlewares/auth';

// authMiddleware now requires JWT_SECRET to be configured (no hardcoded
// fallback). Provide a deterministic test secret so the valid-token case can
// sign and verify with the same value.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-auth-middleware';

const SECRET = process.env.JWT_SECRET;

function mockResponse() {
  const res: any = { statusCode: 200, body: undefined };
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res;
  };
  return res;
}

test('authMiddleware rejects requests without a session token', () => {
  const req = { cookies: {} } as unknown as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('authMiddleware rejects tampered tokens', () => {
  const token = jwt.sign({ id: '1', email: 'a@b.c', role: 'ADMIN' }, 'a-different-secret', {
    expiresIn: '1h',
  });
  const req = { cookies: { auth_token: token } } as unknown as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('authMiddleware accepts a valid token and exposes the user', () => {
  const token = jwt.sign({ id: 'u1', email: 'admin@x.c', role: 'ADMIN' }, SECRET, {
    expiresIn: '1h',
  });
  const req = { cookies: { auth_token: token } } as unknown as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user?.role, 'ADMIN');
  assert.equal(req.user?.id, 'u1');
});

test('roleMiddleware blocks users without the required role', () => {
  const req = { user: { id: '2', email: 'farmer@x.c', role: 'FARMER' } } as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  roleMiddleware(['ADMIN'])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
});

test('roleMiddleware allows users with the required role', () => {
  const req = { user: { id: '1', email: 'admin@x.c', role: 'ADMIN' } } as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  roleMiddleware(['ADMIN'])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test('roleMiddleware rejects unauthenticated requests', () => {
  const req = {} as AuthenticatedRequest;
  const res = mockResponse();
  let nextCalled = false;

  roleMiddleware(['ADMIN'])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});
