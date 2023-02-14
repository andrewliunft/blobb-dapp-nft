import { useContext } from "react"
import { useLocation } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"

import classes from "./Layout.module.css"

import PendingTransaction from "../components/PendingTransaction"
import Header from "../components/Header"
import Wallet from "../components/Wallet"
import Problem from "../components/Problem"


let { networkConfig } = require("../helper-data.js")

function Layout({ children }) {
  const {state: { account, pending, chain }, funcs: { connectWallet }} = useContext(EtherContext)
  const {blob: { attackTrigger }} = useContext(MyBlobContext)
  const location = useLocation()
  console.log("LAYOUT", pending)
  return(
    <div className={classes.root_div}>
      <div className={attackTrigger === null ? classes.trigger_div : attackTrigger ? classes.trigger_div_1 : classes.trigger_div_2}>YOUR BLOBB LOST 1 HP</div>
      <main className={classes.main_layout}>
        {(account && networkConfig.networks.includes(chain)) || location.pathname === "/" ? children : <Problem problem="wallet" />}
      </main>
      <Header />
      <Wallet currAccount={account} connectWalletFunc={connectWallet} />
      {/* <div>asdasd</div> */}
      {pending && <PendingTransaction txName={pending.txName} txDesc={pending.txDesc} />}
    </div>
    
  )
}

export default Layout