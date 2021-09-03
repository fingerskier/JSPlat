import Events from './EventCenter'
import KEY from "../Keys";
import Phaser from 'phaser'
import StateMachine from "../lib/StateMachine";


export default class PlayerController {
  constructor(scene, sprite, cursors, obstacles) {
    this.cursors = cursors
    this.obstacles = obstacles
    this.scene = scene
    this.sprite = sprite
    this.stateMachine = new StateMachine(this)

    this.createAnimations()

    this.stateMachine
    .add(KEY.PLAYER.STATE.IDLE, {
      onEnter: this.startIdling,
      onUpdate: this.idling,
    })
    .add(KEY.PLAYER.STATE.WALK, {
      onEnter: this.startWalking,
      onUpdate: this.walking,
      onExit: this.stopWalking,
    })
    .add(KEY.PLAYER.STATE.JUMP, {
      onEnter: this.startJumping,
      onUpdate: this.jumping,
    })
    .add(KEY.PLAYER.STATE.SPIKE_HIT, {
      onEnter: this.spikeHit,
    })
    .set(KEY.PLAYER.STATE.IDLE)

               
    this.sprite.setOnCollide(data=>{
      const body = data.bodyB
    
      
      if (this.obstacles.is(KEY.OBJECT.SPIKES, body)) {
        this.stateMachine.set(KEY.PLAYER.STATE.SPIKE_HIT)
        return
      }
    
    
      const obj = body?.gameObject
    
    
      if (!obj) return
    
      if (obj instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.currently(KEY.PLAYER.STATE.JUMP)) {
          this.stateMachine.set(KEY.PLAYER.STATE.IDLE)
        }
    
        return
      } else {
        const type = obj.getData(KEY.OBJECT.TYPE)
        
        if (type === KEY.OBJECT.STAR) {
          Events.emit(KEY.EVENT.STAR_COLLECTED)
          obj.destroy()
        }
      }
    })      
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
      key: KEY.PLAYER.JUMP,
      frames: [{
        key: KEY.IMG.PENGUIN,
        frame: 'penguin_slide01.png',
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
      this.stateMachine.set(KEY.PLAYER.STATE.WALK)
    } else if (this.cursors.right.isDown) {
      this.stateMachine.set(KEY.PLAYER.STATE.WALK)
    }    

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed) {
      this.stateMachine.set(KEY.PLAYER.STATE.JUMP)
    }
  }


  jumping() {
    const speed = 5

    if (this.cursors.left.isDown) {
      this.sprite.flipX = true
      this.sprite.setVelocityX(-speed)
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false
      this.sprite.setVelocityX(speed)
    }
  }


  spikeHit() {
    console.log('spike hit')
    this.sprite.setVelocityY(-12)

    const startColor = Phaser.Display.Color.ValueToColor(0xFFFFFF)
    const endColor = Phaser.Display.Color.ValueToColor(0xFF0000)

    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 100,
      repeat: 2,
      yoyo: true,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: tween=>{
        const value = tween.getValue()
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100,
          value,
        )
        const color = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b)

        this.sprite.setTint(color)
      }
    })
    this.stateMachine.set(KEY.PLAYER.STATE.IDLE)
  }


  startIdling() {
    this.sprite.play(KEY.PLAYER.IDLE)
  }


  startJumping() {
    this.sprite.play(KEY.PLAYER.JUMP)
    this.sprite.setVelocityY(-15)
    this.isTouchingGround = false
  }


  startWalking() {
    this.sprite.play(KEY.PLAYER.WALK)
  }


  stopWalking() {
    this.sprite.stop()
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
      this.stateMachine.set(KEY.PLAYER.STATE.IDLE)
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed) {
      this.stateMachine.set(KEY.PLAYER.STATE.JUMP)
    }
  }
}