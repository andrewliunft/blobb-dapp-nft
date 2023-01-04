import { useContext, useState } from "react"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobbSVG from "./MyBlobbSVG"
import BlobbSVG from "./BlobbSVG"

import classes from "./BlobbHome.module.css"
import BlobbActions from "./BlobbActions"
import BlobbStats from "./BlobbStats"
import BlobbColorsPicker from "./BlobbColorsPicker"

function BlobbHome() {
  const {state: { account }, funcs: { newWalletRequest }} = useContext(EtherContext)
  const { blob, funcs: { mintBlob }, funcs: { transfer } } = useContext(MyBlobContext)
  const [showStats, setShowStats] = useState(false)
  const [colors, setColors] = useState({start: "#" + Math.floor(Math.random()*16777215).toString(16), end: "#" + Math.floor(Math.random()*16777215).toString(16)})
  console.log("BLOB HOME", account, blob.number, showStats, colors)

  const colorPicked = cPicker => {
    console.log(cPicker, cPicker.target.value, cPicker.target.id)
    cPicker.target.id === "c-start" ? setColors({start: cPicker.target.value, end: colors.end}) : setColors({start: colors.start, end: cPicker.target.value})
  }

  const callMintBlob = () => newWalletRequest("MINT", "MINTING YOUR BRAND NEW BLOBB!", () => mintBlob(colors.start, colors.end))

  if(blob.number) {
    return(
      <div className={classes.home_div_blobb}>
        <MyBlobbSVG currAccount={account} blobb={blob} show={showStats} setShow={setShowStats} />
        <BlobbActions currAccount={account} blobb={blob} />
        <BlobbStats blobb={blob} show={showStats} setShow={setShowStats} mine={true} />
        {/* <div onClick={transfer}>TRANSFER</div> */}
      </div>
    )
  }
  return(
    <div className={classes.home_div_mint}>
      <BlobbSVG currAccount={account} colors={{start: colors.start, end: colors.end}} mintFunc={callMintBlob} />
      <BlobbColorsPicker currAccount={account} bColors={colors} colorPickedFunc={colorPicked} />
    </div>
  )  
}

export default BlobbHome