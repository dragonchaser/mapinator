# Mapinator

Mapinator is (probably going to be) a handy tool for the gamemaster hosting pen and paper sessions (like D&D, Deadlands or Shadowrun).
The idea is that you have the map tinted on the gamemasters laptop and a map on a second screen (preferably embedded into the table) where only parts of the map is revealed to the players (aka fog of war).

**Note:** at the moment this is a very early stage and WIP so do not expect to much from it.

## Build dependencies

You need a current version of [nodeJS](https://nodejs.org/en/) installed.
I am developing with 10.16.0.

## Running

So far there is now stable release of the Mapinator. If you want to try it nethertheless you can run it using the following steps:

- Check out the code

  ```
  $> git clone https://github.com/dragonchaser/mapinator.git
  ```
- traverse into the directory

  ```
  $> cd mapinator
  ```
- install dependencies
  ```
  $> npm install
  ```

- run mapinator
  ```
  $> npm start
  ```

## What is working:

- loading maps from images and displaying them on both screens simultaniously
- zooming (controlled from gamemaster screen)

## What is not working (and what is WIP at the moment):

- scrolling map on players screen from gamemaster screen
- switching between different loaded maps
- unloading maps

## Roadmap
- fog of war (tinted on the gamemaster screen, opaque on the players screen)
- storing and loading sessions.
- (nice to have) ability to place markers (for entities, players, npc, etc.) on the map.
- customizable (hex-)grid
- stable release for windows, linux and (maybe) OSX

**Note:** The view in the game masters window is intentionally scaled down by 50%, this is not a bug.
