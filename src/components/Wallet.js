import { useContext, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import classes from "./Wallet.module.css"

let { gitURL } = require("../helper-data.js")

function Wallet({ currAccount, connectWalletFunc }) {
  // const {state: { chain }} = useContext(EtherContext)
  const {blob: { colors }} = useContext(MyBlobContext)
  const location = useLocation()
  const navigate = useNavigate()
  // console.log(chain)
  const styleVars = useMemo(() => {
    console.log(colors)
    return {
      "--startColor": colors ? "rgb("+colors.start+")" : "#0000",
      "--endColor": colors ? "rgb("+colors.end+")" : "#0000",
    }
  }, [colors])

  function handleProfileClick() {
    if(location.pathname !== gitURL.base+"/bhome") navigate(gitURL.base+"/bhome") 
  }

  function walletTextClickHandler() {
    if(currAccount) window.open("https://mumbai.polygonscan.com/address/"+currAccount, "_blank")
    else connectWalletFunc()
  }

  return(
    <div className={classes.div_wallet_container} style={styleVars}>
      <div className={classes.div_wallet_text}>
        <span className={classes.wallet_text_title}>{"LOCALHOST"}</span>
        <span className={classes.wallet_text} onClick={walletTextClickHandler}>
          {currAccount ? currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42) : "CONNECT"}
        </span>
      </div>
      <div className={classes.profile_circle} innertext={colors ? "MY BLOBB" : "MINT BLOBB"} onClick={handleProfileClick}>
        
      </div>
      {/* {currAccount && <div className={classes.disconnect_x}>X</div>} */}
    </div>
  )
}

export default Wallet