import Events from './EventCenter'
import KEY from "../Keys";
import Phaser from 'phaser'
import StateMachine from "stateinator";


export default class PlayerController {
  constructor(scene, sprite, cursors, obstacles) {
    this.cursors = cursors
    this.health = 70
    this.lastSnowman = {}
    this.obstacles = obstacles
    this.scene = scene
    this.sprite = sprite
    this.stateMachine = new StateMachine(this)

    this.createAnimations()

    this.stateMachine
    .addState(KEY.PLAYER.STATE.DEAD, {
      onEnter: this.die,
    })
    .addState(KEY.PLAYER.STATE.IDLE, {
      onEnter: this.startIdling,
      onUpdate: this.idling,
    })
    .addState(KEY.PLAYER.STATE.WALK, {
      onEnter: this.startWalking,
      onUpdate: this.walking,
      onExit: this.stopWalking,
    })
    .addState(KEY.PLAYER.STATE.JUMP, {
      onEnter: this.startJumping,
      onUpdate: this.jumping,
    })
    .addState(KEY.PLAYER.STATE.SNOWMAN_HIT, {
      onEnter: this.snowmanHit,
    })
    .addState(KEY.PLAYER.STATE.SNOWMAN_STOMP, {
      onEnter: this.snowmanStomp,
    })
    .addState(KEY.PLAYER.STATE.SPIKE_HIT, {
      onEnter: this.spikeHit,
    })
    .setState(KEY.PLAYER.STATE.IDLE)


    this.sprite.setOnCollide(data=>{
      const body = data.bodyB
      
      if (this.obstacles.is(KEY.OBJECT.SPIKES, body)) {
        this.stateMachine.setState(KEY.PLAYER.STATE.SPIKE_HIT)
        return
      }
      
      if (this.obstacles.is(KEY.OBJECT.SNOWMAN, body)) {
        this.lastSnowman = body.gameObject

        if ((this.sprite.y < body.position.y) && (this.sprite.body.velocity.y > 0)) {
          // stomp on snowman
          Events.emit(KEY.EVENT.SNOWMAN_STOMP, this.lastSnowman)
          this.stateMachine.setState(KEY.PLAYER.STATE.SNOWMAN_STOMP)
        } else {
          // hit by snowman
          this.stateMachine.setState(KEY.PLAYER.STATE.SNOWMAN_HIT)
        }

        return
      }
      
      
      const obj = body?.gameObject
      
      if (!obj) return
      
      if (obj instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.inState(KEY.PLAYER.STATE.JUMP)) {
          this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
        }
        
        return
      } else {
        const type = obj.getData(KEY.OBJECT.TYPE)
        
        if (type === KEY.OBJECT.STAR) {
          Events.emit(KEY.EVENT.STAR_COLLECTED)
          obj.destroy()
        } else if (type === KEY.OBJECT.HEALTH) {
          const value = obj.getData(KEY.PLAYER.HEALTH_POINTS) ?? 10

          this.health = this.health + value
          
          
          obj.destroy()
        }
      }
    })      
  }


  update(dt) {
    this.stateMachine.update(dt)
  }


  animate(animation) {
    console.log('player animate', animation)
    this.sprite.play(animation)
  }


  createAnimations() {
    this.sprite.anims.create({
      key: KEY.PLAYER.ANIM.IDLE,
      frames: [{
        key: KEY.IMG.PENGUIN,
        frame: 'penguin_walk01.png',
      }],
    })

    this.sprite.anims.create({
      key: KEY.PLAYER.ANIM.JUMP,
      frames: [{
        key: KEY.IMG.PENGUIN,
        frame: 'penguin_slide01.png',
      }],
    })

    this.sprite.anims.create({
      key: KEY.PLAYER.ANIM.WALK,
      framerate: 10,
      frames: this.sprite.anims.generateFrameNames(KEY.IMG.PENGUIN, {
        start: 1,
        end: 4,
        prefix: 'penguin_walk0',
        suffix: '.png',
      }),
      repeat: -1,
    })

    this.sprite.anims.create({
      key: KEY.PLAYER.ANIM.DIE,
      framerate: 10,
      frames: this.sprite.anims.generateFrameNames(KEY.IMG.PENGUIN, {
        start: 1,
        end: 4,
        prefix: 'penguin_die',
        zeroPad: 2,
        suffix: '.png',
      }),
    })
  }


  die() {
    this.sprite.play(KEY.PLAYER.ANIM.DIE)
    
    this.sprite.setOnCollide(()=>{})

    this.scene.time.delayedCall(1000, ()=>{
      this.scene.scene.start(KEY.SCENE.GAME_OVER)
    })

    console.log('dead', this.sprite)
  }


  idling() {
    if (this.cursors.left.isDown) {
      this.stateMachine.setState(KEY.PLAYER.STATE.WALK)
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState(KEY.PLAYER.STATE.WALK)
    }    

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed) {
      this.stateMachine.setState(KEY.PLAYER.STATE.JUMP)
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


  snowmanHit() {
    if (this.stateMachine.inState(KEY.PLAYER.STATE.DEAD)) return
    
    if (this.lastSnowman) {
      if (this.sprite.x < this.lastSnowman.x) {
        this.sprite.setVelocityX(-20)
      } else {
        this.sprite.setVelocityX(20)
      }
    } else {
      this.sprite.setVelocityY(-20)
    }

    this.sprite.setVelocityY(-12)
    this.health = this.health - 10

    const startColor = Phaser.Display.Color.ValueToColor(0xFFFFFF)
    const endColor = Phaser.Display.Color.ValueToColor(0x0000FF)

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
    
    this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
  }


  get health() {
    return this._health
  }


  set health(val) {
    this._health = Phaser.Math.Clamp(val, 0, 100)
    Events.emit(KEY.EVENT.HEALTH_CHANGED, this._health)

    if (this._health <= 0) this.stateMachine.setState(KEY.PLAYER.STATE.DEAD)
  }


  snowmanStomp() {
    this.sprite.setVelocityY(-10)

    this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
  }


  spikeHit() {
    console.log('spike hit')
    if (this.stateMachine.inState(KEY.PLAYER.STATE.DEAD)) return

    this.sprite.setVelocityY(-12)
    this.health = this.health - 10

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

    this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
  }


  startIdling() {
    this.sprite.play(KEY.PLAYER.ANIM.IDLE)
  }


  startJumping() {
    this.sprite.play(KEY.PLAYER.ANIM.JUMP)
    this.sprite.setVelocityY(-15)
    this.isTouchingGround = false
  }


  startWalking() {
    this.sprite.play(KEY.PLAYER.ANIM.WALK)
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
      this.stateMachine.setState(KEY.PLAYER.STATE.IDLE)
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

    if (spaceJustPressed) {
      this.stateMachine.setState(KEY.PLAYER.STATE.JUMP)
    }
  }
}