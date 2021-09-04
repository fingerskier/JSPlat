import Events from './EventCenter'
import KEY from "../Keys";
import Phaser from 'phaser'
import StateMachine from "stateinator";


export default class {
  constructor(scene, sprite) {
    this.moveTime = 0
    this.scene = scene
    this.sprite = sprite
    this.StateMachine = new StateMachine(this)

    this.createAnimations()

    // this.StateMachine.verbose = true
    this.StateMachine
    .addState(KEY.SNOWMAN.STATE.IDLE, {
      onEnter: this.startIdling,
    })
    .addState(KEY.SNOWMAN.STATE.MOVE_LEFT, {
      onUpdate: this.moveLeft,
    })
    .addState(KEY.SNOWMAN.STATE.MOVE_RIGHT, {
      onUpdate: this.moveRight,
    })
    .addState(KEY.SNOWMAN.STATE.DEAD, {
      onEnter: this.dying,
    })
    .setState(KEY.SNOWMAN.STATE.IDLE)


    Events.on(KEY.EVENT.SNOWMAN_STOMP, snowman=>{
      if (this.sprite !== snowman) return
      
      this.StateMachine.setState(KEY.SNOWMAN.STATE.DEAD)
      console.log('snowman stomped')
    })
  }


  createAnimations() {
    this.sprite.anims.create({
      key: KEY.SNOWMAN.ANIM.IDLE,
      frames: [{
        key: KEY.IMG.SNOWMAN,
        frame: 'snowman_left_1.png',
      }]
    })

    this.sprite.anims.create({
      key: KEY.SNOWMAN.ANIM.WALK_LEFT,
      frameRate: 5,
      frames: this.sprite.anims.generateFrameNames(KEY.IMG.SNOWMAN, {
        start: 1,
        end: 2,
        prefix: 'snowman_left_',
        suffix: '.png',
      }),
      repeat: -1,
    })
    
    this.sprite.anims.create({
      key: KEY.SNOWMAN.ANIM.WALK_RIGHT,
      frameRate: 5,
      frames: this.sprite.anims.generateFrameNames(KEY.IMG.SNOWMAN, {
        start: 1,
        end: 2,
        prefix: 'snowman_right_',
        suffix: '.png',
      }),
      repeat: -1,
   })
  }


  destroy() {
    Events.off(KEY.EVENT.SNOWMAN_STOMPED)
  }


  dying() {
    console.log('snowman die')

    this.scene.tweens.add({
      targets: this.sprite,
      displayHeight: 0,
      y: this.sprite.y + (this.sprite.displayHeight * 0.5),
      duration: 200,
      onComplete: ()=>{
        this.sprite.destroy()
      }
    })
  }


  handleStomp(snowman) {
  }


  update(dt) {
    this.StateMachine.update(dt)
  }


  moveLeft(dt) {
    this.moveTime += dt

    if (this.moveTime > 2000) this.StateMachine.setState(KEY.SNOWMAN.STATE.IDLE)

    this.sprite.play(KEY.SNOWMAN.ANIM.WALK_LEFT)
    this.sprite.setVelocityX(-3)
  }
  
  
  moveRight(dt) {
    this.moveTime += dt

    if (this.moveTime > 2000) this.StateMachine.setState(KEY.SNOWMAN.STATE.IDLE)

    this.sprite.play(KEY.SNOWMAN.ANIM.WALK_RIGHT)
    this.sprite.setVelocityX(3)
  }

  
  startIdling() {
    this.moveTime = 0

    this.sprite.play(KEY.SNOWMAN.ANIM.IDLE)

    const r = Phaser.Math.Between(1, 100)

    if (r < 50) {
      this.StateMachine.setState(KEY.SNOWMAN.STATE.MOVE_LEFT)
    } else {
      this.StateMachine.setState(KEY.SNOWMAN.STATE.MOVE_RIGHT)
    }
  }
}