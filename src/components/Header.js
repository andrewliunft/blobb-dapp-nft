import { useState, useMemo, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import classes from "./Header.module.css"

function Header() {
  const {state: { account, provider }} = useContext(EtherContext)
  const {blob: { number }} = useContext(MyBlobContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [subtitle, setSubtitle] = useState()
  console.log(provider)
  useEffect(() => {
    if(!account) setSubtitle("No Wallet")
    else if(location.pathname === "/bhome") number ? setSubtitle("My Blobb") : setSubtitle("Mint Blobb")
    else if(location.pathname === "/bsearch" || location.pathname === "/bsearch/sblobb") setSubtitle("Search")
    else if(location.pathname === "/history") setSubtitle("My History")
    else if(location.pathname === "/benemy") setSubtitle("Enemy Blobbs")
    // else if(location.pathname === "/") setSubtitle("")
  }, [location.pathname, number, account])

  const styleVars = useMemo(() => {
    return {
      "--fSize": location.pathname === "/" ? "10vmin" : "4vmin",
      "--cursor": location.pathname === "/" ? "default" : "pointer",
      "--pointColor": !account || location.pathname === "/" || location.pathname === "/bsearch" ? "#5e5e5e" : location.pathname === "/bhome" || location.pathname === "/history" ? "lime" : "red",
      // "--tras": location.pathname === "/" ? "0" : location.pathname === "/bhome" ? "-25vw" : "25vw",
    }
  }, [location.pathname, account])
  
  function handleTitleClick() {
    if(location.pathname !== "/") navigate("/") 
  }

  return(
    <div className={classes.header_div} style={styleVars}>
      <span className={classes.span_title} onClick={handleTitleClick}>BLOBB<span className={classes.span_point}>.</span></span>
      <div className={location.pathname === "/" ? classes.no_div_subtitle : classes.div_subtitle}>
        {subtitle}
      </div>
      {/* <div className={classes.div_wallet}>{provider._network.name} Connect</div> */}
    </div>
  )
}

export default Header