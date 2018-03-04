const axios = require('axios');
const querystring = require('querystring');

class Adapter {
  constructor (settings) {
    this.token = settings.token;
    this.groupId = settings.groupId;
    this.confirmCode = settings.confirmCode;
  }

  set bot (bot) {
    this.message = bot.message.bind(bot);
    bot.on('message', (message) => {
      axios.request({
        url: 'https://api.vk.com/method/messages.send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
          access_token: this.token,
          user_id: message.client.split('vk-')[1],
          message: message.text
        })
      });
    });
  }

  async middleware (req, res, next) {
    try {
      const {
        body
      } = req;

      switch (body.type) {
        case 'confirmation':
          if (body.group_id === this.groupId) {
            res.send(this.confirmCode);
          }
          break;

        case 'message_new':
          res.send('ok');

          await this.message({
            client: `vk-${body.object.user_id}`,
            text: body.object.body
          });
          break;
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Adapter;
