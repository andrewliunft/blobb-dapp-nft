import { createContext, useCallback, useContext, useEffect, useReducer } from "react"
import EtherContext from "../EtherContext/EtherProvider"
import MyBlobContext from "../MyBlobContext/MyBlobProvider"

const BlobbsContext = createContext()

const ACTIONS = {SET: "set", FOCUS: "focus", RESET: "reset"}
const initBlobbs = {focusedBlobb: null, aliveIDs: null, pastIDs: [],}
const reducer = (blobbs, action) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.SET:
      return { ...blobbs, ...data }
    case ACTIONS.RESET:
      return { ...blobbs, ...initBlobbs }
    default:
      return blobbs
  }
}

export function BlobbsProvider({ children }) {
  const {state: { contract }} = useContext(EtherContext)
  const {blob: { number }} = useContext(MyBlobContext)
  const [blobbs, blobbsDispatch] = useReducer(reducer, initBlobbs)

  //EVENTS HANDLER CALLBACK
  const _actionEventsHandler = (toBlobID, madeFrom, newHP, event) => {
    console.log("Action to BlobbsProvider EMITTED", toBlobID, madeFrom, newHP, event)
    console.log("VALUE: ", blobbs)
    const eventBlobHP = parseInt(newHP._hex, 16)
    if(eventBlobHP === blobbs.focusedBlobb.hp) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return
    }
    const focusedBlobb = {...blobbs.focusedBlobb, ...{hp: eventBlobHP}}
    console.log("NEW VALUE", focusedBlobb)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb }})

  }

  const _newBlobbEventHandler = (newBlobID, newOwner, event) => {
    console.log("NEWBLOBB EMITTED", newBlobID, newOwner, event)
    console.log("VALUE: ", blobbs)
    const eventBlobID = parseInt(newBlobID._hex, 16)
    if(blobbs.aliveIDs.includes(eventBlobID)) {
      console.log("FALSE EVENT - THE BLOB ID IS PRESENT")
      return
    }
    const aliveIDs = blobbs.aliveIDs.concat(eventBlobID)
    blobbsDispatch({type: ACTIONS.SET, data: { aliveIDs }})
  }  

  //CONTRACT EVENTS LISTENER 
  useEffect(() => {
    if(!blobbs.focusedBlobb) return
    contract.on(contract.filters.Action(blobbs.focusedBlobb.number), _actionEventsHandler)
    contract.on(contract.filters.NewBlobb(), _newBlobbEventHandler)

    console.log("Action AND NewBlobb EVENTS CONNECTED to BlobbsProvider", contract.listeners())
    return () => {
      contract.off(contract.filters.Action(blobbs.focusedBlobb.number), _actionEventsHandler)
      contract.off(contract.filters.NewBlobb(), _newBlobbEventHandler)
    }
  }, [blobbs.focusedBlobb])

  //INIT CONTEXT
  useEffect(() => {
    blobbsDispatch({type: ACTIONS.RESET})
    if(contract && number) setBlobbs()
  }, [number])

  const setBlobbs = async () => {
    const aliveIDs = await _getAliveIDs()
    if(aliveIDs.length === 0) return
    console.log("ALIVES: ", aliveIDs)
    const focusedBlobb = await _getBlobbToFocus(aliveIDs[Math.floor(Math.random() * aliveIDs.length)])
    console.log(focusedBlobb)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb, aliveIDs }})
  }

  const _getBlobbBirthday = birthTimespamt => {
    let birthday = new Date(parseInt(birthTimespamt, 16)*1000)
    return birthday.getMonth()+1 + "/" + birthday.getDate() + "/" + birthday.getFullYear()
  }

  const _getBlobbColors = async (blobID) => {
    let colors = []
    for(let i = 0; i < 6; i++) {
      const color = await contract.blobbColors(blobID, i)
      colors.push(parseInt(color._hex, 16))
    }
    return {start: colors.slice(0,3).join(), end: colors.slice(-3).join()}
  }

  const _getAliveIDs = async () => {
    const totalBlobsNumber = 100 //await contract.getTotalBlobbsNumber()
    let allIDs = Array.from({length: totalBlobsNumber}, (_v, idx) => idx+1).filter(value => value !== number)
    return await _asyncFilter(allIDs, async value => (await contract.blobs(value)).hp > 0)
  }

  const _getBlobbToFocus = async bID => {
    console.log("FOCUS ID", bID)
    const toFocusBlobb = await contract.blobs(bID)
    return {
      number: parseInt(toFocusBlobb.blobID._hex, 16),
      birthday: _getBlobbBirthday(toFocusBlobb.birthday._hex, 16),
      hp: parseInt(toFocusBlobb.hp._hex, 16),
      totalActions: parseInt(toFocusBlobb.totalActions._hex, 16),
      kills: parseInt(toFocusBlobb.kills._hex, 16),
      death: parseInt(toFocusBlobb.deathDate._hex, 16) || "ALIVE",
      creator: toFocusBlobb.creator,
      owner: toFocusBlobb.owner,
      lastHit: toFocusBlobb.lastHit || "NONE",
      colors: await _getBlobbColors(parseInt(bID, 16))
    }
  }

  const _focusNewBlobb = async () => {
    console.log("past", blobbs.pastIDs, blobbs.aliveIDs)
    if(blobbs.aliveIDs.length === 1) return
    const pastIDs = blobbs.pastIDs.length+1 === blobbs.aliveIDs.length ? [blobbs.focusedBlobb.number] : blobbs.pastIDs.map(v => v).concat(blobbs.focusedBlobb.number)
    const nAlivesIDs = blobbs.aliveIDs.filter(v => !pastIDs.includes(v))
    console.log("nAlive", nAlivesIDs, pastIDs)
    const focusedBlobb = await _getBlobbToFocus(nAlivesIDs[Math.floor(Math.random() * nAlivesIDs.length)])
    console.log(focusedBlobb, pastIDs)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb, pastIDs }})
  }

  const _attackFocusedBlobb = async () => {
    console.log("ATTACK")
    if(blobbs.focusedBlobb) {
      const price = await contract.attackPrice()
      console.log("ATTACK PRICE", price)
      const transaction = await contract.attackBlob(blobbs.focusedBlobb.number, {value: price})
      await transaction.wait()
    }
  }

  const _asyncFilter = async (array, predicate) => Promise.all(array.map(predicate)).then(res => array.filter((_v, idx) => res[idx]))

  const funcs = {
    focusNewBlobb: _focusNewBlobb,
    attackFocusedBlobb: _attackFocusedBlobb
  }

  return(
    <BlobbsContext.Provider value={{blobbs, blobbsDispatch, funcs}}>
      {children}
    </BlobbsContext.Provider>
  )
}

export default BlobbsContext