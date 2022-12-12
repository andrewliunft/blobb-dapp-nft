import classes from "./BlobbColorsPicker.module.css"

function BlobbColorsPicker({ bColors, colorPickedFunc }) {
  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>BLOBB</span> TO MINT IT</span>
      <div className={classes.colors_div}>
        <div className={classes.color_button_start}>
          <input id="c-start" className={classes.color_picker} type="color" value={bColors.start} onChange={colorPickedFunc}/>
        </div>
        <div className={classes.center_text}>
          <span>YOU DON'T OWN A <span className={classes.highlight}>BLOBB.</span></span>
          <span className={classes.center_subtext}>Choose the colors and mint one!</span>
        </div>
        <div className={classes.color_button_end}>
          <input id="c-end" type="color" className={classes.color_picker} value={bColors.end} onChange={colorPickedFunc}/>
        </div>
        
        {/* HELLO {currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42)} <br />
        THIS IS YOUR BLOBB: <br />
        {Object.keys(blobb).map(stat => <div key={stat}> {stat}: {blobb[stat].toString()} <br /></div>)} */}
      </div>
    </div>
    
  )
}

export default BlobbColorsPicker