'use strict';

require('chai').should();
const sinon = require('sinon');
const botControl = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');
const querystring = require('querystring');

describe('Vk Adapter', () => {
  let bot = botControl({
    message: 'Кто там?'
  });

  let vk = Adapter({
    token: 'fakeToken',
    groupId: 'fakeGroupId',
    confirmCode: 'fakeConfirmCode'
  }, bot);

  it('confirmation', async () => {
    await vk({body: {
      type: 'confirmation',
      group_id: 'fakeGroupId'
    }}, {
      send: function (data) {
        data.should.equal('fakeConfirmCode');
      },
      end: function () {}
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

    await vk({body: {
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
    });

    stub.restore();
  });
});
