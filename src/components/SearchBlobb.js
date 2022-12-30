import { useContext, useEffect, useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"

import classes from "./SearchBlobb.module.css"

const ACTIONS = {INIT: "init", SET: "set", RESET: "reset"}
const initialData = {textValue: "", isBarFocused: false, errMsg: {errDiv: null, change: false}}
const reducer = (searchBarData, action) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.INIT:
      return { ...searchBarData, ...data }
    case ACTIONS.SET:
      return { ...searchBarData, ...data }
    case ACTIONS.RESET:
      return { ...searchBarData, ...initialData }
    default:
      return searchBarData
  }
}

function SearchBlobb() {
  const { blobbs: { totalBlobs }, funcs: { searchNewBlobb } } = useContext(BlobbsContext)
  const [searchBarData, serachBarDispatch] = useReducer(reducer, initialData) 
  const navigate = useNavigate()

  useEffect(() => {
    const onEnterKeyPress = e => {
      if(e.key === "Enter") searchBlobbHandler()
    }

    if(searchBarData.isBarFocused) window.addEventListener("keydown", onEnterKeyPress)
    return () => window.removeEventListener("keydown", onEnterKeyPress)
  }, [searchBarData])  

  async function searchBlobbHandler() {
    const errMsgClass = searchBarData.errMsg.change ? classes.error_div_2 : classes.error_div_1
    if(!searchBarData.textValue) {
      serachBarDispatch({
        type: ACTIONS.SET, 
        data: {errMsg: {errDiv: <div className={errMsgClass}>TYPE SOME DATA</div>, change: !searchBarData.errMsg.change}}
      })
      return
    }
    const result = await searchNewBlobb(searchBarData.textValue)
    if(result === 1) navigate("/bsearch/sblobb")
    else serachBarDispatch({
      type: ACTIONS.SET, 
      data: {errMsg: {
        errDiv: <div className={errMsgClass}>{!result ? "WRONG INPUT" : result === 2 ? "THAT'S YOUR BLOBB" : "NO BLOBB WAS FOUND"}</div>, 
        change: !searchBarData.errMsg.change
      }}
    })
  }

  return(
    <div className={classes.search_div_container}>
      <div className={classes.info_div_container}>
        <div className={classes.info_div}>
          <span className={classes.info_div_title}>GO FIND OTHER <span className={classes.highlight}>BLOBBS</span></span>
          <p>Are you interested to go find some specific <span className={classes.highlight}>BLOBB?</span></p>
          <p>You can do it from here!</p>
          <p>Enter the <span className={classes.highlight}>NUMBER</span> or the <span className={classes.highlight}>OWNER ADDRESS</span> of the BLOBB you want and go visit it.</p>
          <p>Attacking a specific BLOBB will cost a little more.</p>
          <p><span className={classes.highlight} style={{"fontSize": "18px"}}>EXISTING BLOBBS: {totalBlobs}</span></p>
        </div>
      </div>
      <div className={classes.search_bar}>
        <input type="text" 
          value={searchBarData.textValue} 
          className={classes.search_input} 
          placeholder="GET BLOBB BY NUMBER OR OWNER"
          spellCheck="false"
          onChange={inputRef => serachBarDispatch({type: ACTIONS.SET, data: {textValue: inputRef.target.value}})}
          onFocus={() => serachBarDispatch({type: ACTIONS.SET, data: {isBarFocused: true}})}
          onBlur={() => serachBarDispatch({type: ACTIONS.SET, data: {isBarFocused: false}})}
        />
        <div className={classes.search_enter_button} onClick={searchBlobbHandler}>
          <span className={classes.arrows}>{">>"}</span>
        </div>
      </div>
      {searchBarData.errMsg.errDiv}
    </div>
  )
}

export default SearchBlobb