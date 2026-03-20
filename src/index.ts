import * as http from 'http';
import { WebhookClient } from 'discord.js';
import { type Version } from './types';
import { VERSIONS } from './version';
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

            res.on('end', () => {
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
                        client.send(`Now observing CDN for client: ${version}. Current build: ${buildText} (${buildNumber})`);

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
                            client.send(`A new client build for ${version} was released on Blizzard's CDN: ${buildText} (${buildNumber})`);

                            const v: Version = {
                                Number: version,
                                Build: Number(buildNumber),
                                Text: buildText
                            }

                            clients.set(version, v);
                        }
                        else {
                            if (DEBUG) client.send(`Now new client build found for ${version}.`);
                        }
                    }
                } catch (err) {
                    client.send("ERROR: " + JSON.stringify(err));
                }
            });
        });
    })
}

fetchCDN();

// interval in config is provided in seconds
setInterval(fetchCDN, 10 * 1000); // configJSON.interval * 1000);