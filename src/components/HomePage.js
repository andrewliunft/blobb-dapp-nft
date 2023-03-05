import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import EtherContext from "../contexts/EtherContext/EtherProvider";

import classes from "./HomePage.module.css"
import { Timer } from "./Timer";

function HomePage() {
  const {state: { account }, funcs: { connectWallet, pushPopup }} = useContext(EtherContext)
  const navigate = useNavigate()
  // console.log("HOME PAGE", account, Boolean(account))

  return(
    <div className={classes.home_page_div}>
      <div className={classes.info_div_container}>
        {/* <Timer deadline="March, 4, 2023, 19:00" /> */}
        <div className={classes.info_div}>
          <span className={classes.info_div_title}>JOIN THE <span className={classes.highlight}>BLOBB</span> COMMUNITY</span>
          <p>Mint your <span className={classes.highlight}>BLOBB</span> and take care of it.</p>
          <p>You can <span className={classes.highlight}>HEAL</span> yours and <span className={classes.highlight}>ATTACK</span> the others.</p>
          <p>Don't let your BLOBB be defeated by other players. You have to defeat their BLOBBs.</p>
          <p>Be the last BLOBB standing and you'll be the...</p>
          <p><span className={classes.highlight} style={{"fontSize": "18px"}}>KING OF BLOBBS</span></p>
          <div className={classes.read_more_button} onClick={() => window.open("https://sawyheart.notion.site/BLOBB-Wiki-56f0f4d921df44a791cbf2830f7f2d20", "_blank")}>READ MORE...</div>
        </div>
      </div>
      <div className={classes.div_container}>
        <span className={classes.title_span}>EXPLORE THE <span className={classes.highlight}>BLOBB</span> COMMUNITY</span>
        {account ?
          <div className={classes.explore_div}>
            <div className={classes.search_button} onClick={() => navigate("/bsearch")}>
              <span className={classes.arrows}>{"<<"}</span> search
            </div>
            <div className={classes.blobbs_button} onClick={() => navigate("/bhome")}>
              blobb <span className={classes.arrows} style={{"--arrow-color": "lime"}}>{">>"}</span>
            </div>
          </div> :
          <div className={classes.explore_div} onClick={connectWallet}>
            <div className={classes.connect_button}>
              CONNECT YOUR WALLET
            </div>
          </div>
        }
        {/* <div onClick={() => pushPopup(["exp"])}>push</div> */}
      </div> 
    </div>
  )
}

export default HomePage