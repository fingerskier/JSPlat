import KEY from "../Keys";
import Phaser from 'phaser'
import StateMachine from "../lib/StateMachine";


export default class PlayerController {
  constructor(sprite, cursors) {
    this.cursors = cursors
    this.sprite = sprite
    this.stateMachine = new StateMachine(this)

    this.createAnimations()

    this.stateMachine
    .addState(KEY.PLAYER.STATE.IDLE, {
      onEnter: this.startIdling,
      onUpdate: this.idling,
    })
    .addState(KEY.PLAYER.STATE.WALK, {
      onEnter: this.startWalking,
      onUpdate: this.walking,
    })
    .addState(KEY.PLAYER.STATE.JUMP, {
      onEnter: this.startJumping,
      onUpdate: this.jumping,
    })
    .setState(KEY.PLAYER.STATE.IDLE)
  }

  
  update(dt) {
    this.stateMachine.update(dt)
  }


  createAnimations() {
    this.sprite.anims.create({
      key: KEY.PLAYER.IDLE,
      frames: [{
        key: KEY.IMG.PENGUIN,
        frame: 'penguin_walk01.png',
      }],
    })

    this.sprite.anims.create({
      key: KEY.PLAYER.WALK,
      framerate: 10,
      frames: this.sprite.anims.generateFrameNames(KEY.IMG.PENGUIN, {
        start: 1,
        end: 4,
        prefix: 'penguin_walk0',
        suffix: '.png',
      }),
      repeat: -1,
    })
  }


  idling() {
    if (this.cursors.left.isDown) {
      this.stateMachine.setState(KEY.PLAYER.STATE.WALK)
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState(KEY.PLAYER.STATE.WALK)
    }    
  }


  startIdling() {
    this.sprite.play(KEY.PLAYER.IDLE)
  }


  startJumping() {

  }


  startWalking() {
    this.sprite.play(KEY.PLAYER.WALK)
  }

  walking() {
    const speed = 10

    if (this.cursors.left.isDown) {
      this.sprite.flipX = true
      this.sprite.setVelocityX(-speed)
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false
      this.sprite.setVelocityX(speed)
    } else {
      this.sprite.setVelocityX(0)
      this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed && this.isTouchingGround) {
      this.sprite.setVelocityY(-15)
      this.isTouchingGround = false
      this.stateMachine.setState(KEY.PLAYER.STATE.JUMP)
    }
  }
}