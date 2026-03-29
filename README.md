# Adventure Game (cat-game)

A browser-based 2D canvas game: tiled map background, player movement, and NPC cats.

## How to run

The game is plain HTML, CSS, and JavaScript—no `npm install` or build step.

1. **Open a terminal**, clone or `cd` into this repository, then enter the game folder (its name includes a space, so quote the path):

   ```bash
   cd "project (2)"
   ```

2. **Serve the folder over HTTP.** Loading assets from `file://` URLs is unreliable in many browsers, so use a small static server. For example:

   ```bash
   python3 -m http.server 8080
   ```

   Or, if you have [Node.js](https://nodejs.org/) and prefer `npx`:

   ```bash
   npx --yes serve -l 8080
   ```

3. **Open the game** in your browser:

   ```text
   http://localhost:8080/index.html
   ```

**Controls:** `W`, `A`, `S`, `D` to move.

---

## Where the map comes from

- **Layer data** lives under `project (2)/data/` as JavaScript arrays:
  - `l_New_Layer_1.js` … `l_New_Layer_6.js` — tile index grids for each map layer
  - `collisions.js` — collision grid (`1` = solid block) used by `js/index.js` and the player
- **Rendering** is wired in `project (2)/js/index.js`: each layer name is paired with a tileset image and 16×16 tile size.
- **Tileset images** are expected at `project (2)/images/`:
  - `terrain.png`
  - `decorations.png`
  - `characters.png`

The layer filenames and numeric tile IDs match a typical workflow where a map is built in a tile map editor (for example [Tiled](https://www.mapeditor.org/)), then exported or copied into these `.js` files. The repo may not include the original `.tmx` / project file—only the exported data the game loads.

---

## Where the sprites come from

- **Player** (`project (2)/classes/Player.js`) draws from `./images/walk.png` (walk cycle in four directions).
- **Cats in boxes** (`project (2)/js/index.js` + `classes/BoxCat.js`) use `./images/Box3.png` and `./images/JumpCattt.png`.

**LPC / character generator:** Under `sprites/lpc_male_animations_2025-04-03T18-44-09/`, `character.json` records that the base asset was produced with the **[Universal LPC Spritesheet Character Generator](https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/)** (Liberated Pixel Cup ecosystem). The same folder’s `credits/metadata.json` and embedded credit entries list authors, licenses (e.g. CC0, OGA-BY, CC-BY-SA, GPL—see those files for exact terms per asset), and links to OpenGameArt.org sources.

The runnable game expects processed sheets in `project (2)/images/` (for example `walk.png`); the `sprites/` directory holds the export bundle and attribution for the LPC-based character work.
