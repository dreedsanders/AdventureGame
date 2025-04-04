const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

const map_cols = 40;
const map_rows = 40;
const tile_size = 16;

const map_width = tile_size * map_cols;
const map_height = tile_size * map_rows;

const MAP_SCALE = dpr + 3;

const view_width = canvas.width / MAP_SCALE;
const view_height = canvas.height / MAP_SCALE;

const view_center_y = view_height / 2;
const view_center_x = view_width / 2;

const max_scroll_y = map_height - view_height;
const max_scroll_x = map_width - view_width;

const layersData = {
  l_New_Layer_1: l_New_Layer_1,
  l_New_Layer_5: l_New_Layer_5,
  l_New_Layer_2: l_New_Layer_2,
  l_New_Layer_3: l_New_Layer_3,
  l_New_Layer_4: l_New_Layer_4,
  l_New_Layer_6: l_New_Layer_6,
};

const tilesets = {
  l_New_Layer_1: { imageUrl: "./images/terrain.png", tileSize: 16 },
  l_New_Layer_5: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_2: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_New_Layer_3: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_New_Layer_4: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_New_Layer_6: { imageUrl: "./images/terrain.png", tileSize: 16 },
};

// Tile setup
const collisionBlocks = [];
const blockSize = 16; // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      );
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX =
          ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize;
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize;

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16 // destination width, height
        );
      }
    });
  });
};

const renderStaticLayers = async () => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenContext = offscreenCanvas.getContext("2d");

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        );
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error);
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas;
};
// END - Tile setup

// animal set up

const boxCat = [
  new BoxCat({
    x: 200,
    y: 170,
    size: 15,
    imageSrc: "./images/Box3.png",
  }),
  new BoxCat({
    x: 120,
    y: 190,
    size: 15,
    imageSrc: "./images/JumpCattt.png",
  }),
];

// set up pet cat that follows

// const pet =
//   new Pet({
//     x: 200,
//     y: 170,
//     size: 15,
//     imageSrc: "./images/JumpCattt.png",
//   });
// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 20,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastTime = performance.now();
function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  console.log(deltaTime);
  lastTime = currentTime;

  // Update player position
  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  const horizontalScroll = Math.min(
    Math.max(0, player.center.x - view_center_x),
    max_scroll_x
  );
  const verticalScroll = Math.min(
    Math.max(0, player.center.y - view_center_y),
    max_scroll_y
  );

  // Render scene
  c.save();
  c.scale(MAP_SCALE, MAP_SCALE);
  c.translate(
    -Math.min(horizontalScroll, max_scroll_x),
    -Math.min(verticalScroll, max_scroll_y)
  );
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(backgroundCanvas, 0, 0);
  player.draw(c);

  // render out pets
  // pet.update(deltaTime, collisionBlocks);
  // pet.draw(c);

  for (let i = boxCat.length - 1; i >= 0; i--) {
    const boxcat = boxCat[i];
    boxcat.update(deltaTime, collisionBlocks);
    boxcat.draw(c);
  }
  c.restore();

  requestAnimationFrame(() => animate(backgroundCanvas));
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers();
    if (!backgroundCanvas) {
      console.error("Failed to create the background canvas");
      return;
    }

    animate(backgroundCanvas);
  } catch (error) {
    console.error("Error during rendering:", error);
  }
};

startRendering();
