require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const GenerateMessage = require('./distributor.js');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const chatBotName = process.env.NAME

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  console.log("Message create ", message.content)
  if (message.content.startsWith(`!${chatBotName}`)) {
    console.log(`Received command from ${message.author.tag}`);
    result = await GenerateMessage(message.content, message.author);
    console.log("result.response",result.response);
    message.reply(result.response);
  }
});

client.login(process.env.DISCORD_TOKEN);
