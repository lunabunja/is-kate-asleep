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

    // HACK: This is a bad way to do this as if someone nicks as her or she changes nicks this will not work. I gotta fix this sometime.
    if (members.filter(member => member.username == "katlyn").length >= 1) awake = true;

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