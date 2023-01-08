import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"

import classes from "./BlobbActions.module.css"

function BlobbActions({ currAccount, blobb }) {
  const {funcs: { newWalletRequest }} = useContext(EtherContext)
  const {funcs: { healBlob }} = useContext(MyBlobContext)
  const navigate = useNavigate()

  function healButtonHandler() {
    newWalletRequest("HEAL", "HEALING YOUR BLOBB!", healBlob)
  }

  function getInfoMessageLeft() {
    switch(blobb.hp) {
      case 10: 
        return <span className={classes.info_comic_span_L}>
          YOUR BLOBB IS <span className={classes.highlight}>FULL HP</span>
        </span>
      case 0:
        return <span className={classes.info_comic_span_L}>
          YOUR BLOBB IS <span className={classes.highlight}>DEAD</span>
        </span>
      default:
        return <span className={classes.info_comic_span_L}>
          <span className={classes.highlight}>0.001 ETH</span> + <span className={classes.highlight}>GAS</span>
        </span>
    }
  }

  function getInfoMessageRight() {
    switch(blobb.hp) {
      case 0:
        return <span className={classes.info_comic_span_R}>
          YOUR BLOBB IS <span className={classes.highlight}>DEAD</span>
        </span>
      default:
        return <span className={classes.info_comic_span_R}>
          ATTACK RANDOM <span className={classes.highlight}>BLOBBs.</span>
        </span>
    }
  }

  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>BLOBB</span> FOR MORE INFO</span>
      <div className={classes.actions_div}>
        <span className={classes.info_span_L}>
          i
          {getInfoMessageLeft()}
        </span>
        <div className={blobb.hp < 10 && blobb.hp >= 1 ? classes.heal_button : classes.heal_button_off} onClick={healButtonHandler}>
          {blobb.hp === 0 ? "dead" : "heal"}
        </div>
        <div className={blobb.hp === 0 ? classes.heal_button_off : classes.attack_button} onClick={() => navigate("/benemy")}>
          attack <span className={classes.arrows}>{">>"}</span>
        </div>
        {/* <span>
          <span className={classes.info_span_R}>
            i {getInfoMessageRight()}
          </span>
        </span> */}
      </div>
    </div>
    
  )
}

export default BlobbActions