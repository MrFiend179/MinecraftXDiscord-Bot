require('dotenv').config();
var mc = require('minecraft-protocol');
const Discord = require('discord.js');
const { EventEmitter } = require('events');
const chatEvents = new EventEmitter();
const client = new Discord.Client();

// U must enter ur bots token in "Bot token"
client.login('Bot token');
var mcClient = mc.createClient({
    host: "localhost",   
    port: 25565,         
    username: "F[Bot]",
    version: '1.16' 
  });
  mcClient.on('chat', function(packet) {
    console.log(packet)
    var jsonMsg = JSON.parse(packet.message);
    if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
      var username = jsonMsg.with[0].text;
      var msg = jsonMsg.with[1];
  
      if(username === mcClient.username) return;
      //mcClient.write('chat', {message: msg});
      chatEvents.emit('mcMessage',username, msg);
    }
  });
  
  
    
  client.on('ready', () =>{
    console.log(`Bot logged in with ${client.user.tag}`)
});

  client.on('message', (message) =>{
    if(message.author.bot) return;
    if(message.channel.id === 'Channel id')
    mcClient.write('chat', {
        message: `${message.author.username}#${message.author.discriminator}: ${message.content}`
       });
    console.log(`${message.author.username}#${message.author.discriminator}: ${message.content}`);

  });
  chatEvents.on('mcMessage', (username, msg) =>{
    console.log(`A msg was send by ${username} saying ${msg}`);
    let mcChannel = client.channels.cache.get('Channel id');
    mcChannel.send(`${username}: ${msg}`);
  });
// U must put same Discord channel id in bot channel id :)