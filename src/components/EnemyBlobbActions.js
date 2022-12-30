import { useContext } from "react"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import classes from "./EnemyBlobbActions.module.css"

function EnemyBlobbActions({ fBlobb, nextBlobbFunc }) {
  const {funcs: { newWalletRequest }} = useContext(EtherContext)
  const {funcs: { attackFocusedBlobb }} = useContext(BlobbsContext)

  function attackButtonHandler() {
    newWalletRequest("ATTACK", "ATTACKING THE BLOBB!", attackFocusedBlobb)
  }

  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>ENEMY BLOBB</span> FOR MORE INFO</span>
      <div className={classes.actions_div}>
        <div className={fBlobb.hp === 0 ? classes.attack_button_off : classes.attack_button} onClick={attackButtonHandler}>
          {fBlobb.hp === 0 ? "dead" : fBlobb.hp > 1 ? "attack" : "kill"}
        </div>
        <div className={classes.next_button} onClick={nextBlobbFunc}>
          next <span className={classes.arrows}>{">>"}</span>
        </div>
      </div>
    </div>
  )
}

export default EnemyBlobbActions