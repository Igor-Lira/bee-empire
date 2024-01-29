# bee-empire

A strategy multiplayer game to expand your bee empire by attacking enemies corners.


## Tech notes

- Server has its own engine to handle collisions and compute fights between players.

- Server-Client communicated based on Websockets.

- Client draws world wtih Html canvas functionalities (to be improved). Every new frame is computed by the server.


## How to run this project

Run the server for developemnt (You need to have Node and NPM installed): 
```
npm install
```
```
npm run start
```
Run server using Docker (You need to have Docker installed): 
```
docker compose up --build
```

Then connect to the client (open the `index.html` file in a navigator)

## How to play

You start with your own hexagon populated with a small army of bees. Select your bees by draging the mouse over, then right click right where you want to move them.

Attack enemies by placing your bees next to the enemies walls. If enemy doesn't come to fight back for the wall, you will conquer it after a while. You also conquer all enemies bees inside the conquered hexagon.

Game finishes when a player conquers all walls in the world. When that happens, server resets.


- A blue delimited hexagon is a recent conquered hexagon that can't be attacked or cannot attack other hexagons.
- A red-violet delimieted wall is a wall uder attack.


# How to contribute

Comment in the issue saying you're currently working on it to let me assign to you.
Fork the project:


`git fork https://github.com/Igor-Lira/bee-empire.git`

Create a new branch and commit your modifications. Flag the issue number in your commit message: 


`[#3]: update the move bee logic to avoid collisions`

Push your branch to your fork project and do a Pull Request
