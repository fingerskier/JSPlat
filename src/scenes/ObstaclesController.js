const key = (name,id)=>`${name}-${id}`


export default class ObstaclesController {
  obstacles = new Map()


  add(name, body) {
    const thisKey = key(name, body.id)

    if (this.obstacles.has(thisKey)) throw new Error(`obstacle <${thisKey}> already exists`)
    
    this.obstacles.set(thisKey, body)
  }


  is(name, body) {
    const thisKey = key(name, body.id)

    return this.obstacles.has(thisKey)
  }
}