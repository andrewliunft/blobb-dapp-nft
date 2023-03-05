import { createContext, useContext, useEffect, useReducer } from "react"
import EtherContext from "../EtherContext/EtherProvider"

import { ethers } from "ethers"
import Blobb from "../../artifacts/contracts/Blobb.sol/Blobb.json"

let { POPUPS_TYPES } = require("../../popups-types")

const MyBlobContext = createContext()

const ACTIONS = {SET: "set", RESET: "reset"}
const initBlob = {number: null, birthday: null, hp: null, totalActions: null, totalAttacks: null, kills: null, death: null, creator: null, owner: null, lastHit: null, colors: null, bType: null, king: null}
const reducer = (blob, action) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.SET:
      return { ...blob, ...data }
    case ACTIONS.RESET:
      return { ...blob, ...initBlob }
    default:
      return blob
  }
}

const iface = new ethers.utils.Interface(Blobb.abi)

export function MyBlobProvider({ children }) {
  const {state: { account, contract, alchemy }, funcs: { pushPopup }} = useContext(EtherContext)
  const [blob, blobDispatch] = useReducer(reducer, initBlob)

  // setTimeout(() => {
  //   pushPopup(0)
  // }, 1000);
  //EVENTS HANDLER CALLBACK - toBlobID, madeFrom, newHP, newTotAttks, kingOfBlobbs, event
  const _actionEventsHandler = log => {
    const [ toBlobID, madeFrom, newHP, newTotAttks, kingOfBlobbs ] = iface.parseLog(log).args
    console.log("Action to MyBlobProvider EMITTED: Healed or Attacked", toBlobID, madeFrom, newHP, newTotAttks, kingOfBlobbs)
    console.log("VALUE: ", blob)
    const eventBlobHP = parseInt(newHP._hex, 16)
    if(eventBlobHP === blob.hp) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return 
    }

    if(eventBlobHP < blob.hp) pushPopup([POPUPS_TYPES.ATTACKED])
    const death = eventBlobHP === 0 ? _getDateFromTimestamp(Date.now()/1000) : "ALIVE"
    
    blobDispatch({type: ACTIONS.SET, data: {hp: eventBlobHP, totalActions: ++blob.totalActions, death}})
  }
  const _attackEventHandler = log => {
    const [ toBlobID, madeFrom, newHP, newTotAttks, kingOfBlobbs ] = iface.parseLog(log).args
    console.log("Action to MyBlobProvider EMITTED: Attack", toBlobID, madeFrom, newHP, newTotAttks, kingOfBlobbs)
    const eventBlobTotAttks = parseInt(newTotAttks._hex, 16)
    if(eventBlobTotAttks === blob.totalAttacks) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return
    }
    const king = blob.number === parseInt(kingOfBlobbs._hex, 16)
    blobDispatch({type: ACTIONS.SET, data: {totalAttacks: eventBlobTotAttks, king}})
  }

  //CONTRACT EVENTS LISTENER 
  useEffect(() => {
    if(!blob.number) return
    alchemy.ws.once(contract.filters.Action(blob.number), _actionEventsHandler) //_actionEventsHandler
    alchemy.ws.once(contract.filters.Action(null, blob.number), _attackEventHandler) // _attackEventHandler

    console.log("Action EVENT CONNECTED to MyBlobProvider")
    return () => {
      alchemy.ws.off(contract.filters.Action(blob.number), _actionEventsHandler)
      alchemy.ws.off(contract.filters.Action(null, blob.number), _attackEventHandler)
    }
  }, [blob])

  //INIT CONTEXT
  useEffect(() => {
    console.log("TRY GET BLOB", account, contract)
    if(account) getBlob() //account && contract
    else blobDispatch({type: ACTIONS.RESET})
  }, [account, contract])

  const getBlob = async () => {
    let myBlobID
    try {
      myBlobID = (await contract.ownedBlob(account)).toNumber()
    } catch(e) {
      console.error("Contract function call failed!", e)
      myBlobID = 0
    }
    console.log("b:", myBlobID)
    if(!myBlobID) { 
      blobDispatch({type: ACTIONS.SET, data: {...initBlob, ...{number: myBlobID}}})
      return
    }
    console.log(await contract.tokenURI(myBlobID))
    const myBlob = await contract.blobs(myBlobID)
    const myBlobInfo = {
      number: parseInt(myBlob.blobID._hex, 16),
      birthday: _getDateFromTimestamp(parseInt(myBlob.birthday._hex, 16)),
      hp: parseInt(myBlob.hp._hex, 16),
      totalActions: parseInt(myBlob.totalActions._hex, 16),
      totalAttacks: parseInt(myBlob.totalAttacks._hex, 16),
      kills: parseInt(myBlob.kills._hex, 16),
      death: myBlob.deathDate._hex > 0 ? _getDateFromTimestamp(parseInt(myBlob.deathDate._hex, 16)) : "ALIVE",
      creator: myBlob.creator,
      owner: myBlob.owner,
      lastHit: myBlob.lastHit || "NONE",
      colors: await _getBlobbColors(myBlobID),
      bType: parseInt(myBlob.blobType._hex, 16),
      king: await _isThekingOfBlobbs(myBlobID)
    }
    console.log("BLOB GET", myBlobInfo, myBlob)
    blobDispatch({type: ACTIONS.SET, data: myBlobInfo})
  }

  const _getDateFromTimestamp = ts => {
    const dateInSecs = new Date(ts*1000)
    let month = dateInSecs.getMonth()+1
    let day = dateInSecs.getDate()
    
    month = month.toString().length === 1 ? "0" + month : month
    day = day.toString().length === 1 ? "0" + day : day
    
    return month + "/" + day + "/" + dateInSecs.getFullYear()
  }

  const _getBlobbColors = async blobID => {
    let colors = []
    for(let i = 0; i < 6; i++) {
      const color = await contract.blobbColors(blobID, i)
      colors.push(parseInt(color._hex, 16))
    }
    return {start: colors.slice(0,3).join(), end: colors.slice(-3).join()}
  }

  const _isThekingOfBlobbs = async blobID => {
    const king = await contract.theKingOfBlobbs()
    if(parseInt(king._hex, 16) === blobID) return true
    return false
  }

  const _mintBlob = async (blobProperties) => {
    let price = ethers.utils.formatEther(await contract.mintPrice())
    const { cStart, cEnd, bType } = blobProperties
    price = parseFloat(price) + (1.5 * bType) + ""
    const transaction = await contract.mintBlob(_hexsToRGB(cStart, cEnd), bType, { value: ethers.utils.parseEther(price) })
    const receipt = await transaction.wait()
    console.log("RECEIPT", receipt)
    getBlob()
    // return price.toNumber()
  }

  const _hexsToRGB = (sHcol, eHCol) => {
    let arrayRGBs = [
      parseInt(sHcol.slice(1, 3), 16), parseInt(sHcol.slice(3, 5), 16), parseInt(sHcol.slice(5, 7), 16), 
      parseInt(eHCol.slice(1, 3), 16), parseInt(eHCol.slice(3, 5), 16), parseInt(eHCol.slice(5, 7), 16), 
    ]
    return arrayRGBs
  } 

  const _healBlob = async () => {
    if(blob.number) {
      const price = await contract.healPrice()
      console.log("HEAL PRICE", price, blob.number)
      const transaction = await contract.healBlob(blob.number, {value: price})
      await transaction.wait()
      // getBlob() //Re-fetching by the action event handler
    }
  }

  const _getBlobbHistory = async (page, startingHP) => {
    if(!blob.number) return
    const MAX_IN_PAGE = 5
    const startIDX = Math.max(blob.totalActions - ((page-1) * MAX_IN_PAGE), 0)
    const endIDX = Math.max(blob.totalActions - (page * MAX_IN_PAGE), 0)
    
    let isLastPage = endIDX === 0 ? true : false
    let hpTracker = page === 1 ? blob.hp : startingHP 
    let history = []
    console.log("IDX HISTORY", startIDX, endIDX, blob.totalActions, hpTracker)
    for(let i = startIDX; i > endIDX; i--) {
      const actorID = parseInt((await contract.blobbHistory(blob.number, i))._hex, 16)
      const action = actorID === blob.number ? "HEAL" : "ATTACK"
      const bColors = action === "HEAL" ? blob.colors : await _getBlobbColors(actorID)
      const toHP = hpTracker

      hpTracker += action === "HEAL" ? -1 : 1
      const fromHP = hpTracker
      history.push({ actorID, action, fromHP, toHP, bColors })
    }
    history = history.length === 0 ? null : history
    console.log("HISTORY", history)
    return { history, isLastPage }
  }

  const funcs = {
    mintBlob: _mintBlob,
    healBlob: _healBlob,
    getBlobbHistory: _getBlobbHistory
  }

  return(
    <MyBlobContext.Provider value={{blob, blobDispatch, funcs}}>
      {children}
    </MyBlobContext.Provider>
  )
}

export default MyBlobContext