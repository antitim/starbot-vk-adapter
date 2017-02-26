'use strict';

const axios = require('axios');

axios.defaults.baseURL = 'https://api.vk.com/method/';

module.exports = class VkAdapter {

  constructor (options, botControl) {
    let self = this;

    self.token = options.token;
    self.groupId = options.groupId;
    self.confirmCode = options.confirmCode;

    self.botControl = botControl;

    self.receiver = async function (req, res) {
      let body = req.body;

      switch (body.type) {
        case 'confirmation':
          if (body.group_id === self.groupId) {
            res.send(self.confirmCode);
          }

          break;

        case 'message_new':
          res.send('ok');

          let message = body.object;

          let userId = 'vk_' + message.user_id;
          let text = message.body;

          let answer = await self.botControl(userId, text);

          userId = answer.userId.split('vk_')[1];
          text = answer.text;
          let attachment = options.attachment || '';

          axios.get('messages.send', {
            params: {
              access_token: self.token,
              user_id: userId,
              message: text,
              attachment: attachment
            }
          }).catch(function (error) {
            console.log(error);
          });

          break;
      }

      res.end();
    };
  }
};
