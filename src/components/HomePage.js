import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import EtherContext from "../contexts/EtherContext/EtherProvider";

import classes from "./HomePage.module.css"

function HomePage() {
  const {state: { account }, funcs: { connectWallet }} = useContext(EtherContext)
  const navigate = useNavigate()
  console.log("HOME PAGE", account, Boolean(account))

  function handleButton() {
    if(account) navigate("/bhome")
    else connectWallet()
  }

  return(
    <div className={classes.home_page_div}>
      <div className={classes.info_div}>
        <span className={classes.info_div_title}>JOIN THE <span className={classes.highlight}>BLOBB</span> COMMUNITY</span>
        <p>Create your BLOBB and take care of it.</p>
      </div>
      <div className={classes.home_page_button} onClick={handleButton}>
        {account ? <b>GO TO YOUR BLOBB <span style={{"color": "lime", "textShadow": "0 0 5px lime"}}>{">>"}</span></b> : <b>CONNECT YOUR WALLET</b>}
      </div>
    </div>
  )
}

export default HomePage