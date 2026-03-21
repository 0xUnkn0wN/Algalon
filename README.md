# Algalon

A Discord bot that monitors Blizzard's CDN for new World of Warcraft client builds and posts updates directly to your Discord server.

## Features

- Monitors Blizzard CDN for new WoW client builds (Retail, PTR, Beta, Classic, etc.)
- Sends notifications via Discord Webhooks

## Docker

### Run the container

#### Using an `.env` file (recommended)
```bash
docker run --env-file .env ghcr.io/0xunkn0wn/algalon@sha256:e8ddb9c7791eb98a19a0b86be60b27ad2f484617aa36360414352d4f34619141
```

#### Setting environment variables manually
```bash
docker run \
  -e INTERVAL_IN_SEC=10 \
  -e WEBHOOK_URL="http://..." \
  ghcr.io/0xunkn0wn/algalon@sha256:e8ddb9c7791eb98a19a0b86be60b27ad2f484617aa36360414352d4f34619141
```

#### Mounting a local `.env` file
```bash
docker run -v $(pwd)/.env:/app/.env ghcr.io/0xunkn0wn/algalon@sha256:e8ddb9c7791eb98a19a0b86be60b27ad2f484617aa36360414352d4f34619141
```

## Credits

This project is a fork of [Algalon by Ellypse](https://github.com/Ellypse/Algalon).  
All credit goes to the original author for creating the initial bot and its features.