import { createContext, useContext, useEffect, useReducer } from "react";
import EtherContext from "../EtherContext/EtherProvider";

const MyBlobContext = createContext()

const ACTIONS = {SET: "set", RESET: "reset"}
const initBlob = {number: null, birthday: null, hp: null, totalActions: null, kills: null, death: null, creator: null, owner: null, lastHit: null, colors: null}
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

export function MyBlobProvider({ children }) {
  const {state: { account, contract }} = useContext(EtherContext)
  const [blob, blobDispatch] = useReducer(reducer, initBlob)

  //EVENTS HANDLER CALLBACK
  const _actionEventsHandler = (toBlobID, madeFrom, newHP, event) => {
    console.log("Action to MyBlobProvider EMITTED", toBlobID, madeFrom, newHP, event)
    console.log("VALUE: ", blob)
    const eventBlobHP = parseInt(newHP._hex, 16)
    if(eventBlobHP === blob.hp) {
      console.log("FALSE EVENT - NOTHING TO FETCH")
      return
    }
    blobDispatch({type: ACTIONS.SET, data: {hp: eventBlobHP, totalActions: blob.totalActions++}})
  }

  //CONTRACT EVENTS LISTENER 
  useEffect(() => {
    if(!blob.number) return
    contract.on(contract.filters.Action(blob.number), _actionEventsHandler)

    console.log("Action EVENT CONNECTED to MyBlobProvider", contract.listeners(), blob)
    return () => contract.off(contract.filters.Action(blob.number), _actionEventsHandler)
  }, [blob])

  //INIT CONTEXT
  useEffect(() => {
    console.log("TRY GET BLOB", account, contract)
    if(account) getBlob() //account && contract
    else blobDispatch({type: ACTIONS.RESET})
  }, [account, contract])

  const getBlob = async () => {
    const myBlobID = (await contract.ownedBlob(account)).toNumber()
    console.log("b:", myBlobID)
    if(!myBlobID) { 
      blobDispatch({type: ACTIONS.RESET})
      return
    }
    console.log(await contract.tokenURI(myBlobID))
    const myBlob = await contract.blobs(myBlobID)
    const myBlobInfo = {
      number: parseInt(myBlob.blobID._hex, 16),
      birthday: _getBlobbBirthday(myBlob.birthday._hex, 16),
      hp: parseInt(myBlob.hp._hex, 16),
      totalActions: parseInt(myBlob.totalActions._hex, 16),
      kills: parseInt(myBlob.kills._hex, 16),
      death: parseInt(myBlob.deathDate._hex, 16) || "ALIVE",
      creator: myBlob.creator,
      owner: myBlob.owner,
      lastHit: myBlob.lastHit || "NONE",
      colors: await _getBlobbColors(myBlobID),
    }
    console.log("BLOB GET", myBlobInfo, myBlob)
    blobDispatch({type: ACTIONS.SET, data: myBlobInfo})
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

  const _mintBlob = async (startHexColor, endHexColor) => {
    const price = await contract.mintPrice()
    const transaction = await contract.mintBlob(_hexsToRGB(startHexColor, endHexColor), {value: price})
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
    const MAX_IN_PAGE = 10
    const startIDX = Math.max(blob.totalActions - ((page-1) * MAX_IN_PAGE), 0)
    const endIDX = Math.max((blob.totalActions - (page * MAX_IN_PAGE)) - MAX_IN_PAGE, 0)
    console.log("IDX HISTORY", startIDX, endIDX, blob.totalActions, contract)
    let hpTracker = startingHP ? startingHP : blob.hp
    let history = []
    for(let i = startIDX; i > endIDX; i--) {
      const actorID = parseInt((await contract.blobbHistory(blob.number, i))._hex, 16)
      const action = actorID === blob.number ? "HEAL" : "ATTACK"
      const toHP = hpTracker
      hpTracker += i === startIDX ? 0 : action === "HEAL" ? 1 : -1
      const fromHP = hpTracker
      history.push({ actorID, action, fromHP, toHP })
    }
    console.log("HISTORY", history)
    return history
  }

  const funcs = {
    mintBlob: _mintBlob,
    healBlob: _healBlob,
    getBlobbHistory: _getBlobbHistory,
  }

  return(
    <MyBlobContext.Provider value={{blob, blobDispatch, funcs}}>
      {children}
    </MyBlobContext.Provider>
  )
}

export default MyBlobContext