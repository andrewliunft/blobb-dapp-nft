import classes from "./Problem.module.css"

function Problem({ problem }) {

  function getProblemDesc() {
    switch(problem) {
      case "owner":
        return [
          <div key="subtitle" className={classes.problem_subtitle_div}>
            YOU DON'T OWN A <span className={classes.highlight}>BLOBB</span>
          </div>,
          <div key="desc" className={classes.problem_desc_div}>
            To access this page you must mint a BLOBB.
          </div>
        ]
      case "wallet":
        return [
          <div key="subtitle" className={classes.problem_subtitle_div}>
            WALLET CONNECTION <span className={classes.highlight}>ERROR</span>
          </div>,
          <div key="desc" className={classes.problem_desc_div}>
            Connect your <span className={classes.highlight}>MetaMask</span> account to the Polygon Mainnet
          </div>
        ]
    }
  }

  return(
    <div className={classes.non_owner_div}>
      <div className={classes.problem_div}>
        <span className={classes.problem_title_span}>SOMETHING WRONG...</span>
        {getProblemDesc()}
      </div>
      {/* <div className={classes.problem_button}>
        mint your blobb
      </div> */}
    </div>
  )
}

export default Problem