const fs = require('fs');
const Sequelize = require('sequelize');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

const watched_folders = [];

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load Commands
client.commands = new Collection();
function loadCommands(folder) {
	const commandFiles = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}

	// Watch Folder for changes and reload
	if (watched_folders.indexOf(folder) < 0) {
		fs.watch(folder, (eventType, filename)=> {
			console.log(`Reloaded Command Folder: ${folder}`);
			delete require.cache[require.resolve(`./${folder}/${filename}`)];
			loadCommands(folder);
		});
		watched_folders.push(folder);
	}
}
loadCommands('commands');


// Load Events
function loadEvents(folder) {
	const eventFiles = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./${folder}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	// Watch Folder for changes and reload
	if (watched_folders.indexOf(folder) < 0) {
		fs.watch(folder, (eventType, filename)=> {
			console.log(`Reloaded Event Folder: ${folder}`);
			delete require.cache[require.resolve(`./${folder}/${filename}`)];
			loadEvents(folder);
		});
		watched_folders.push(folder);
	}
}
loadEvents('events');


// Database Setup
const sequelize = new Sequelize('database/database.db', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


// Slash Command Handling
client.on('interactionCreate', async interaction => {
	console.log(interaction);
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		if (interaction.options._subcommand && interaction.options._subcommand in command) {
			await command[interaction.options._subcommand](interaction);
		} else {
			await command.execute(interaction);
		}
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


// Login to Discord with your client's token
client.login(token);