require('chai').should();
const sinon = require('sinon');
const Bot = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');
const querystring = require('querystring');

describe('Vk Adapter', () => {
  let bot = new Bot({
    message: 'Кто там?'
  });

  let adapter = new Adapter({
    token: 'fakeToken',
    groupId: 'fakeGroupId',
    confirmCode: 'fakeConfirmCode'
  });

  adapter.bot = bot;

  it('confirmation', async () => {
    await adapter.middleware({body: {
      type: 'confirmation',
      group_id: 'fakeGroupId'
    }}, {
      send: function (data) {
        data.should.equal('fakeConfirmCode');
      },
      end: function () {}
    }, (err) => {
      err.should.be.null();
    });
  });

  it('message_new', async () => {
    let stub = sinon.stub(axios, 'request', function (params) {
      params.should.deep.equal({
        url: 'https://api.vk.com/method/messages.send',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: querystring.stringify({
          access_token: 'fakeToken',
          user_id: 'fakeUserId',
          message: 'Кто там?'
        })
      });
    });

    await adapter.middleware({body: {
      type: 'message_new',
      object: {
        user_id: 'fakeUserId',
        body: 'Привет'
      }
    }}, {
      send: function (data) {
        data.should.equal('ok');
      },
      end: function () {}
    }, (err) => {
      err.should.be.null();
    });

    stub.restore();
  });
});
