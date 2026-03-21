# Algalon

A Discord bot that monitors Blizzard's CDN for new World of Warcraft client builds and posts updates directly to your Discord server.

## Features

- Monitors Blizzard CDN for new WoW client builds (Retail, PTR, Beta, Classic, etc.)
- Sends notifications via Discord Webhooks

## Docker

### Build the image
```bash
docker build -t algalon .
```

### Run the container

#### Using an `.env` file (recommended)
```bash
docker run --env-file .env algalon
```

#### Setting environment variables manually
```bash
docker run \
  -e INTERVAL_IN_SEC=10 \
  -e WEBHOOK_URL="http://..." \
  algalon
```

#### Mounting a local `.env` file
```bash
docker run -v $(pwd)/.env:/app/.env algalon
```

## Credits

This project is a fork of [Algalon by Ellypse](https://github.com/Ellypse/Algalon).  
All credit goes to the original author for creating the initial bot and its features.