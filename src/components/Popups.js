import { useContext } from "react"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import classes from "./Popups.module.css"

let { POPUPS_TYPES } = require("./../popups-types")

function Popups() {
  const {state: { popups }, funcs: { popPopup }} = useContext(EtherContext)

  const popupElement = pType => {
    switch(pType) {
      //SUCCESS POPUPS
      case POPUPS_TYPES.HEALED: 
        return <>YOU <span className={classes.highlight}>HEALED</span> YOUR BLOBB</>  
      case POPUPS_TYPES.ATTACKED: 
        return <>YOUR BLOBB <span className={classes.highlight}>LOST 1 HP</span></>
      case POPUPS_TYPES.EXP: 
        return <>YOUR BLOBB <span className={classes.highlight}>HAS GAINED 1 EXP</span></>
      case POPUPS_TYPES.KILLED: 
        return <>YOU <span className={classes.highlight}>KILLED</span> A BLOBB</>
      
      //FAIL POPUPS
      case POPUPS_TYPES.REJECTED: 
        return <>TRANSACTION <span className={classes.highlight}>REJECTED</span></>
      case POPUPS_TYPES.FUNDS: 
        return <><span className={classes.highlight}>INSUFFICIENT</span> FUNDS</> 
      case POPUPS_TYPES.FAILED: 
        return <>TRANSACTION <span className={classes.highlight}>FAILED</span></> 
    }
    
  }

  // if(popups) console.log(Array.from(popups.entries()))
  return (
    <div className={classes.trigger_div}>
      {/* {popups && Array.from(popups.entries()).map(keyValue => {
        if(keyValue[1].idx >= 0) {
          return <div key={keyValue[0]} className={classes.trigger_popup_div} style={{"top": 40*keyValue[1].idx}} onAnimationEnd={anim => {
            if(anim.animationName.includes("r-p")) return
            popPopup()
          }}>
            {popupElement(keyValue[1].pType)}
          </div>
        }
      })} */}
      {popups && popups.map((popup, vIDX) => {
        if(popup.idx >= 0) {
          return <div key={vIDX} className={classes.trigger_popup_div} style={{"top": 40*popup.idx}} onAnimationEnd={anim => {
            if(anim.animationName.includes("r-p")) return
            popPopup()
          }}>
            {popupElement(popup.pType)}
          </div>
        }
      })}
      
    </div>
  )
}

export default Popups