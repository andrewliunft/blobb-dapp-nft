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
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>ENEMY BLOBB</span> TO SHOW STATS</span>
      <div className={classes.actions_div}>
        <div className={classes.attack_button} onClick={attackButtonHandler}>
          {fBlobb.hp > 1 ? "attack" : "kill"}
        </div>
        <div className={classes.next_button} onClick={nextBlobbFunc}>
          next <span className={classes.arrows}>{">>"}</span>
        </div>
        
        {/* HELLO {currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42)} <br />
        THIS IS YOUR BLOBB: <br />
        {Object.keys(blobb).map(stat => <div key={stat}> {stat}: {blobb[stat].toString()} <br /></div>)} */}
      </div>
    </div>
  )
}

export default EnemyBlobbActions