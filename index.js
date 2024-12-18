require("dotenv").config();
const { Client, GatewayIntentBits,MessageEmbed } = require("discord.js");
const GenerateMessage = require("./distributor.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const chatBotName = process.env.NAME;
const prefix = process.env.PREFIX;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    console.log("Message create ", message.content);
    if (message.author.bot) return;
    if (message.content.startsWith(`${prefix}${chatBotName}`)) {
      console.log(`Received command from ${message.author.tag}`);
      // ai response using gemini
      result = await GenerateMessage(message.content, message.author);
      console.log("result.response", result.response);
      message.reply(result.response);
    }

    if (message.content === `${prefix}ping`) {
      message.reply("Pong!");
    }

    if (message.content === `${prefix}help`) {
      const helpEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Help Commands")
        .setDescription("To interact with me, use the following commands:")
        .addFields(
          {
            name: `${prefix}${chatBotName} <message>`,
            value: "I will respond with a message based on your input.",
          },
          { name: `${prefix}ping`, value: 'I will respond with "Pong!".' },
          {
            name: `${prefix}help`,
            value: "I will provide you with a list of commands.",
          }
        )
        .setFooter("Bot Help");

      message.reply({ embeds: [helpEmbed] });
    }
  } catch (error) {
    console.error("Error in message create", error);
    message.reply("I encountered an issue. Please try again later.");
  }
});

client.login(process.env.DISCORD_TOKEN);
