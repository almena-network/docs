# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Serve

```bash
yarn serve
```

This command serves the static content from the `build` directory using a local server.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.


## Docker

This project can be built and run using Docker and Docker Compose.

### Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later

### Build and Run with Docker Compose

Build and start the container:

```bash
docker-compose up --build
```

The site will be available at `http://localhost:3000`.

Run in detached mode (background):

```bash
docker-compose up -d --build
```

Stop the container:

```bash
docker-compose down
```

### Build and Run with Docker

Build the Docker image:

```bash
docker build -t almena-id-docs .
```

Run the container:

```bash
docker run -d -p 3000:3000 --name almena-id-docs almena-id-docs
```

Stop and remove the container:

```bash
docker stop almena-id-docs
docker rm almena-id-docs
```

## Dependencies

- [https://docusaurus.io/](https://docusaurus.io/)
- [https://undraw.co/](https://undraw.co/)
