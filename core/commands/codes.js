const { SlashCommandBuilder } = require('@discordjs/builders');
const { NukaCryptAPI } = require('../config.json');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Discord = require('discord.js');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('codes')
		.setDescription('Provides the Nuke Codes for this week'),

	// Is executed when the command is called.
	async execute(interaction) {

		if (interaction.guild) {
			console.log(`A user requested "nuke codes" in "${interaction.guild.name}"`);
		} else {
			console.log('A user requested "nuke codes" in a private message');
		}


		function listener() {
			const codeContent = JSON.parse(this.responseText);
			console.log(codeContent);
			const embed = new Discord.MessageEmbed()
				.setColor(0xe7e9d3)
				.setTitle('Fallout 76 Nuclear Codes')
				.setFooter('Nuke codes are provided by our partner at https://nukacrypt.com/')
				.setThumbnail('https://cdn.edb.tools/MODUS_Project/images/Enclave/Enclave.png')
				.addField('This week\'s nuclear codes', `Nuke codes reset every Wednesday at 5 PM PST / 12 Midnight GMT/UTC\n**Alpha**: ${codeContent['ALPHA']}\n**Bravo**: ${codeContent['BRAVO']}\n**Charlie**: ${codeContent['CHARLIE']}`)
				.addField('Want nuke codes in your own server?', 'Nuke Codes Command | Add MODUS to your server! [Click here to read more](https://discord.com/oauth2/authorize?client_id=532591107553624084&permissions=1879960790&scope=bot)', false);
			interaction.reply({ embeds: [embed] });

		}


		try {
			const url = 'https://nukacrypt.com/api/codes';
			const http = new XMLHttpRequest();
			http.addEventListener('load', listener);
			http.open('GET', url);
			http.setRequestHeader('apikey', NukaCryptAPI['apikey']);
			http.send();
		} catch (err) {
			console.log(err);
		}


	},
};