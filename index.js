const Discord = require('discord.js')
global.client = new Discord.Client({
    intents: 32767
})

const { token } = require('./config.json')
const moment = require('moment')
const fs = require('fs')
const ms = require('ms')

client.login(token)

client.on("ready", () => {
    console.log("Online")
    client.user.setActivity('CityHub', { type: 'PLAYING' });
})

client.commands = new Discord.Collection();

const commandsFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const eventsFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventsFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args))
}

client.on("message", message => {
    const prefix = "c!";

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) return

    var comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

    if (comando.onlyStaff) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send("Non hai il permesso di eseguire questo comando")
            return
        }
    }

    comando.execute(message, args, client);
})

client.on("messageCreate", message => {
    if (message.content == "c!tset-panel") {
        message.delete()
        var panel = new Discord.MessageEmbed()
        .setTitle("🎫 | TICKET | 🎫")
        .setDescription("✌Ciao, 🤔clicca qui sotto uno di questi due bottoni,\na seconda di quello che desideri!\n\n⚠Attenzione, non aprire ticket senza motivo, se lo farai lo Staff prenderà provvedimenti!")
        .setColor("DARK_RED")
        .setImage("https://cdn.discordapp.com/attachments/955202467073777784/955204750381551666/Ticket.png")
        .setThumbnail("https://cdn.discordapp.com/attachments/955123373481033808/955125166088794132/CityHub.png")
        .setFooter({ text: "🚑Supporto ticket."})

        let supporto = new Discord.MessageButton()
        .setLabel("Assistenza")
        .setEmoji("❕")
        .setCustomId("supporto")
        .setStyle("DANGER")

        let partner = new Discord.MessageButton()
        .setLabel("Partnership")
        .setEmoji("🤝")
        .setCustomId("partner")
        .setStyle("SUCCESS")

        const row = new Discord.MessageActionRow()
        .addComponents(supporto, partner)

        message.channel.send({ embeds: [panel], components: [row] })
    }
})

client.on("interactionCreate", interaction => {
    if (interaction.customId == "supporto") {
        interaction.deferUpdate()
        var giaopen = new Discord.MessageEmbed()
        .setTitle("❌ERROR")
        .setColor("YELLOW")
        .setDescription("Hai gia un ticket aperto. 1/1")
        .setFooter({text: "Puoi aprire un ticket alla volta!"})
        if (interaction.guild.channels.cache.find(ch => ch.topic == `ID Utente: ${interaction.user.id}`)) {
            interaction.user.send({embeds: [giaopen]}).catch(() => { })
            return
        }
        interaction.guild.channels.create(`・❗┃ticket-${interaction.user.username}`, {
            type: "text",
            topic: `ID Utente: ${interaction.user.id}`,
            parent: "955223832992559104", //Settare la categoria,
            permissionOverwrites: [ 
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL"]
                },
                { //id ruolo staff
                    id: "948270141555241010",
                    allow: ["VIEW_CHANNEL"]
                },
                { //id ruolo t.staff
                    id: "948270153781633025",
                    allow: ["VIEW_CHANNEL"]
                }
            ]
        }).then(ch => {


        var ticketaperto = new Discord.MessageEmbed()
        .setTitle("🖐TICKET APERTO")
        .setDescription(`✌Ciao, ⌚aspetta la risposta di un nostro membro dello Staff,\n📝Intando inizia a scrivere in cosa ti dovremmo aiutare,`)
        .setColor("DARK_RED")

        let closed = new Discord.MessageButton()
        .setLabel("Close")
        .setStyle("DANGER")
        .setCustomId("close")
        let transcript = new Discord.MessageButton()
        .setLabel("Transcript")
        .setStyle("SECONDARY")
        .setCustomId("transcript")
        .setDisabled()
        let buttonClose = new Discord.MessageActionRow()
        .addComponents(closed, transcript)

      ch.send({ embeds: [ticketaperto], components: [buttonClose] })
          })
    }
})

client.on("interactionCreate", interaction => {
    if (interaction.customId == "partner") {
        interaction.deferUpdate()
        var giaopen = new Discord.MessageEmbed()
        .setTitle("❌ERROR")
        .setColor("YELLOW")
        .setDescription("Hai gia un ticket aperto. 1/1")
        .setFooter({text: "Puoi aprire un ticket alla volta!"})
        if (interaction.guild.channels.cache.find(ch => ch.topic == `ID Utente: ${interaction.user.id}`)) {
            interaction.user.send({embeds: [giaopen]}).catch(() => { })
            return
        }
        interaction.guild.channels.create(`・🤝┃ticket-${interaction.user.username}`, {
            type: "text",
            topic: `ID Utente: ${interaction.user.id}`,
            parent: "955223832992559104", //Settare la categoria,
            permissionOverwrites: [ 
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL"]
                },
                { //id ruolo staff
                    id: "948270141555241010",
                    allow: ["VIEW_CHANNEL"]
                },
                { //id ruolo t.staff
                    id: "948270153781633025",
                    allow: ["VIEW_CHANNEL"]
                }
            ]
        }).then(ch => {


        var ticketaperto = new Discord.MessageEmbed()
        .setTitle("🖐TICKET APERTO")
        .setDescription(`✌Ciao, ⌚aspetta la risposta di un nostro membro dello Staff,\n📝Appena ti risponderanno mandagli in privato il link di invito del tuo server.\n\n⚠Attenzione, devi rispettare i requisiti!.`)
        .setColor("GOLD")

        let closed = new Discord.MessageButton()
        .setLabel("Close")
        .setStyle("DANGER")
        .setCustomId("close1")
        let transcript = new Discord.MessageButton()
        .setLabel("Transcript")
        .setStyle("SECONDARY")
        .setCustomId("transcript1")
        .setDisabled()
        let buttonClose = new Discord.MessageActionRow()
        .addComponents(closed, transcript)

      ch.send({ embeds: [ticketaperto], components: [buttonClose] })
          })
    }
})

client.on("interactionCreate", interaction => {
    if (interaction.customId == "close") {
        interaction.deferUpdate()
        interaction.channel.delete()
    }
})

client.on("interactionCreate", interaction => {
    if (interaction.customId == "close1") {
        interaction.deferUpdate()
        interaction.channel.delete()
    }
})
/*
client.on("interactionCreate", interaction => {
    if (interaction.customId == "transcript1") {
        interaction.deferUpdate()

    }
})

client.on("interactionCreate", interaction => {
    if (interaction.customId == "transcript") {
        interaction.deferUpdate()

    }
})
*/