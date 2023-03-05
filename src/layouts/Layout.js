import { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"

import classes from "./Layout.module.css"

import PendingTransaction from "../components/PendingTransaction"
import Popups from "../components/Popups"
import Problem from "../components/Problem"

import Header from "../components/Header"
import Wallet from "../components/Wallet"


import twitterSVG from "../graphics/twitter.svg"
import etherscanSVG from "../graphics/etherscan.svg"
import openseaSVG from "../graphics/opensea.svg"
import doubleArrowSVG from "../graphics/doubleArrow.svg"

let { networkConfig } = require("../helper-data.js")

function Layout({ children }) {
  const {state: { account, pending, chain }, funcs: { connectWallet, switchWalletChain }} = useContext(EtherContext)
  // const {blob: { attackTrigger }} = useContext(MyBlobContext)
  // const [popups, setPopups] = useState([])
  const location = useLocation()
  const [fullFooter, setFullFooter] = useState(false)

  // useEffect(() => {
  //   if(!attackTrigger) return
    
  //   setPopups(popups.concat(popups.length ? popups[popups.length-1]+1 : 0))
  // }, [attackTrigger])

  console.log("LAYOUT", pending, /*popups*/)
  return(
    <div className={classes.root_div}>
      <main className={classes.main_layout}>
        {(account && networkConfig.networks.includes(chain)) || location.pathname === "/" ? children : <Problem problem="wallet" />}
      </main>
      <Header />
      <Wallet currAccount={account} walletChain={chain} connectWalletFunc={connectWallet} switchChainFunc={switchWalletChain} />
      <Popups />
      {/* <div className={classes.trigger_div}>
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
      </div> */}
      <div className={classes.footer_div} style={{"translate": fullFooter ? "0" : "0 45px"}}>
        <span className={classes.footer_title_span}>
          <span className={classes.highlight_footer} onClick={() => setFullFooter(!fullFooter)}>
            <img className={classes.logos_svg} src={doubleArrowSVG} style={{"rotate": fullFooter ? "0deg" : "180deg"}}/>
          </span>
          {" "}MADE BY <a className={classes.no_a} href="https://twitter.com/Sawyheart" target="_blank" rel="noreferrer">
            <span className={classes.highlight_footer}>@Sawyheart</span>
          </a>
        </span>
        <div className={classes.logos_div}>
          <a className={classes.no_a} href="https://twitter.com/BLOBBs_NFT" target="_blank" rel="noreferrer">
            <img className={classes.logos_svg} src={twitterSVG} />
          </a>
          <a className={classes.no_a} href="https://twitter.com/BLOBBs_NFT" target="_blank" rel="noreferrer">
            <img className={classes.logos_svg} src={etherscanSVG} />
          </a>
          <a className={classes.no_a} href="https://twitter.com/BLOBBs_NFT" target="_blank" rel="noreferrer">
            <img className={classes.logos_svg} src={openseaSVG} />
          </a>
        </div>
      </div>
      {pending && <PendingTransaction txName={pending.txName} txDesc={pending.txDesc} />}
    </div>
    
  )
}

export default Layout