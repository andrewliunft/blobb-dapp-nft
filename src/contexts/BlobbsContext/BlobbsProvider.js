import { createContext, useCallback, useContext, useEffect, useReducer } from "react"
import EtherContext from "../EtherContext/EtherProvider"
import MyBlobContext from "../MyBlobContext/MyBlobProvider"

import { ethers } from "ethers";

const BlobbsContext = createContext()

const ACTIONS = {SET: "set", FOCUS: "focus", RESET: "reset"}
const initBlobbs = {focusedBlobb: null, aliveIDs: null, pastIDs: [], totalBlobs: 0, searchedBlobb: null}
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
  const _actionEventsHandlerFB = (toBlobID, madeFrom, newHP, newTotAttks, event) => {
    console.log("Action to BlobbsProvider EMITTED", toBlobID, madeFrom, newHP, newTotAttks, event)
    console.log("VALUE: ", blobbs)
    const eventBlobHP = parseInt(newHP._hex, 16)
    if(eventBlobHP === blobbs.focusedBlobb.hp) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return
    }
    const death = eventBlobHP === 0 ? _getDateFromTimestamp(Date.now()/1000) : "ALIVE"
    const focusedBlobb = {...blobbs.focusedBlobb, ...{hp: eventBlobHP, death}}
    console.log("NEW VALUE", focusedBlobb)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb }})

  }
  const _actionEventsHandlerSB = (toBlobID, madeFrom, newHP, newTotAttks, event) => {
    console.log("Action to BlobbsProvider EMITTED", toBlobID, madeFrom, newHP, newTotAttks, event)
    console.log("VALUE: ", blobbs)
    const eventBlobHP = parseInt(newHP._hex, 16)
    if(eventBlobHP === blobbs.searchedBlobb.hp) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return
    }
    const death = eventBlobHP === 0 ? _getDateFromTimestamp(Date.now()/1000) : "ALIVE"
    const searchedBlobb = {...blobbs.searchedBlobb, ...{hp: eventBlobHP, death}}
    console.log("NEW VALUE", searchedBlobb)
    blobbsDispatch({type: ACTIONS.SET, data: { searchedBlobb }})

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
    const totalBlobs = blobbs.totalBlobs + 1
    blobbsDispatch({type: ACTIONS.SET, data: { aliveIDs, totalBlobs }})
  }  

  //CONTRACT EVENTS LISTENER 
  useEffect(() => {
    if(!blobbs.focusedBlobb) return
    contract.on(contract.filters.Action(blobbs.focusedBlobb.number), _actionEventsHandlerFB)
    contract.on(contract.filters.NewBlobb(), _newBlobbEventHandler)

    console.log("Action AND NewBlobb EVENTS CONNECTED to BlobbsProvider", contract.listeners())
    return () => {
      contract.off(contract.filters.Action(blobbs.focusedBlobb.number), _actionEventsHandlerFB)
      contract.off(contract.filters.NewBlobb(), _newBlobbEventHandler)
    }
  }, [blobbs.focusedBlobb])

  useEffect(() => {
    if(!blobbs.searchedBlobb) return
    contract.on(contract.filters.Action(blobbs.searchedBlobb.number), _actionEventsHandlerSB)

    console.log("Action AND NewBlobb EVENTS CONNECTED to BlobbsProvider", contract.listeners())
    return () => {
      contract.off(contract.filters.Action(blobbs.searchedBlobb.number), _actionEventsHandlerSB)
    }
  }, [blobbs.searchedBlobb])

  //INIT CONTEXT
  useEffect(() => {
    const getTotalBlobsNumber = async () => {
      const totalBlobs = parseInt((await contract.getTotalBlobbsNumber())._hex, 16)
      blobbsDispatch({type: ACTIONS.SET, data: { totalBlobs }})
    }

    blobbsDispatch({type: ACTIONS.RESET})
    if(contract && number) setBlobbs()
    else if(contract && !number) getTotalBlobsNumber()
  }, [number, contract])

  const setBlobbs = async () => {
    const {totalBlobs, aliveIDs} = await _getAliveIDs()
    if(aliveIDs.length === 0) {
      blobbsDispatch({type: ACTIONS.SET, data: { totalBlobs }})
      return
    }

    console.log("ALIVES: ", aliveIDs, totalBlobs)
    const focusedBlobb = await _getBlobb(aliveIDs[Math.floor(Math.random() * aliveIDs.length)])
    console.log(focusedBlobb)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb, aliveIDs, totalBlobs }})
  }

  const _getDateFromTimestamp = ts => {
    const dateInSecs = new Date(ts*1000)
    let month = dateInSecs.getMonth()+1
    let day = dateInSecs.getDate()
    
    month = month.toString().length === 1 ? "0" + month : month
    day = day.toString().length === 1 ? "0" + day : day
    
    return month + "/" + day + "/" + dateInSecs.getFullYear()
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
    const totalBlobsNumber = await contract.getTotalBlobbsNumber()
    let allIDs = Array.from({length: totalBlobsNumber}, (_v, idx) => idx+1).filter(value => value !== number)
    return {
      totalBlobs: parseInt(totalBlobsNumber._hex, 16), 
      aliveIDs: await _asyncFilter(allIDs, async value => (await contract.blobs(value)).hp > 0)
    }
  }

  const _getBlobb = async (bIdentifier, isAddress) => {
    console.log("FOCUS ID", bIdentifier, isAddress)
    let bID = bIdentifier
    let blobb
    try {
      if(isAddress) {
        bID = await contract.ownedBlob(ethers.utils.getAddress(bIdentifier))
        blobb = await contract.blobs(bID)
      }
      else {
        blobb = await contract.blobs(bIdentifier)
      }
    } catch(e) {
      return 0
    }

    return {
      number: parseInt(blobb.blobID._hex, 16),
      birthday: _getDateFromTimestamp(parseInt(blobb.birthday._hex, 16)),
      hp: parseInt(blobb.hp._hex, 16),
      totalActions: parseInt(blobb.totalActions._hex, 16),
      totalAttacks: parseInt(blobb.totalAttacks._hex, 16),
      kills: parseInt(blobb.kills._hex, 16),
      death: blobb.deathDate._hex > 0 ? _getDateFromTimestamp(parseInt(blobb.deathDate._hex, 16)) : "ALIVE",
      creator: blobb.creator,
      owner: blobb.owner,
      lastHit: blobb.lastHit || "NONE",
      colors: await _getBlobbColors(parseInt(bID, 16))
    }
  }

  const _focusNewBlobb = async () => {
    console.log("past", blobbs.pastIDs, blobbs.aliveIDs)
    if(blobbs.aliveIDs.length === 1) return
    const pastIDs = blobbs.pastIDs.length+1 === blobbs.aliveIDs.length ? [blobbs.focusedBlobb.number] : blobbs.pastIDs.map(v => v).concat(blobbs.focusedBlobb.number)
    const nAlivesIDs = blobbs.aliveIDs.filter(v => !pastIDs.includes(v))
    console.log("nAlive", nAlivesIDs, pastIDs)
    const focusedBlobb = await _getBlobb(nAlivesIDs[Math.floor(Math.random() * nAlivesIDs.length)])
    console.log(focusedBlobb, pastIDs)
    blobbsDispatch({type: ACTIONS.SET, data: { focusedBlobb, pastIDs }})
  }

  const _attackFocusedBlobb = async () => {
    console.log("ATTACK FOCUSED")
    if(blobbs.focusedBlobb) {
      // const price = await contract.attackPrice()
      const price = ethers.utils.parseEther(blobbs.focusedBlobb.hp === 1 ? "0.04" : "0.02")
      console.log("ATTACK PRICE", price)
      const transaction = await contract.attackBlob(blobbs.focusedBlobb.number, {value: price})
      await transaction.wait()
    }
  }
  const _attackSearchedBlobb = async () => {
    console.log("ATTACK SEARCHED")
    if(blobbs.searchedBlobb) {
      // const price = await contract.attackPrice()
      const price = ethers.utils.parseEther(blobbs.searchedBlobb.hp === 1 ? "0.045" : "0.025")
      console.log("ATTACK PRICE", price)
      const transaction = await contract.attackBlob(blobbs.searchedBlobb.number, {value: price})
      await transaction.wait()
    }
  }
  
  const _asyncFilter = async (array, predicate) => Promise.all(array.map(predicate)).then(res => array.filter((_v, idx) => res[idx]))

  const _searchNewBlobb = async bIdentifier => {
    console.log("SEARCHING", bIdentifier, "1000".length, parseInt(bIdentifier))
    if(!isNaN(bIdentifier) && parseInt(bIdentifier) === number) return 2
    
    const isAddress = ethers.utils.isAddress(bIdentifier)
    const searchedBlobb = await _getBlobb(bIdentifier, isAddress)
    if(!searchedBlobb) return 0
    if(!searchedBlobb.number ) return 4
    if(searchedBlobb.number === number) return 2

    blobbsDispatch({type: ACTIONS.SET, data: { searchedBlobb }})
    return 1
  }

  const funcs = {
    focusNewBlobb: _focusNewBlobb,
    attackFocusedBlobb: _attackFocusedBlobb,
    searchNewBlobb: _searchNewBlobb,
    attackSearchedBlobb: _attackSearchedBlobb
  }

  return(
    <BlobbsContext.Provider value={{blobbs, blobbsDispatch, funcs}}>
      {children}
    </BlobbsContext.Provider>
  )
}

export default BlobbsContext