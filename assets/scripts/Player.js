// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // main character's jump height
    jumpHeight: 0,
    // main character's jump duration
    jumpDuration: 0,
    // maximal movement speed
    maxMoveSpeed: 0,
    // acceleration
    accel: 0,
  },

  // ACTIONS
  jumpAction: function (dt) {
    var groundY = this.node.y;
    var currentX = this.node.x;
    return cc
      .tween(this.node)
      .to(
        this.jumpDuration,
        {
          position: cc.v2(currentX, this.jumpHeight),
        },
        {
          easing: "cubicOut",
        }
      )
      .to(
        this.jumpDuration,
        {
          position: cc.v2(currentX, groundY),
        },
        {
          easing: "cubicIn",
        }
      );
  },

  // EVENTS
  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;
      case cc.macro.KEY.right:
        this.accRight = true;
        break;
      case cc.macro.KEY.up:
        this.accUp = true;
        break;
      case cc.macro.KEY.down:
        this.accDown = true;
        break;
      case cc.macro.KEY.space:
        if (!this.jump) {
          this.jump = true;
        }
        break;
      default:
        break;
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;
      case cc.macro.KEY.right:
        this.accRight = false;
      case cc.macro.KEY.up:
        this.accUp = false;
        break;
      case cc.macro.KEY.down:
        this.accDown = false;
        break;
      default:
        break;
    }
  },

  // LIFE-CYCLE CALLBACKS:
  onLoad: function () {
    // Acceleration direction switch
    this.accLeft = false;
    this.accRight = false;
    // The main character's current horizontal velocity
    this.xSpeed = 0;

    // Initialize the keyboard input listening
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onDestroy() {
    // Cancel keyboard input monitoring
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  update(dt) {
    // update speed of each frame according to the current acceleration direction
    if (this.accLeft) {
      this.node.scaleX = 1;
      this.xSpeed = -this.maxMoveSpeed;
    }
    if (this.accRight) {
      this.node.scaleX = -1;
      this.xSpeed = this.maxMoveSpeed;
    }
    if (this.accUp) {
      this.ySpeed = this.maxMoveSpeed;
    }
    if (this.accDown) {
      this.ySpeed = -this.maxMoveSpeed;
    }
    // restrict the movemoent speed of the main character to the maximum movement speed
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // if speed reach limit, use max speed with current direction
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }

    // update the position of the main character according to the current speed
    if (this.accLeft || this.accRight) {
      this.node.x += this.xSpeed * dt;
    }

    // update the position of the main character according to the current speed
    if (this.accUp || this.accDown) {
      this.node.y += this.ySpeed * dt;
    }

    // jump
    if (this.jump) {
      this.jumpAction(dt).start();
      this.jump = false;
    }
  },

  start() {},

  // update (dt) {},
});
