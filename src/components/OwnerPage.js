import { useContext, useEffect, useReducer } from "react"
import { ethers } from "ethers";

import EtherContext from "../contexts/EtherContext/EtherProvider"
import Problem from "./Problem"

import classes from "./OwnerPage.module.css"

const ACTIONS = {INIT: "init", SET: "set", RESET: "reset"}
const initialData = {isOwner: false, isContractEnabled: true, textValue: "", pending: false, isBarFocused: false, bType: 0, bColors: {start: "#000000", end: "#ff0000"}, errMsg: {errDiv: null, change: false}}
const reducer = (giftData, action) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.INIT:
      return { ...giftData, ...data }
    case ACTIONS.SET:
      return { ...giftData, ...data }
    case ACTIONS.RESET:
      return { ...giftData, ...initialData }
    default:
      return giftData
  }
}

function OwnerPage() {
  const {state: { account, contract }} = useContext(EtherContext)
  const [giftData, giftDispatch] = useReducer(reducer, initialData) 

  useEffect(() => {
    const isOwner = async () => {
      const contractOwner = await contract.owner()
      const isContractEnabled = await contract.isContractEnabled()
      giftDispatch({type: ACTIONS.SET, data: {isOwner: contractOwner.toLowerCase() === account, isContractEnabled}})
    }

    if(account && contract) isOwner()
  }, [account, contract])

  useEffect(() => {
    const onEnterKeyPress = e => {
      if(e.key === "Enter") giftBlobbHandler()
    }

    if(giftData.isBarFocused) window.addEventListener("keydown", onEnterKeyPress)
    return () => window.removeEventListener("keydown", onEnterKeyPress)
  }, [giftData])  

  const changeTypeHandler = rArrow => {
    const bType = rArrow ? (giftData.bType+1)%5 : (5+(giftData.bType-1)%5)%5
    giftDispatch({type: ACTIONS.SET, data: { bType }})
  }

  async function giftBlobbHandler() {
    const errMsgClass = giftData.errMsg.change ? classes.error_div_2 : classes.error_div_1
    if(!giftData.textValue) {
      giftDispatch({
        type: ACTIONS.SET, 
        data: {errMsg: {errDiv: <div className={errMsgClass}>TYPE SOME DATA</div>, change: !giftData.errMsg.change}}
      })
      return
    }
    if(!ethers.utils.isAddress(giftData.textValue)) {
      giftDispatch({
        type: ACTIONS.SET, 
        data: {errMsg: {errDiv: <div className={errMsgClass}>INVALID ADDRESS</div>, change: !giftData.errMsg.change}}
      })
      return
    }

    try {
      giftDispatch({type: ACTIONS.SET, data: { pending: true }})
      await contract.mintGiftBlob(ethers.utils.getAddress(giftData.textValue), _hexsToRGB(giftData.bColors.start, giftData.bColors.end), giftData.bType)
      giftDispatch({type: ACTIONS.SET, data: { pending: false }})
    }
    catch(e) {
      giftDispatch({
        type: ACTIONS.SET, 
        data: {pending: false, errMsg: { errDiv: <div className={errMsgClass}>TRANSACTION FAILED</div>, change: !giftData.errMsg.change}}
      })
      console.error(e)
    }
  }

  const _hexsToRGB = (sHcol, eHCol) => {
    let arrayRGBs = [
      parseInt(sHcol.slice(1, 3), 16), parseInt(sHcol.slice(3, 5), 16), parseInt(sHcol.slice(5, 7), 16), 
      parseInt(eHCol.slice(1, 3), 16), parseInt(eHCol.slice(3, 5), 16), parseInt(eHCol.slice(5, 7), 16), 
    ]
    return arrayRGBs
  }

  const withdrawBalance = async withdrawType => {
    const errMsgClass = giftData.errMsg.change ? classes.error_div_2 : classes.error_div_1
    try {
      giftDispatch({type: ACTIONS.SET, data: { pending: true }})
      await contract.withdraw(withdrawType)
      giftDispatch({type: ACTIONS.SET, data: { pending: false }})
    }
    catch(e) {
      giftDispatch({
        type: ACTIONS.SET, 
        data: {pending: false, errMsg: { errDiv: <div className={errMsgClass}>TRANSACTION FAILED</div>, change: !giftData.errMsg.change}}
      })
      console.error(e)
    }
  }

  const toggleContractPause = async () => {
    const errMsgClass = giftData.errMsg.change ? classes.error_div_2 : classes.error_div_1
    const isContractEnabled = !giftData.isContractEnabled

    try {
      giftDispatch({type: ACTIONS.SET, data: { pending: true }})
      await contract.setIsContractEnabled(isContractEnabled)
      giftDispatch({type: ACTIONS.SET, data: { isContractEnabled, pending: false }})
    }
    catch(e) {
      giftDispatch({
        type: ACTIONS.SET, 
        data: {pending: false, errMsg: { errDiv: <div className={errMsgClass}>TRANSACTION FAILED</div>, change: !giftData.errMsg.change}}
      })
      console.error(e)
    }
  }

  if(!giftData.isOwner) return <Problem problem={404}></Problem>
  return(
    <div className={classes.op_page_div}>
      <div className={classes.center_container}>
        <div className={classes.info_div_container}>
          <div className={classes.info_div}>
            <span className={classes.info_div_title}>THIS IS MY <span className={classes.highlight}>SPACE</span></span>
            <p>From here, I can <span className={classes.highlight}>withdraw</span> the contract balance.</p>
            <p>Just with few clicks!</p>
            <p>I can <span className={classes.highlight}>GIFT</span> some <span className={classes.highlight}>BLOBBs</span> too.</p> 
          </div>
        </div>

        <div className={classes.metadata_div}>
          <div className={classes.blob_type_div}>
            <span className={classes.blob_type_title}>GIFT <span className={classes.highlight}>TYPE</span></span>
            <div className={classes.type_panel_div}>
              <span className={classes.change_type_arrow} onClick={() => changeTypeHandler(false)}>{"<<"}</span>
              <div className={classes.current_type}>{giftData.bType}</div>
              <span className={classes.change_type_arrow} onClick={() => changeTypeHandler(true)}>{">>"}</span>
            </div>
          </div>

          <div className={classes.color_button}>
            <input className={classes.color_picker} type="color" value={giftData.bColors.start} 
              onChange={inputRef => giftDispatch({
                type: ACTIONS.SET, 
                data: {bColors: {start: inputRef.target.value, end: giftData.bColors.end}}
              })}
            />
          </div>
          
          <div className={classes.preview_blob_div} style={{
            "--border-anim": giftData.bType >= 2 ? "1.5s" : "0s", 
            "--level-anim": giftData.bType === 1 || giftData.bType === 3 ? "2.5s" : "0s", 
            "--s-color": giftData.bColors.start, 
            "--e-color": giftData.bColors.end
          }}>
            <div className={classes.preview_blob_border} />
            <div className={classes.preview_blob}  />
          </div>

          <div className={classes.color_button}>
            <input className={classes.color_picker} type="color" value={giftData.bColors.end} 
              onChange={inputRef => giftDispatch({
                type: ACTIONS.SET, 
                data: {bColors: {start: giftData.bColors.start, end: inputRef.target.value}}
              })}
            />
          </div>
        </div>

        <div className={giftData.pending ? classes.off_search_bar : classes.search_bar}>
          <input type="text" 
            value={giftData.textValue} 
            className={classes.search_input} 
            placeholder="GIFT TO..."
            spellCheck="false"
            onChange={inputRef => giftDispatch({type: ACTIONS.SET, data: {textValue: inputRef.target.value}})}
            onFocus={() => giftDispatch({type: ACTIONS.SET, data: {isBarFocused: true}})}
            onBlur={() => giftDispatch({type: ACTIONS.SET, data: {isBarFocused: false}})}
          />
          <div className={classes.search_enter_button} onClick={giftBlobbHandler}>
            {giftData.pending ?
              <span>
                <span className={classes.dots} style={{"--anim-delay": "0s"}}>.</span>
                <span className={classes.dots} style={{"--anim-delay": ".125s"}}>.</span>
                <span className={classes.dots} style={{"--anim-delay": ".25s"}}>.</span>
              </span> :
              <span className={classes.arrows}>{">>"}</span>
            }
          </div>
          {giftData.errMsg.errDiv}
        </div>
      </div>
      <div className={classes.utilities_div}>
        <span className={classes.title_span}><span className={classes.highlight}>CONTRACT</span> UTILITIES</span>
        <div className={classes.utilities_buttons}>
          <div className={giftData.pending ? classes.buttons_off : classes.utility_button} onClick={() => withdrawBalance(0)}>
            withdraw
          </div>
          <div className={giftData.pending ? classes.pause_toggle_off : classes.pause_toggle} onClick={toggleContractPause}>
            {giftData.pending ?
              <span>
                <span className={classes.dots} style={{"--anim-delay": "0s"}}>.</span>
                <span className={classes.dots} style={{"--anim-delay": ".125s"}}>.</span>
                <span className={classes.dots} style={{"--anim-delay": ".25s"}}>.</span>
              </span> :
              <span className={classes.pause_play_span} style={{
                "--p-top": giftData.isContractEnabled ? 0 : "3px",
                "--p-left": giftData.isContractEnabled ? 0 : "5px",
                "--s-color": giftData.isContractEnabled ? "red" :"lime" 
              }}>
                {giftData.isContractEnabled ? "❚❚" : "▶"}
              </span>
            }
          </div>
          <div className={giftData.pending ? classes.buttons_off : classes.utility_button}>
            update
          </div>
          <div onClick={() => withdrawBalance(1)}>king</div>
        </div>
      </div>
      
    </div>
  )
}

export default OwnerPage