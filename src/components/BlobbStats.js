import { useNavigate } from "react-router-dom"
import classes from "./BlobbStats.module.css"

function BlobbStats({ blobb, show, setShow, mine }) {
  const navigate = useNavigate()
  return(
    <div className={show ? classes.div_stats_s : classes.div_stats_h}>
      <span className={classes.stats_title} onClick={() => setShow(!show)}><span className={classes.highlight}>X</span>INFO</span>
      {
        Object.keys(blobb).filter(
          stat => !["colors", "totalActions", "totalAttacks", "lastHit", "king"].includes(stat)
        ).map(stat => {
          let value = blobb[stat]
          if(stat === "creator" || stat === "owner") 
            value = <a className={classes.value_link} href={"https://mumbai.polygonscan.com/address/"+blobb[stat]} target="_blank" rel="noreferrer">
              {blobb[stat].slice(0, 5) + "..." + blobb[stat].slice(38, 42)}
            </a>
          return <div key={stat} className={classes.stat_div}>
            <div className={classes.stat_title}>{stat.toUpperCase()}</div>
            <div className={classes.stat_value}><span className={classes.highlight}>{value}</span></div>
          </div>
        })
      }
      {mine && <div className={classes.history_button} onClick={() => navigate("/history")}>FULL HISTORY</div>}
    </div>
  )
}

export default BlobbStats