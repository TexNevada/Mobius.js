const { SlashCommandBuilder } = require('@discordjs/builders');
const { View, parse } = require('vega');
const sharp = require('sharp');
const fs = require('fs');
const {MessageAttachment, MessageEmbed} = require("discord.js");

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    console.log(result)
    return result;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('chart')
        .setDescription('Testing the chart thingy'),
    async execute(interaction) {
        const jsonData = require('../assets/vega-schema.json.json')
        /*
         * Data handling
         */

        // get the join dates of each member in guild
        let members = await interaction.guild.members.fetch()
        let dateValues = members.map(function (member) {
            const date = member.joinedAt
            const year = date.getUTCFullYear()
            const month = date.getUTCMonth() + 1
            return `${year}.${month}`
        })
        // count how many members joined each month
        let dateCount = {}
        for (let value of dateValues) {
            if (dateCount[value] == null) dateCount[value] = 1;
            else dateCount[value] = dateCount[value] + 1;
        }

        // append the data to the chart
        const data = [];
        for (let date in dateCount) {
            data.push({'x': date, 'y': dateCount[date]})
        }
        jsonData.data = [
            {
                "name": "table",
                "values": data
            }
        ]


        /*
         * Charting and sending the data
         */
            // create the chart
        const chartId = makeId(8)
        const view = new View(parse(jsonData))
            .renderer('none')

        // convert chart to svg
        view.toSVG().then(async function (svg) {
            // save chart as png
            await sharp(Buffer.from(svg))
                .toFormat('png')
                .toFile(`chart-${chartId}.png`)

            // send the png
            const chart = new MessageAttachment(`../App/chart-${chartId}.png`, `chart-${chartId}.png`)

            const embed = new MessageEmbed()
                .setColor('#E74C3C')
                .setTitle('Members join date throughout time')
                .setImage(`attachment://chart-${chartId}.png`)

            await interaction.reply({ files: [chart], embeds: [embed] })

            // delete the png
            fs.unlink(`../App/chart-${chartId}.png`, (err => {
                if (err) console.log(err)
                else console.log("File deleted")
            }))


        }).catch(function(err) {
            console.error(err);
        });

    },
};