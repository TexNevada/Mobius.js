const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientID, DevGuildID } = require('./dependencies/configs/config.json');

const commands = [];
const commandFiles = fs.readdirSync('./dependencies/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./dependencies/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientID, DevGuildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);