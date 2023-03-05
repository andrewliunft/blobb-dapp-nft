import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"

import classes from "./SearchedBlobbActions.module.css"

let { POPUPS_TYPES } = require("./../popups-types")

function SearchedBlobbActions({ sBlobb }) {
  const {funcs: { newWalletRequest }} = useContext(EtherContext)
  const {blob: { hp }} = useContext(MyBlobContext)
  const {funcs: { attackSearchedBlobb }} = useContext(BlobbsContext)
  const navigate = useNavigate()

  function attackButtonHandler() {
    if(sBlobb.hp === 1) newWalletRequest("KILL", "KILLING THE BLOBB!", attackSearchedBlobb, POPUPS_TYPES.KILLED)
    else newWalletRequest("ATTACK", "ATTACKING THE BLOBB!", attackSearchedBlobb)
  }

  function getInfoMessage() {
    if(hp === 0) return <span className={classes.info_comic_span_R}>
      YOUR BLOBB IS <span className={classes.highlight}>DEAD</span>
    </span>
    else if(hp === null) return <span className={classes.info_comic_span_R}>
      YOU MUST OWN A <span className={classes.highlight}>BLOBB</span>
    </span>

    switch(sBlobb.hp) {
      case 0:
        return <span className={classes.info_comic_span_R}>
          THE BLOBB IS <span className={classes.highlight}>DEAD</span>
        </span>
      default:
        return <span className={classes.info_comic_span_R}>
          <span className={classes.highlight}>{sBlobb.hp === 1 ? 9 : 6.5} MATIC</span> + <span className={classes.highlight}>GAS</span>
        </span>
    }
  }

  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>ENEMY BLOBB</span> FOR MORE INFO</span>
      <div className={classes.actions_div}>
        <div className={classes.back_button} onClick={() => navigate("/bsearch")}>
          <span className={classes.arrows}>{"<<"}</span> search
        </div>
        <div className={sBlobb.hp === 0 || hp === 0 || hp === null ? classes.attack_button_off : classes.attack_button} onClick={attackButtonHandler}>
          {sBlobb.hp === 0 ? "dead" : sBlobb.hp > 1 ? "attack" : "kill"}
        </div>
        <span>
          <span className={classes.info_span_R}>
            i {getInfoMessage()}
          </span>
        </span>
      </div>
    </div>
  )
}

export default SearchedBlobbActions