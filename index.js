'use strict';

const axios = require('axios');

axios.defaults.baseURL = 'https://api.vk.com/method/';

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
        let attachment = answer.attachment || '';

        await axios.post('messages.send', {
          access_token: token,
          user_id: userId,
          message: text,
          attachment: attachment
        });
    }
  };
};
