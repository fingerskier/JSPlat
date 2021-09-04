import Events from './EventCenter'
import KEY from '../Keys'
import Phaser from 'phaser'


export default class extends Phaser.Scene {
  constructor() {
    super(KEY.SCENE.UI)

    this.lastHealth = 100
  }
  
  
  init() {
    this.starCount = 0
  }


  create() {
    this.graphics = this.add.graphics()

    this.drawHealthBar(100)


    this.starsLabel = this.add.text(10, 40, `Stars: ${this.starCount}`, {
      fontSize: '32px',
    })


    Events.on(KEY.EVENT.STAR_COLLECTED, ()=>{
      ++this.starCount
      this.starsLabel.text = `Stars: ${this.starCount}`
    })

    Events.on(KEY.EVENT.HEALTH_CHANGED, value=>{
      this.tweens.addCounter({
        from: this.lastHealth,
        to: value,
        duration: 169,
        onUpdate: tween=>{
          const val = tween.getValue()
          this.drawHealthBar(val)
        }
      })
    })
    

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
      Events.off(KEY.EVENT.STAR_COLLECTED)
    })
  }


  drawHealthBar(value) {
    const width = 212
    const percent = value / 100

    this.graphics.fillStyle(0x808080)
    this.graphics.fillRoundedRect(10, 10, width, 20, 5)

    if (percent) {
      this.graphics.fillStyle(0x00FF00)
      this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
    }

    this.lastHealth = value
  }


  handleCollection() {
    ++this.starCount
    this.starsLabel.text = `Stars: ${this.starCount}`
  }
}