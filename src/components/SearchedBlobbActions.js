import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import classes from "./SearchedBlobbActions.module.css"

function SearchedBlobbActions({ sBlobb }) {
  const {funcs: { newWalletRequest }} = useContext(EtherContext)
  const {funcs: { attackSearchedBlobb }} = useContext(BlobbsContext)
  const navigate = useNavigate()

  function attackButtonHandler() {
    newWalletRequest("ATTACK", "ATTACKING THE BLOBB!", attackSearchedBlobb)
  }

  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>ENEMY BLOBB</span> FOR MORE INFO</span>
      <div className={classes.actions_div}>
        <div className={classes.back_button} onClick={() => navigate("/bsearch")}>
          <span className={classes.arrows}>{"<<"}</span> search
        </div>
        <div className={sBlobb.hp === 0 ? classes.attack_button_off : classes.attack_button} onClick={attackButtonHandler}>
          {sBlobb.hp === 0 ? "dead" : sBlobb.hp > 1 ? "attack" : "kill"}
        </div>
      </div>
    </div>
  )
}

export default SearchedBlobbActions