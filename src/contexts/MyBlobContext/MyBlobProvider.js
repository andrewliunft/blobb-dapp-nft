import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import EtherContext from "../EtherContext/EtherProvider";

const MyBlobContext = createContext()

const ACTIONS = {SET: "set", RESET: "reset"}
const initBlob = {blobID: null, life: null, hp: null, creator: null, lastHit: null, isDead: null}
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

  useEffect(() => {
    console.log("TRY GET BLOB", account, contract)
    if(account) getBlob() //account && contract
    else blobDispatch({type: ACTIONS.RESET})
  }, [account, contract])

  useEffect(() => {
    if(!contract) return 
    console.log("BLOB EVENT", blob)
    const attackEventEmitted = (attacker, attackedOwner, toBlobID) => {
      console.log("ATTACK EVENT")
      if(account === attackedOwner.toLowerCase()) {
        console.log("YOUR BLOB #"+toBlobID+" GOT ATTACKED FROM: ", attacker)
        getBlob()
      }
    }
    contract.on("Attack", attackEventEmitted)

    return () => {
      console.log("REMOVE BLOB EVENTS")
      contract.removeListener("Attack", attackEventEmitted)
    }
  }, [contract])

  const getBlob = async () => {
    const nblobID = (await contract.ownedBlob(account)).toNumber()
    if(!nblobID) { 
      blobDispatch({type: ACTIONS.RESET})
      return
    }

    const nBlob = await contract.blobs(nblobID)
    const blobInfo = {
      blobID: parseInt(nBlob.blobID._hex, 16),
      life: parseInt(nBlob.life._hex, 16),
      hp: parseInt(nBlob.hp._hex, 16),
      creator: nBlob.creator,
      lastHit: nBlob.lastHit,
      isDead: nBlob.isDead
    }
    console.log("BLOB GET")
    blobDispatch({type: ACTIONS.SET, data: blobInfo})
  }

  const getBlobStats = async () => {

  }

  const getOwnerStats = async () => {

  }

  const _mintBlob = async () => {
    const price = await contract.mintPrice()
    const transaction = await contract.mintBlob({value: price})
    await transaction.wait()
    getBlob()
    // return price.toNumber()
  }

  const _healBlob = async () => {
    if(blob.blobID) {
      const price = await contract.healPrice()
      console.log("HEAL PRICE", price)
      const transaction = await contract.healBlob(blob.blobID, {value: price})
      await transaction.wait()
      getBlob()
    }
  }

  const getAllBlobs = async () => {

  }

  const funcs = {
    mintBlob: _mintBlob,
    healBlob: _healBlob
  }

  return(
    <MyBlobContext.Provider value={{blob, blobDispatch, funcs}}>
      {children}
    </MyBlobContext.Provider>
  )
}

export default MyBlobContext