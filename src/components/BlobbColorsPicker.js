import classes from "./BlobbColorsPicker.module.css"

function BlobbColorsPicker({ bProperties, propertiesFuncs: { colorPicked, bTypeChanged } }) {
  return(
    <div className={classes.div_container}>
      <span className={classes.title_span}>CLICK THE <span className={classes.highlight}>BLOBB</span> TO MINT IT!</span>
      <span className={bProperties.bType % 2 ? classes.info_price_span_1 : classes.info_price_span_2}>
        i
        <span className={classes.price_span}>
          <span className={classes.highlight}>{15 + 2.5 * bProperties.bType} MATIC</span> + <span className={classes.highlight}>GAS</span>
        </span>
      </span>
      <div className={classes.colors_div}>
        <div className={classes.color_button_start}>
          <input id="c-start" className={classes.color_picker} type="color" value={bProperties.cStart} onChange={colorPicked}/>
        </div>
        <div className={classes.center_text}>
          <span>YOU DON'T OWN A <span className={classes.highlight}>BLOBB.</span></span>
          <span className={classes.center_subtext}>Choose your BLOBB and mint it!</span>
        </div>
        <div className={classes.color_button_end}>
          <input id="c-end" type="color" className={classes.color_picker} value={bProperties.cEnd} onChange={colorPicked}/>
        </div>
      </div>
      <div className={classes.blob_type_arrow_div}>
        <div className={classes.blob_type_arrow_left} onClick={() => bTypeChanged(false)}>
          {"<<"}
        </div>
        <div className={classes.blob_type_arrow_right} onClick={() => bTypeChanged(true)}>
          {">>"}
        </div>
      </div>
    </div>
    
  )
}

export default BlobbColorsPicker