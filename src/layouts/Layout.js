import { useContext } from "react"
import { useLocation } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import Header from "../components/Header"

import classes from "./Layout.module.css"
import PendingTransaction from "../components/PendingTransaction"
import Wallet from "../components/Wallet"
import Problem from "../components/Problem"

function Layout({ children }) {
  const {state: { account, pending }, funcs: { connectWallet }} = useContext(EtherContext)
  const location = useLocation()
  console.log("LAYOUT", pending)
  return(
    <div className={classes.root_div}>
      <main className={classes.main_layout}>
        {account || location.pathname === "/gh-pages-url/" ? children : <Problem problem="wallet" />}
      </main>
      <Header />
      <Wallet currAccount={account} connectWalletFunc={connectWallet} />
      {pending && <PendingTransaction txName={pending.txName} txDesc={pending.txDesc} />}
    </div>
    
  )
}

export default Layout