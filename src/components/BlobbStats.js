import classes from "./BlobbStats.module.css"

function BlobbStats({ blobb, show, setShow }) {
  return(
    <div className={show ? classes.div_stats_s : classes.div_stats_h}>
      <span className={classes.stats_title} onClick={() => setShow(!show)}><span className={classes.highlight}>X</span>STATS</span>
      {Object.keys(blobb).map(stat => <div key={stat}> {stat}: {blobb[stat].toString()} <br /></div>)}
    </div>
  )
}

export default BlobbStats