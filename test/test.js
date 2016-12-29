import test from 'ava'
import nock from 'nock'

import Cryptowatch from '../src/index.js'

test.beforeEach(t => {
  t.context.cw = new Cryptowatch()
})

test('it gets correct allowance result', t => {
  nock('https://api.cryptowat.ch/')
    .get('/')
    .reply(200, {'allowance': {'cost': 111, 'remaining': 666}})

  return t.context.cw
    .allowance()
    .then(a => {
      t.is(a.remaining, 666)
      t.is(a.cost, 111)
    })
})

test('it gets correct price', t => {
  nock('https://api.cryptowat.ch/')
    .get('/markets/coinbase/btcusd/price')
    .reply(200, {'result': {'price': 982.6}, 'allowance': {'cost': 884009, 'remaining': 1947776255}})

  return t.context.cw
    .price('btc')
    .then(p => {
      t.is(p.price, 982.6)
    })
})

test('it calls correct endpoint with non-default inputs', t => {
  nock('https://api.cryptowat.ch/')
    .get('/markets/quoine/ethusd/price')
    .reply(200, {'result': {'price': 7.97}, 'allowance': {'cost': 1173698, 'remaining': 1902993194}})

  return t.context.cw
    .price('eth', 'usd', 'quoine')
    .then(p => {
      t.is(p.price, 7.97)
    })
})
