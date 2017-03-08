'use strict';

const axios = require('axios');
const querystring = require('querystring');

module.exports = function (settings, botControl) {
  let { token, groupId, confirmCode } = settings || {};

  return async (req, res) => {
    let body = req.body;

    switch (body.type) {
      case 'confirmation':
        if (body.group_id === groupId) {
          res.send(confirmCode);
          res.end();
        }

        break;

      case 'message_new':
        res.send('ok');
        res.end();

        let message = body.object;

        let userId = 'vk_' + message.user_id;
        let text = message.body;

        let answer = await botControl(userId, text);

        userId = answer.userId.split('vk_')[1];
        text = answer.text;

        await axios.request({
          url: 'https://api.vk.com/method/messages.send',
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: querystring.stringify({
            access_token: token,
            user_id: userId,
            message: text
          })
        });
    }
  };
};
