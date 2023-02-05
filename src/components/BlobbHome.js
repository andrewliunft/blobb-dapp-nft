import { useCallback, useContext, useState } from "react"
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
  
  const _randomColor = () => "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16))
  const [colors, setColors] = useState({start: _randomColor(), end: _randomColor()})
  // const [colors, setColors] = useState({start: "#000000", end: "#333333", time: 3000, reps: 0})
  console.log("BLOB HOME", account, blob.number, showStats, colors)
  
  
  // setTimeout(() => {
  //   if(colors.reps >= 35) return
  //   if(colors.reps >= 20) {
  //     let end = "#" + Math.floor(Math.random()*16777215).toString(16)
  //     if(colors.reps == 34) {
  //       end = "#1f00a7"
  //       setColors({...colors, ...{ end, time: 5000, reps: colors.reps++ }})
  //       return
  //     }
  //     setColors({...colors, ...{ end, time: 200, reps: colors.reps++ }})
  //   }
  //   else if(colors.reps >= 0) {
  //     let start = "#" + Math.floor(Math.random()*16777215).toString(16)
  //     if(colors.reps == 19) {
  //       start = "#fd0ac0"
  //       setColors({...colors, ...{ start, time: 2000, reps: colors.reps++ }})
  //       return
  //     }
  //     setColors({...colors, ...{ start, time: 200, reps: colors.reps++ }})
  //   }  
  // }, colors.time);

  // setTimeout(() => {
  //   setColors({ start: _randomColor(), end: _randomColor() })
    
  // }, 250);

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