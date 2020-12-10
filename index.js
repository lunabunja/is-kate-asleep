/*
 * Copyright (c) 2020 sanana the skenana and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');

module.exports = class SleeperNoSleeping extends Plugin {
  base = {
    send: false,
    result: 'Something has gone wrong...'
  }

  sleep = async (args) => {
    // HACK: Kate is in Customa and Customa has widgets on.
    let { members } = await get('https://discord.com/api/v8/guilds/476844593896226816/widget.json').then(r => r.body);
    if (!members) return this.base;
    
    let awake = false;
    let name = "Kate"
    let person =  members.filter(member => member.avatar_url == "https://cdn.discordapp.com/widget-avatars/2uCBLIlJEJij46l1OQiMNSgtWFQDlXLeaOYtgjhS2cw/NzDGQponSt7zB5zzzKzM8zMBcYUIL1XpD55kw2pV4oyJG7fBVB8pmoiVMfPjgnn9vGr9ribt4ZCIc6D0nO_TtI0EJzfTo-StbRk3iaj6Xl1lMesR9F93qOUoIcy5c0vpJBlK-CCbv8iw8w")[0];

    // HACK: This is a bad way to do this as if she changes avatars this will not work. I gotta fix this sometime.
    if(args[0]){
      switch(args[0].toLowerCase()) {
      case "emma":
        name = "emma 🌺"
        person = members.filter(member => member.username === "emma 🌺")[0];
        break;
      
      case "bowser":
        name = "Bowser"
        person = members.filter(member => member.avatar_url === "https://cdn.discordapp.com/widget-avatars/E37679PGTHUwSWNtH13rUI2qj0aw11Pp-MNvm3NQ46Y/Kis9InZABkbpZ8l5LS6apzh-i-ofBbLynoA-L8x0CLGqngX_qi9VQXTlvjwHpFk4MstDw5SggO0R1q7mR52zgbw4d7CLwU_XFuJfK0ipFKbDIX_QNaj8pGLsvKmejpegeBnBzEc-KGTp")[0];
        break;
      

      case "aeth":
        name = "Aeth"
        person = members.filter(member => member.username === "aetheryx")[0];
        break;

      case "ben":
        name = "Ben"
        person = members.filter(member => member.username === "Ben")[0]; // I will change my avatart but not my nick
        break;
     }
    }
    
    awake = person?.status === "online";

    return {
      ...this.base,
      result: `${name} is ${awake ? "awake" : "asleep"}.`
    };
  }

  startPlugin() {
    powercord.api.commands.registerCommand({
      command: 'sleepstatus',
      description: 'Is Kate Sleeping?',
      usage: '{c} <person>',
      executor: (args) => this.sleep(args),
      autocomplete: (args) => {
        if (args[1] === void 0) {
          return {
            header: "Whos sleeping?",
            commands: [
              {
                command: "Kate"
              }, {
                command: "emma"
              }, {
                command: "Aeth"
              }, {
                command: "Bowser"
              }, {
                command: "Ben"
              }
            ].filter(({ command }) => command.toLowerCase().includes(args[0]?.toLowerCase()))
          };
        }
      }
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand('sleepstatus');
  }
}
