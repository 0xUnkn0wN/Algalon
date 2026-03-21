import * as http from 'http';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { type Version } from './types';
import { VERSIONS } from './versions';
import config from '../config.json';

const client = new WebhookClient({
    url: config.webhook,
})

const URL = "http://us.patch.battle.net:1119/";

const DEBUG = false;

const clients: Map<string, Version> = new Map();

function fetchCDN() {
    if (DEBUG) {
        client.send("Fetching Blizzard CDN for new versions");
    }

    VERSIONS.map(({ url_param, version }) => {
        http.get(URL + url_param + "/versions", (res: http.IncomingMessage) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', async () => {
                try {
                    if (DEBUG) client.send(`Received results for ${version}`);

                    let buildNumber, buildText: string = "";

                    let r = body.split('\n')[2];
                    if (r) {
                        const data = r.split("|");
                        if (data.length >= 5) {
                            buildNumber = data[4]!;
                            buildText = data[5]!.replace("." + buildNumber, "");
                        }
                    }


                    if (!clients.has(version)) {
                       const embed = new EmbedBuilder()
                            .setTitle(`Observing CDN for ${version}`)
                            .setDescription(`Now observing Blizzard's CDN for new client builds.`)
                            .addFields(
                                { name: "Version", value: version!, inline: true },
                                { name: "Current Build", value: buildText!, inline: true },
                                { name: "Build Number", value: buildNumber!, inline: true }
                            )
                            .setColor(0xFFA500)
                            .setTimestamp()
                            .setFooter({ text: "Blizzard CDN Monitor", iconURL: "https://upload.wikimedia.org/wikipedia/en/5/5e/Blizzard_Entertainment_Logo.svg" });

                        await client.send({ embeds: [embed] });

                        const v: Version = {
                            Number: version,
                            Build: Number(buildNumber),
                            Text: buildText
                        }

                        clients.set(version, v);
                    }
                    else {
                        let found = clients.get(version)!;

                        console.log(found.Number, found.Build, buildNumber, buildText)
                        if (found.Number && found.Build < Number(buildNumber)) {
                            const embed = new EmbedBuilder()
                                .setTitle(`New ${version} Build Released!`)
                                .setDescription(`A new client build has been released on Blizzard's CDN.`)
                                .addFields(
                                    { name: "Version", value: version!, inline: true },
                                    { name: "Build", value: buildText!, inline: true },
                                    { name: "Build Number", value: buildNumber!, inline: true }
                                )
                                .setColor(0x00AE86)
                                .setTimestamp()
                                .setFooter({ text: "Blizzard CDN Monitor", iconURL: "https://upload.wikimedia.org/wikipedia/en/5/5e/Blizzard_Entertainment_Logo.svg" });

                            await client.send({ embeds: [embed] });

                            const v: Version = {
                                Number: version,
                                Build: Number(buildNumber),
                                Text: buildText
                            }

                            clients.set(version, v);
                        }
                    }
                } catch (err) {
                    console.log("Error: %d", JSON.stringify(err))
                }
            });
        });
    })
}

fetchCDN();

// interval in config is provided in seconds
setInterval(fetchCDN, 10 * 1000); // configJSON.interval * 1000);