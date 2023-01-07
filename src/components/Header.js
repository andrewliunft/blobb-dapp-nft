import { useState, useMemo, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import classes from "./Header.module.css"

let { gitURL } = require("../helper-data.js")

function Header() {
  const {state: { account, provider }} = useContext(EtherContext)
  const {blob: { number }} = useContext(MyBlobContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [subtitle, setSubtitle] = useState()
  console.log(provider)
  useEffect(() => {
    console.log(location.pathname)
    if(!account) setSubtitle("No Wallet")
    
    else if(location.pathname === gitURL.base+"/bhome") number ? setSubtitle("My Blobb") : setSubtitle("Mint Blobb")
    else if(location.pathname === gitURL.base+"/bsearch" || location.pathname === gitURL.base+"/bsearch/sblobb") setSubtitle("Search")
    else if(location.pathname === gitURL.base+"/history") setSubtitle("My History")
    else if(location.pathname === gitURL.base+"/benemy") setSubtitle("Enemy Blobbs")
    // else if(location.pathname === "/") setSubtitle("")
  }, [location.pathname, number, account])

  const styleVars = useMemo(() => {
    return {
      "--fSize": location.pathname === gitURL.base+"/" ? "10vmin" : "4vmin",
      "--cursor": location.pathname === gitURL.base+"/" ? "default" : "pointer",
      "--pointColor": !account || location.pathname === gitURL.base+"/" || location.pathname === gitURL.base+"/bsearch" ? "#5e5e5e" : location.pathname === gitURL.base+"/bhome" || location.pathname === gitURL.base+"/history" ? "lime" : "red",
      // "--tras": location.pathname === "/" ? "0" : location.pathname === "/bhome" ? "-25vw" : "25vw",
    }
  }, [location.pathname, account])
  
  function handleTitleClick() {
    if(location.pathname !== gitURL.base+"/") navigate(gitURL.base+"/") 
  }

  return(
    <div className={classes.header_div} style={styleVars}>
      <span className={classes.span_title} onClick={handleTitleClick}>BLOBB<span className={classes.span_point}>.</span></span>
      <div className={location.pathname === gitURL.base+"/" ? classes.no_div_subtitle : classes.div_subtitle}>
        {subtitle}
      </div>
      {/* <div className={classes.div_wallet}>{provider._network.name} Connect</div> */}
    </div>
  )
}

export default Header