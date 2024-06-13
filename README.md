# Folder structure

- `src` - source code for your kaboom project
- `www` - distribution folder, contains your index.html, built js bundle and static assets


## Development

```sh
$ npm run dev
```

will start a dev server at http://localhost:8000

## Distribution

```sh
$ npm run build
```

will build your js files into `www/main.js`

```sh
$ npm run bundle
```

will build your game and package into a .zip file, you can upload to your server or itch.io / newground etc.# flappyBird
# flappyBird

# Flappy Bird Clone with Kaboom.js

Welcome to the Flappy Bird Clone built with [Kaboom.js](https://kaboomjs.com/)! This project is a simple recreation of the classic Flappy Bird game using the Kaboom.js game development library.

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the Repository:**
```sh
   git clone https://github.com/anasattaullah/flappyBird
   cd flappybird
```

2.**Install NPM Packages:**

```sh
npm install
```

## Usage
To start the development server and play the game locally, follow these steps:
1.**Run the Development Server:**
```sh
npm run dev
```

### Building

To build the project for production, run:

```sh
npm run build
```
### Bundling

To create a zip archive of the project, run:
```sh
npm run bundle
```
This will build the project and create a dist/game.zip file, excluding any .DS_Store files.
