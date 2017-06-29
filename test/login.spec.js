/* eslint import/no-extraneous-dependencies: 0 */
import test from 'ava';
import request from 'supertest';
import 'babel-register';
import server from '../src';

test('POST /login:Success', async (t) => {
  const res = await request(server)
              .post('/login')
              .send({
                email: 'auth@test.com',
                password: 'test',
              });
  t.is(res.body.first_name, 'Auth');
  t.is(res.body.last_name, 'Test');
  t.is(res.body.email, 'auth@test.com');
  t.is(res.status, 200);
});

test('POST /login:Fail - Field missing', async (t) => {
  const res = await request(server)
              .post('/login')
              .send({
                email: 'ps@d.com',
              });
  t.is(res.status, 400); // bad request
});

test('POST /login:Fail - Invalid email/password combination', async (t) => {
  const res = await request(server)
              .post('/login')
              .send({
                email: 'auth@test.com',
                password: 'auth',
              });
  t.is(res.status, 401); // unauthorized
});
