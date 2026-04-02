const {
Client,
GatewayIntentBits,
EmbedBuilder,
ButtonBuilder,
ButtonStyle,
ActionRowBuilder,
ModalBuilder,
TextInputBuilder,
TextInputStyle
} = require("discord.js")

const { Client: SelfClient } = require("discord.js-selfbot-v13")
const fs = require("fs")

const BOT_TOKEN = process.env.BOT_TOKEN
const USER_TOKEN = process.env.USER_TOKEN
const CHANNEL = process.env.CHANNEL

const client = new Client({
intents: [GatewayIntentBits.Guilds]
})

const self = new SelfClient()

self.on("ready", () => {
console.log("Personal Account Ready")
})

client.once("ready", async () => {

console.log("OTP Bot Ready")

const channel = await client.channels.fetch(CHANNEL)

const embed = new EmbedBuilder()
.setTitle("OTP System")
.setDescription("Press OTP to request")
.setColor("Blue")

const button = new ButtonBuilder()
.setCustomId("otp")
.setLabel("OTP")
.setStyle(ButtonStyle.Primary)

const row = new ActionRowBuilder().addComponents(button)

channel.send({
embeds: [embed],
components: [row]
})

})

client.on("interactionCreate", async interaction => {

if (interaction.isButton()) {

if (interaction.customId === "otp") {

const modal = new ModalBuilder()
.setCustomId("emailModal")
.setTitle("OTP Request")

const input = new TextInputBuilder()
.setCustomId("email")
.setLabel("Enter Email")
.setStyle(TextInputStyle.Short)

const row = new ActionRowBuilder().addComponents(input)

modal.addComponents(row)

await interaction.showModal(modal)

}

}

if (interaction.isModalSubmit()) {

if (interaction.customId === "emailModal") {

const email = interaction.fields.getTextInputValue("email").trim()

let emails = fs.readFileSync("emails.txt", "utf8")
.split("\n")
.map(e => e.trim())
.filter(Boolean)

if (!emails.includes(email)) {

return interaction.reply({
content: "Invalid or Already Used Email",
ephemeral: true
})

}

// remove email (one time use)
emails = emails.filter(e => e !== email)

// save updated list
fs.writeFileSync("emails.txt", emails.join("\n"))

// find server
const guild = self.guilds.cache.find(g => g.name === "wink's server")

// find channel
const channel = guild.channels.cache.find(c => c.name === "general")

// send slash command
channel.send(`/transfer <@${interaction.user.id}> 0.1`)

interaction.reply({
content: "Balance Transfered Now use OTP Bot.",
ephemeral: true
})

}

}

})

client.login(BOT_TOKEN)
self.login(USER_TOKEN)
