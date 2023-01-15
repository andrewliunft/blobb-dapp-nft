import classes from "./Problem.module.css"

function Problem({ problem }) {

  function getProblemDesc() {
    switch(problem) {
      case 404:
        return [
          <div key="subtitle" className={classes.problem_subtitle_div}>
            <p>ERROR <span className={classes.highlight}>404</span></p>
          </div>,
          <div key="desc" className={classes.problem_desc_div}>
            <p>This page doesn't exist.</p>
          </div>
        ] 
      case "owner":
        return [
          <div key="subtitle" className={classes.problem_subtitle_div}>
            <p>YOU DON'T OWN A <span className={classes.highlight}>BLOBB</span></p>
          </div>,
          <div key="desc" className={classes.problem_desc_div}>
            <p>To access this page you must mint a BLOBB.</p>
          </div>
        ]
      case "wallet":
        return [
          <div key="subtitle" className={classes.problem_subtitle_div}>
            <p>WALLET CONNECTION <span className={classes.highlight}>ERROR</span></p>
          </div>,
          <div key="desc" className={classes.problem_desc_div}>
            <p>Connect your <span className={classes.highlight}>MetaMask</span> account to the</p>
            <p><span className={classes.highlight} style={{"fontSize": "18px"}}>MUMBAI TESTNET</span></p> {/* POLYGON */}
          </div>
        ]
    }
  }

  return(
    <div className={classes.non_owner_div}>
      <div className={classes.problem_div}>
        <span className={classes.problem_title_span}>SOMETHING <span className={classes.highlight}>WRONG!</span></span>
        {getProblemDesc()}
      </div>
      {/* <div className={classes.problem_button}>
        mint your blobb
      </div> */}
    </div>
  )
}

export default Problem