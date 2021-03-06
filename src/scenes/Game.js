import KEY from '../Keys'
import ObstaclesController from './ObstaclesController';
import Phaser from 'phaser'
import PlayerController from "./PlayerController";
import SnowmanController from './SnowmanController';


export default class Game extends Phaser.Scene {
  cursors = Phaser.Input.Keyboard.CursorKeys

  penguin = Phaser.Physics.Matter.Sprite

  isTouchingGround = false

  playerController = {}


  constructor() {
    super(KEY.SCENE.GAME)
  }


  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.obstacles = new ObstaclesController()
    this.snowmen = []

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
      this.destroy()
    })
  }


  preload() {
    this.load.atlas(KEY.IMG.PENGUIN, 'assets/penguin/penguin.png', 'assets/penguin/penguin.json')
    this.load.atlas(KEY.IMG.SNOWMAN, 'assets/snowman/snowman.png', 'assets/snowman/snowman.json')

    this.load.image(KEY.TILES, 'assets/sheet.png')
    this.load.image(KEY.IMG.HEALTH, 'assets/health.png')
    this.load.tilemapTiledJSON(KEY.TILEMAP, 'assets/game_tiled.json')

    this.load.image(KEY.IMG.STAR, 'assets/star.png')
  }


  create() {
    this.scene.launch(KEY.SCENE.UI)
    
    
    const map = this.make.tilemap({key: KEY.TILEMAP})
    const tileset = map.addTilesetImage('iceworld', KEY.TILES)

    const ground = map.createLayer(KEY.LAYER.GROUND, tileset)
    const obstacles = map.createLayer(KEY.LAYER.OBSTACLES, tileset)

    ground.setCollisionByProperty({collides: true})

    this.cameras.main.scrollY = 400


    const objectsLayer = map.getObjectLayer(KEY.LAYER.OBJECTS)

    objectsLayer.objects.forEach(obj=>{
      const {name, x=0, y=0, width=0, height=0, value} = obj

      switch(name) {
        case 'penguin-spawn': {
          this.penguin = this.matter.add.sprite(x + (0.5*width), y, KEY.IMG.PENGUIN)
          .play(KEY.PLAYER.ANIM.WALK)
          .setFixedRotation()

          this.playerController = new PlayerController(this, this.penguin, this.cursors, this.obstacles)
        }
        break

        case KEY.OBJECT.HEALTH: {
          const health = this.matter.add.sprite(x+(0.5*width), y+(0.5*height), KEY.IMG.HEALTH, undefined, {
            isSensor: true,
            isStatic: true,
          })

          health.setData(KEY.OBJECT.TYPE, KEY.OBJECT.HEALTH)
          health.setData(KEY.OBJECT.VALUE, value)
        }
        break

        case KEY.OBJECT.SNOWMAN: {
          const snowman = this.matter.add.sprite(x + (0.5*width), y, KEY.IMG.SNOWMAN)
          .setFixedRotation()

          this.snowmen.push(new SnowmanController(this, snowman))
          this.obstacles.add(KEY.OBJECT.SNOWMAN, snowman.body)
        }
        break

        case KEY.OBJECT.SPIKES: {
          const spike = this.matter.add.rectangle(x+(0.5*width), y+(0.5*height), width, height, {
            isStatic: true,
          })

          this.obstacles.add(KEY.OBJECT.SPIKES, spike)
        }
        break
        
        case KEY.OBJECT.STAR: {
          const star = this.matter.add.sprite(x, y, KEY.IMG.STAR, undefined, {
            isSensor: true,
            isStatic: true,
          })

          star.setData(KEY.OBJECT.TYPE, KEY.OBJECT.STAR)
        }
        break
      }
    })


    this.cameras.main.startFollow(this.penguin, true)

    this.matter.world.convertTilemapLayer(ground)
  }


  destroy() {
    this.events.off(KEY.EVENT.STAR_COLLECTED)
    this.snowmen.forEach(snowman=>snowman.destroy())
  }


  update(t, dt) {
    if (!this.playerController) return

    this.playerController.update(dt)

    this.snowmen.forEach(snowman=>snowman.update(dt))
  }
}