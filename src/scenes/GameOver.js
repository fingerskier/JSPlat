import KEY from '../Keys'
import Phaser from 'phaser'



export default class GameOver extends Phaser.Scene {
  constructor() {
    super(KEY.SCENE.GAME_OVER)
  }


  create() {
    const {height, width} = this.scale

    this.add.text(0.5*width, 0.3*height, 'Game Over', {
      fontSize: '52px',
      color: '#FF0000',
    })
    .setOrigin(0.5)

    const button = this.add.rectangle(0.5*width, 0.5*height, 150, 75, 0xFFFFFF)
    .setInteractive()
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, ()=>{
      this.scene.start(KEY.SCENE.GAME)
    })

    this.add.text(button.x, button.y, 'Play Again', {
      color: '#000000',
    })
    .setOrigin(0.5)
  }
}