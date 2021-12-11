// Mobius bot
//
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const { token, clientID, DevGuildID, SlashType } = require('./dependencies/configs/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

//
// Reads Commands
//
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./dependencies/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./dependencies/commands/${file}`);
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//
// Reads Events
//
const eventFiles = fs.readdirSync('./dependencies/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./dependencies/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//
// Deploys commands
//
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing Slash (/) commands.');

		if (SlashType == 'Guild') {
			console.log('Refreshing Guild Slash (/) commands.');
			await rest.put(
				Routes.applicationGuildCommands(clientID, DevGuildID),
				{ body: commands },
			);
		}
		else {
			console.log('Refreshing Global Slash (/) commands.');
			await rest.put(
				Routes.applicationCommands(clientID),
				{ body: commands },
			);
		}


		console.log('Successfully reloaded Slash (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

client.login(token);