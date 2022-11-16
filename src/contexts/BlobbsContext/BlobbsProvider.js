import { createContext, useCallback, useContext, useEffect, useReducer } from "react"
import EtherContext from "../EtherContext/EtherProvider"

const BlobbsContext = createContext()

const ACTIONS = {SET: "set", RESET: "reset"}
const initBlobbs = {}
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
  const {state: { account, contract }} = useContext(EtherContext)
  const [blobbs, blobbsDispatch] = useReducer(reducer, initBlobbs)
}

export default BlobbsContext