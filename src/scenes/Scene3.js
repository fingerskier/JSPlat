import Phaser from 'phaser';
import KEY from '../Keys'


export default class Scene3 extends Phaser.Scene {
  constructor() {
    super({key: KEY.SCENE3})
  }


  preload() {
    this.load.audio(KEY.SWEEP_SOUND, ['assets/sweep.wav'])

  }


  create() {
    this.soundFx = this.sound.add(KEY.SWEEP_SOUND, {
      loop: true,
    })

    this.soundFx.play()
    this.soundFx.rate = 0.5


    this.input.keyboard.on('keydown-Z', event=>{
      this.soundFx.loop = !this.soundFx.loop
      
      if (this.soundFx.loop) this.soundFx.play()
    })

    this.input.keyboard.on('keydown-X', event=>{
      if (this.soundFx.isPlaying) this.soundFx.pause()
      else this.soundFx.resume()
    })

        
    this.input.keyboard.on('keyup', event=>{
      if (event.key === '1') {
        this.scene.start(KEY.SCENE1)
      }

      if (event.key === '2') {
        this.scene.start(KEY.SCENE2)
      }
    })

  }
}