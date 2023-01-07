import { useContext, useEffect, useReducer } from "react"

import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"

import classes from "./MyHistory.module.css"
import Problem from "./Problem"
import { useNavigate } from "react-router-dom"

const ACTIONS = {INIT: "init", SET: "set", RESET: "reset"}
const initialData = {history: null, page: null, prevsHP: [], isLastPage: false, hClass: classes.history_div_FR1}
const reducer = (historyData, action) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.INIT:
      return { ...historyData, ...data }
    case ACTIONS.SET:
      return { ...historyData, ...data }
    case ACTIONS.RESET:
      return { ...historyData, ...initialData }
    default:
      return historyData
  }
}

function MyHistory() {
  const {blob: { number }, funcs: { getBlobbHistory }} = useContext(MyBlobContext)
  const {funcs: { searchNewBlobb }} = useContext(BlobbsContext)
  const [historyData, historyDispatch] = useReducer(reducer, initialData)
  const navigate = useNavigate()
  
  console.log("THIS IS THE HISTORY: ", historyData)
  useEffect(() => { 
    const getHistory = async () => {  
      const { history, isLastPage } = await getBlobbHistory(1)
      historyDispatch({type: ACTIONS.SET, data: { history, page: 1, prevsHP: [], isLastPage }})
    }
    if(number) getHistory()
    else historyDispatch({type: ACTIONS.RESET})    
  }, [number])

  async function prevPageHandler() {
    const page = historyData.page - 1
    if(page === 0) return

    const newPageStartingHP = historyData.prevsHP[historyData.prevsHP.length-1]
    const prevsHP = historyData.prevsHP.filter((_v, idx) => idx < historyData.prevsHP.length-1)
    console.log("PREV: ", newPageStartingHP, prevsHP)

    let hClass 
    if(historyData.hClass === classes.history_div_FL1) hClass = classes.history_div_FL2
    else if(historyData.hClass === classes.history_div_FL2) hClass = classes.history_div_FL1
    else hClass = classes.history_div_FL1

    const { history, isLastPage } = await getBlobbHistory(page, newPageStartingHP)
    historyDispatch({type: ACTIONS.SET, data: { history, page, prevsHP, isLastPage, hClass }})
  }

  async function nextPageHandler() {
    if(historyData.isLastPage) return
    const page = historyData.page + 1

    const newPageStartingHP = historyData.history[historyData.history.length-1].fromHP
    const prevsHP = historyData.prevsHP.concat(historyData.history[0].toHP)
    console.log("NEXT: ", newPageStartingHP, prevsHP)

    let hClass 
    if(historyData.hClass === classes.history_div_FR1) hClass = classes.history_div_FR2
    else if(historyData.hClass === classes.history_div_FR2) hClass = classes.history_div_FR1
    else hClass = classes.history_div_FR1

    const { history, isLastPage } = await getBlobbHistory(page, newPageStartingHP)
    historyDispatch({type: ACTIONS.SET, data: { history, page, prevsHP, isLastPage, hClass }})
  }

  async function profileClickHandler(aID) {
    if(aID === number) return
    const result = await searchNewBlobb(aID.toString())
    if(result) navigate("/blobb-dapp-nft/bsearch/sblobb")
    else console.log("NOT OK")
  }

  if(!number) return <Problem problem="owner"/>

  if(!historyData.history) 
    return (
      <div className={classes.history_div_container} style={{"justifyContent": "center"}}>
        NOTHING TO SHOW
      </div>
    )
  
  return(
    <div className={classes.history_div_container}>
      <div className={historyData.hClass}>
        {historyData.history.map((hAction, idx) => {
          let arrowColor = hAction.action === "HEAL" ? "lime" : "red"
          let actionText = hAction.action === "HEAL" ? <span>YOU <span className={classes.highlight}>HEALED</span> YOUR BLOBB</span> : <span><span className={classes.highlight}>ATTACKED</span> YOUR BLOBB</span>
          const colorsVars = {"--start-color": "rgb("+hAction.bColors.start+")", "--end-color": "rgb("+hAction.bColors.end+")"}

          return( 
            <div key={idx} className={classes.history_element}>
              <div className={classes.enemy_prfile_circle} 
                style={colorsVars} 
                innertext={"#"+hAction.actorID} 
                onClick={() => profileClickHandler(hAction.actorID)} 
              /> :
              <div className={classes.action_text}>{actionText}</div>
              <div className={classes.action_hp_div}>
                <span className={classes.hp_span}>{hAction.fromHP}</span>
                <span className={classes.arrows} style={{"--arrow-color": arrowColor}}>{">>"}</span>
                <span className={classes.hp_span}>{hAction.toHP}</span>
              </div>
              
            </div>
          )
        })}
      </div>
      {/* PAGES SECTION */}
      <div className={classes.pages_div_container}>
        <span className={classes.title_span}>YOUR <span className={classes.highlight}>BLOBB</span> HISTORY</span>
        <div className={classes.pages_buttons_div}>
          <div className={classes.page_button_div}>
            <div className={historyData.page === 1 ? classes.page_button_off : classes.prev_button} onClick={prevPageHandler}>
              <span className={classes.arrows}>{"<<"}</span>
            </div>
          </div>
          
          <div className={classes.page_number}>
            {historyData.page}
          </div>
          <div className={classes.page_button_div}>
            <div className={historyData.isLastPage ? classes.page_button_off : classes.next_button} onClick={nextPageHandler}>
              <span className={classes.arrows}>{">>"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyHistory