export default class FiniteStateMachine {
  static count = 0

  isChangingState = false
  queue = []  // list of state names
  states = new Map()
  state = {
    name: 'void',
    onEnter: ()=>{},
    onExit: ()=>{},
    onUpdate: ()=>{},
  }
  transitions = [{}]


  constructor(context) {
    /*
      the context allows us to bind this state-machine to a given object
      this allows the enter, exit, and update fx to act upon the context-object
    */
    this.context = context
    this.id = ++FiniteStateMachine.count
  }


  addState(name, config) {
    if (!name) throw `State Machine <${this.id}>: addState must receive a 'name' parameter`

    this.states.set(name, {
      name: name,
      onEnter: config?.onEnter?.bind(this.context),
      onExit: config?.onExit?.bind(this.context),
      onUpdate: config?.onUpdate?.bind(this.context),
    })

    return this
  }


  addTransition(fromState, toState) {
    this.transitions.push({
      from: fromState,
      to: toState
    })
  }


  inState(name) {
    return this.state?.name === name
  }


  setState(name) {
    if (!this.states.has(name)) throw `State-Machine <${this.id}> doesn't have a state named ${name}`

    if (this.state?.name === name) return

    if (this.isChangingState) return this.queue.push(name)

    // begin changing states
    this.isChangingState = true

    if (this.verbose) console.log(`State-Machine<${this.id}> changing from ${this.state.name} to ${name}`)

    // exit the previous state
    if (this.state?.onExit) this.state.onExit()

    // set the current state
    this.state = this.states.get(name)

    // enter the new state
    if (this.state?.onEnter) this.state.onEnter()

    this.isChangingState = false

    return this
  }


  transition(desiredState) {
    // transition is only valid if we have a transition registered from the current state to the desired state
    const valid = this.transitions.filter(el=>(this.inState(el.from) && (desiredState===el.to)))

    if (valid) {
      if (this.verbose) console.log(`State-Machine<${this.id}> transitioning from ${this.state.name} to ${desiredState}`)
      this.setState(desiredState)
    } else {
      console.error(`State-Machine<${this.id}> does not have a transition registered from ${this.state.name} to ${desiredState}`)
    }
  }


  update(dt) {
    if (this.queue.length) return this.set(this.queue.shift())

    if (this.state?.onUpdate) this.state.onUpdate(dt)
  }
}