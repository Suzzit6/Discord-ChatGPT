require("dotenv").config();
const { Client, GatewayIntentBits, MessageEmbed } = require("discord.js");
const GenerateMessage = require("./distributor.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const chatBotName = process.env.NAME.toLowerCase();
const prefix = process.env.PREFIX.toLowerCase();




function normalizeCommand(content) {
  return content.toLowerCase().trim();
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    console.log("Message create ", message.content);
    if (message.author.bot) return;
   if (normalizeCommand(message.content).startsWith(`${prefix}${chatBotName}`)) {
     
     
    const guild = message.guild;

    // Fetch server details
    const serverName = guild.name;
    const totalMembers = guild.memberCount;
    const creationDate = guild.createdAt.toDateString();
    const owner = await guild.fetchOwner();
    const onlineMembers = guild.presences?.cache?.size || "Unknown"; // Requires PRESENCE intent
    const totalChannels = guild.channels.cache.size;
    const totalRoles = guild.roles.cache.size;
    
    // Reply with server information
    const serverInfo = `
    **Server Name:** ${serverName}
    **Total Members:** ${totalMembers}
    **Online Members:** ${onlineMembers}
    **Server Owner:** ${owner.user.tag}
    **Total Channels:** ${totalChannels}
    **Total Roles:** ${totalRoles}
    **Created On:** ${creationDate}
    `;
    
    const systemInstructions =
    process.env.SYSTEMINSTRUCTIONS +
    " Your (ChatBot) Name is " +
    process.env.NAME + "Server Info " + serverInfo + " Do not Always Put These server info In your message use it when asked to.  "

      console.log(`Received command from ${message.author.tag}`);
      // ai response using gemini
      result = await GenerateMessage(message.content, message.author,systemInstructions);
      console.log("result.response", result.response);
      message.reply(result.response);
    }

   if (normalizeCommand(message.content) === `${prefix}ping`) {
      message.reply("Pong!");
    }

    if (normalizeCommand(message.content) === `${prefix}help`) {
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
