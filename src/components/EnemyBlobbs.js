import { useContext, useEffect, useState } from "react"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"
import BlobbStats from "./BlobbStats"
import EnemyBlobbActions from "./EnemyBlobbActions"
import classes from "./EnemyBlobbs.module.css"
import EnemyBlobbSVG from "./EnemyBlobbSVG"

function EnemyBlobbs() {
  const {blobbs: { focusedBlobb }, funcs: { focusNewBlobb }} = useContext(BlobbsContext)
  const [showStats, setShowStats] = useState(false)

  // if(!number) return <NonOwner />
  if(!focusedBlobb) {
    return(<div className={classes.enemy_blobb_div}>
      NOTHING TO SHOW
    </div>)
  }
  return(
    <div className={classes.enemy_blobb_div}>
      <EnemyBlobbSVG fBlobb={focusedBlobb} show={showStats} setShow={setShowStats} />
      <EnemyBlobbActions nextBlobbFunc={focusNewBlobb} fBlobb={focusedBlobb} />
      <BlobbStats blobb={focusedBlobb} show={showStats} setShow={setShowStats} />
    </div>
  )
}

export default EnemyBlobbs