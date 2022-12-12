import { useContext, useEffect, useState } from "react"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import BlobbStats from "./BlobbStats"
import EnemyBlobbActions from "./EnemyBlobbActions"
import classes from "./EnemyBlobbs.module.css"
import EnemyBlobbSVG from "./EnemyBlobbSVG"


function EnemyBlobbs() {
  const {state: { account }} = useContext(EtherContext)
  const {blobbs: { focusedBlobb }, funcs: { focusNewBlobb }} = useContext(BlobbsContext)
  const [showStats, setShowStats] = useState(false)

  if(focusedBlobb) {
    return(
      <div className={classes.enemy_blobb_div}>
        <EnemyBlobbSVG currAccount={account} fBlobb={focusedBlobb} show={showStats} setShow={setShowStats} />
        <EnemyBlobbActions nextBlobbFunc={focusNewBlobb} fBlobb={focusedBlobb} />
        <BlobbStats blobb={focusedBlobb} show={showStats} setShow={setShowStats} />
      </div>
    )
  }
  else {
    return(
      <div className={classes.enemy_blobb_div}>
        NO BLOBBS.
      </div>
    )
  }
}

export default EnemyBlobbs