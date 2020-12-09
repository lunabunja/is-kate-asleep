const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');

module.exports = class SleeperNoSleeping extends Plugin {
  base = {
    send: false,
    result: 'Something has gone wrong...'
  }

  sleep = async () => {
    let awake;

    // HACK: Kate is in Customa and Customa has widgets on.
    let { members } = await get('https://discord.com/api/v8/guilds/476844593896226816/widget.json').then(r => r.body);

    if (!members) return this.base;

    // HACK: This is a bad way to do this as if she changes avatars this will not work. I gotta fix this sometime.
    if (members.filter(member => member.avatar_url == "https://cdn.discordapp.com/widget-avatars/2uCBLIlJEJij46l1OQiMNSgtWFQDlXLeaOYtgjhS2cw/NzDGQponSt7zB5zzzKzM8zMBcYUIL1XpD55kw2pV4oyJG7fBVB8pmoiVMfPjgnn9vGr9ribt4ZCIc6D0nO_TtI0EJzfTo-StbRk3iaj6Xl1lMesR9F93qOUoIcy5c0vpJBlK-CCbv8iw8w").length >= 1) awake = true;

    return {
      ...this.base,
      result: `Kate is ${awake ? "awake" : "asleep"}.`
    };
  }

  startPlugin() {
    powercord.api.commands.registerCommand({
      command: 'sleepstatus',
      description: 'Is Kate Sleeping?',
      usage: '{c}',
      executor: this.sleep
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand('sleepstatus');
  }
}