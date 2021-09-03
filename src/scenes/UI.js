import Events from './EventCenter'
import KEY from '../Keys'
import Phaser from 'phaser'


export default class extends Phaser.Scene {
  constructor() {
    super(KEY.SCENE.UI)
  }
  
  
  init() {
    this.starCount = 0
  }


  create() {
    this.starsLabel = this.add.text(10, 10, `Stars: ${this.starCount}`, {
      fontSize: '32px',
    })

    Events.on(KEY.EVENT.STAR_COLLECTED, ()=>{
      ++this.starCount
      this.starsLabel.text = `Stars: ${this.starCount}`
    })

    this.events.once(Phaser.Scenes.Events.DESTROY, ()=>{
      Events.off(KEY.EVENT.STAR_COLLECTED)
    })
  }


  handleCollection() {
    ++this.starCount
    this.starsLabel.text = `Stars: ${this.starCount}`
  }
}