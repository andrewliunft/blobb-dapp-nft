import { useContext, useState } from "react"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import BlobbSVG from "./BlobbSVG"

import classes from "./BlobbHome.module.css"
import BlobbActions from "./BlobbActions"
import BlobbStats from "./BlobbStats"

function BlobbHome() {
  const {state: { account }} = useContext(EtherContext)
  const { blob, funcs: { mintBlob } } = useContext(MyBlobContext)
  const [showStats, setShowStats] = useState(false)
  console.log("BLOB HOME", account, blob.blobID, showStats)

  if(blob.blobID) {
    return(
      <div className={classes.home_div}>
        <BlobbSVG currAccount={account} blobHP={blob.hp} show={showStats} setShow={setShowStats} />
        <BlobbActions currAccount={account} blobb={blob} />
        <BlobbStats blobb={blob} show={showStats} setShow={setShowStats} />
      </div>
    )
  }
  else {
    return(
      <div className={classes.home_div}>
        HELLO {account} <br />
        YOU DON'T OWN A BLOBB <br />
        <button onClick={() => mintBlob()}>MINT ONE</button>
      </div>
    )
  }
  
  
}

export default BlobbHome