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
    let stub = sinon.stub(axios, 'post', function (methodName, data) {
      methodName.should.equal('messages.send');
      data.should.deep.equal({
        access_token: 'fakeToken',
        user_id: 'fakeUserId',
        message: 'Кто там?',
        attachment: ''
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
