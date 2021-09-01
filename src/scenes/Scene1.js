import Phaser from 'phaser';
import Key from '../Keys'


export default class Scene1 extends Phaser.Scene {
  constructor() {
    super({key: Key.SCENE1})
  }


  preload() {
    this.load.image(Key.BOMB, 'assets/bomb.png')
  }


  create() {
    this.image = this.add.image(400, 300, Key.BOMB)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.input.keyboard.on('keyup-F', event=>{
      this.image.x += 10
    })

    this.input.keyboard.on('keyup-D', event=>{
      this.image.y += 10
    })

    this.input.keyboard.on('keydown-P', event=>{
      var physicsImage = this.physics.add.image(this.image.x, this.image.y, Key.BOMB)

      physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100), -300)
    })

    this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

    this.input.on('pointerdown', event=>{
      this.image.x = event.x
      this.image.y = event.y
    })

    this.input.keyboard.on('keyup', event=>{
      if (event.key === '2') {
        this.scene.start(Key.SCENE2)
      }

      if (event.key === '3') {
        this.scene.start(Key.SCENE3)
      }
    })
  }


  update(delta) {
    if (this.key_S.isDown) {
      this.image.x--
    }
  }
}