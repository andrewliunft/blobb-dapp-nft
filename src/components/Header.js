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
    console.log(location.pathname)
    if(!account) setSubtitle("No Wallet")
    
    else if(location.pathname === "/gh-pages-url/bhome") number ? setSubtitle("My Blobb") : setSubtitle("Mint Blobb")
    else if(location.pathname === "/gh-pages-url/bsearch" || location.pathname === "/gh-pages-url/bsearch/sblobb") setSubtitle("Search")
    else if(location.pathname === "/gh-pages-url/history") setSubtitle("My History")
    else if(location.pathname === "/gh-pages-url/benemy") setSubtitle("Enemy Blobbs")
    // else if(location.pathname === "/") setSubtitle("")
  }, [location.pathname, number, account])

  const styleVars = useMemo(() => {
    return {
      "--fSize": location.pathname === "/gh-pages-url/" ? "10vmin" : "4vmin",
      "--cursor": location.pathname === "/gh-pages-url/" ? "default" : "pointer",
      "--pointColor": !account || location.pathname === "/gh-pages-url/" || location.pathname === "/gh-pages-url/bsearch" ? "#5e5e5e" : location.pathname === "/gh-pages-url/bhome" || location.pathname === "/gh-pages-url/history" ? "lime" : "red",
      // "--tras": location.pathname === "/" ? "0" : location.pathname === "/bhome" ? "-25vw" : "25vw",
    }
  }, [location.pathname, account])
  
  function handleTitleClick() {
    if(location.pathname !== "/gh-pages-url/") navigate("/gh-pages-url/") 
  }

  return(
    <div className={classes.header_div} style={styleVars}>
      <span className={classes.span_title} onClick={handleTitleClick}>BLOBB<span className={classes.span_point}>.</span></span>
      <div className={location.pathname === "/gh-pages-url/" ? classes.no_div_subtitle : classes.div_subtitle}>
        {subtitle}
      </div>
      {/* <div className={classes.div_wallet}>{provider._network.name} Connect</div> */}
    </div>
  )
}

export default Header