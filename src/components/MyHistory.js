import { useContext, useEffect, useState } from "react"
import MyBlobContext from "../contexts/MyBlobContext/MyBlobProvider"
import classes from "./MyHistory.module.css"

function MyHistory() {
  const {blob: { number }, funcs: { getBlobbHistory }} = useContext(MyBlobContext)
  const [blobbHistory, setBlobbHistory] = useState()
  const [page, setPage] = useState(1)
  
  console.log("THIS IS THE HISTORY: ", blobbHistory)
  useEffect(() => {
    const getHistory = async () => {
      console.log("ASDF", number)
      setBlobbHistory(await getBlobbHistory(page))
    }
    if(number) getHistory()
    else setBlobbHistory(null)
  }, [number, page])

  if(!blobbHistory) return
  return(
    <div className={classes.history_div_container}>

      {
        blobbHistory.map(() => {
          return "a"
        })
      }
      {/* <div className={classes.div_container}>
        <span className={classes.title_span}>EXPLORE THE <span className={classes.highlight}>BLOBB</span> COMMUNITY</span>
        <div className={classes.explore_div}>
          <div className={classes.search_button}>
            <span className={classes.arrows}>{"<<"}</span> search
          </div>
          <div className={classes.blobbs_button}>
            blobb <span className={classes.arrows} style={{"--arrow-color": "lime"}}>{">>"}</span>
          </div>
        </div>
      </div>  */}
      
    </div>
  )
}

export default MyHistory