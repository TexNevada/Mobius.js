const { MessageEmbed } = require('discord.js');

module.exports = class Membed extends MessageEmbed {
	constructor() {
		super();
		this.setThumbnail('https://cdn.edb.tools/MODUS_Project/images/Enclave/Enclave.png')
			.setColor('AQUA');
	}
};