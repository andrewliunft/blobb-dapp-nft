import { useContext, useEffect, useState } from "react"
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
  const [popups, setPopups] = useState([])
  const location = useLocation()

  useEffect(() => {
    if(attackTrigger === null) return
    
    setPopups(popups.concat(popups.length ? popups[popups.length-1]+1 : 0))
  }, [attackTrigger])

  console.log("LAYOUT", pending, popups)
  return(
    <div className={classes.root_div}>
      <main className={classes.main_layout}>
        {(account && networkConfig.networks.includes(chain)) || location.pathname === "/" ? children : <Problem problem="wallet" />}
      </main>
      <Header />
      <Wallet currAccount={account} connectWalletFunc={connectWallet} />
      <div className={classes.trigger_div}>
        {popups.map((value, idx) => {
          if(value >= 0) {
            return <div key={idx} className={classes.trigger_popup_div} style={{"top": 40*value}} onAnimationEnd={anim => {
              if(anim.animationName.includes("r-p")) return
              setPopups(popups.find(v => v > 0) ? popups.map(v => v-1) : [])
            }}>
              YOUR BLOBB <span className={classes.highlight}>LOST</span> 1 HP
            </div>
          }
        })}
      </div>
      
      {pending && <PendingTransaction txName={pending.txName} txDesc={pending.txDesc} />}
    </div>
    
  )
}

export default Layout