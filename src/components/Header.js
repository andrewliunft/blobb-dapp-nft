import { useState, useCallback, useMemo, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import EtherContext from "../contexts/EtherContext/EtherProvider"
import classes from "./Header.module.css"

function Header() {
  const {state: { account, provider }} = useContext(EtherContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [subtitle, setSubtitle] = useState()
  console.log(provider)
  useEffect(() => {
    if(location.pathname === "/bhome") setSubtitle("My Blobb")
    else if(location.pathname === "/battack") setSubtitle("Attack Blobbs")
    // else if(location.pathname === "/") setSubtitle("")
  }, [location.pathname])

  const styleVars = useMemo(() => {
    return {
      "--fSize": location.pathname === "/" ? "10vmin" : "4vmin",
      "--cursor": location.pathname === "/" ? "default" : "pointer",
      // "--tras": location.pathname === "/" ? "0" : location.pathname === "/bhome" ? "-25vw" : "25vw",
    }
  }, [location.pathname])
  
  console.log()
  function handleTitleClick() {
    if(location.pathname !== "/") navigate("/") 
  }

  return(
    <div className={classes.header_div} style={styleVars}>
      <span className={classes.span_title} onClick={handleTitleClick}>BLOBB.</span>
      <div className={location.pathname === "/" ? classes.no_div_subtitle : classes.div_subtitle}>
        {subtitle}
      </div>
      <div className={classes.div_wallet}>{provider._network.name} Connect</div>
    </div>
  )
}

export default Header