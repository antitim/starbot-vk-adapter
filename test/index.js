'use strict';

require('chai').should();
const sinon = require('sinon');
const botControl = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');

describe('Vk Adapter', () => {
  let bot = botControl({
    message: 'Кто там?'
  });

  let vk = new Adapter({
    token: 'fakeToken',
    groupId: 'fakeGroupId',
    confirmCode: 'fakeConfirmCode'
  }, bot);

  it('confirmation', async () => {
    await vk.receiver({body: {
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
    let stub = sinon.stub(axios, 'get', function (methodName, params) {
      methodName.should.equal('messages.send');
      params.should.deep.equal({
        params: {
          access_token: 'fakeToken',
          user_id: 'fakeUserId',
          message: 'Кто там?',
          attachment: ''
        }
      });
    });

    await vk.receiver({body: {
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
