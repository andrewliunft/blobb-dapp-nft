import { useContext, useState } from "react"
import BlobbsContext from "../contexts/BlobbsContext/BlobbsProvider"

import EnemyBlobbSVG from "./EnemyBlobbSVG"
import SearchedBlobbActions from "./SearchedBlobbActions"
import BlobbStats from "./BlobbStats"

import classes from "./SearchedBlobb.module.css"

function SearchedBlobb() {
  const { blobbs: { searchedBlobb }} = useContext(BlobbsContext)
  const [showStats, setShowStats] = useState(false)

  if(!searchedBlobb) {
    return(<div className={classes.searched_blobb_div}>
      NOTHING TO SHOW
    </div>)
  }
  return(
    <div className={classes.searched_blobb_div}>
      <EnemyBlobbSVG fBlobb={searchedBlobb} show={showStats} setShow={setShowStats} isSearched={true} />
      <SearchedBlobbActions sBlobb={searchedBlobb} />
      <BlobbStats blobb={searchedBlobb} show={showStats} setShow={setShowStats} />
    </div>
  )  
}

export default SearchedBlobb