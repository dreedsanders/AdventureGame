const X_VELOCITY = 70;
const Y_VELOCITY = 70;

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.velocity = velocity;
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };

    // quick check to make sure image is loaded before drawn
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
    };
    //

    // since we defined the height and width of a frame we can keep track of the
    // frame we are on with current frame being updated in the update method
    this.currentFrame = 0;
    this.elapesedTime = 0;
    this.image.src = "./images/walk.png";

    // define the starting frames of our sprite image
    this.sprites = {
      walkUp: {
        x: 0,
        y: 0,
        width: 64,
        height: 64,
        frameCount: 9,
      },
      walkDown: {
        x: 0,
        y: 128,
        width: 64,
        height: 64,
        frameCount: 9,
      },
      walkLeft: {
        x: 0,
        y: 64,
        width: 64,
        height: 64,
        frameCount: 9,
      },
      walkRight: {
        x: 0,
        y: 192,
        width: 64,
        height: 64,
        frameCount: 9,
      },
    };

    this.currentSprite = this.sprites.walkDown;
  }

  draw(c) {
    if (!this.loaded) return;
    // Red square debug code
    // c.fillStyle = "rgba(0, 0, 255, 0.5)";
    // c.fillRect(this.x, this.y, this.width, this.height);

    c.drawImage(
      this.image,
      // specify which part of our image to display
      //  moving the crop box x coordinate  with current sprite width by current frame in order
      // to go along the x axis of our sprite image by image frame
      this.currentSprite.width * this.currentFrame + 0.5,
      this.currentSprite.y,
      this.currentSprite.width,
      this.currentSprite.height,
      //
      // specify where to put it on our canvas
      this.x,
      this.y,
      this.width,
      this.height
      //
    );
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return;
    this.elapesedTime += deltaTime;

    const nextFrameInterval = 0.2;

    // changing current frame based on time between frames/delta time
    if (this.elapesedTime > nextFrameInterval) {
      this.currentFrame =
        (this.currentFrame + 1) % this.currentSprite.frameCount;
      this.elapesedTime -= nextFrameInterval;
    }

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime);
    this.checkForHorizontalCollisions(collisionBlocks);

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime);
    this.checkForVerticalCollisions(collisionBlocks);

    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime;
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime;
  }

  handleInput(keys) {
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY;
      this.currentSprite = this.sprites.walkRight;
      this.currentSprite.frameCount = 9;
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY;
      this.currentSprite = this.sprites.walkLeft;
      this.currentSprite.frameCount = 9;
    } else if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY;
      this.currentSprite = this.sprites.walkUp;
      this.currentSprite.frameCount = 9;
    } else if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY;
      this.currentSprite = this.sprites.walkDown;
      this.currentSprite.frameCount = 9;
    } else {
      this.currentSprite.frameCount = 1;
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001;
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // Check if a collision exists on all axes
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer;
          break;
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer;

          break;
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001;
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      // If a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.y = collisionBlock.y + collisionBlock.height + buffer;
          break;
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.y = collisionBlock.y - this.height - buffer;
          break;
        }
      }
    }
  }
}
