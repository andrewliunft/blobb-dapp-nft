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

  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>BLOBB</span> FOR MORE INFO</span>
      <div className={classes.actions_div}>
        <div className={blobb.hp < 10 && blobb.hp >= 1 ? classes.heal_button : classes.heal_button_off} onClick={healButtonHandler}>
          {blobb.hp === 0 ? "dead" : "heal"}
        </div>
        <div className={classes.attack_button} onClick={() => navigate("/benemy")}>
          attack <span className={classes.arrows}>{">>"}</span>
        </div>
        
        {/* HELLO {currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42)} <br />
        THIS IS YOUR BLOBB: <br />
        {Object.keys(blobb).map(stat => <div key={stat}> {stat}: {blobb[stat].toString()} <br /></div>)} */}
      </div>
    </div>
    
  )
}

export default BlobbActions