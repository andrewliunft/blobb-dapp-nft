import { useCallback } from "react"
import classes from "./PendingTransaction.module.css"

function PendingTransaction({ txName, txDesc }) {
  const loadingSVG = useCallback(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 23"
      // preserveAspectRatio="xMidYMid"
    >
      <circle cx={20} cy={12} r={5} fill="#3f3f3f55">
        <animate id="anim"
          attributeName="r"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;1"
          values="10;5"
          keySplines="0 0.5 0.5 1"
          begin="0.2s"
        />
        <animate
          attributeName="fill"
          repeatCount="indefinite"
          dur="1s"
          calcMode="linear"
          keyTimes="0;0.25;0.5;0.75;1"
          values="#3f3f3f;#3f3f3f;#3f3f3fcc;#3f3f3f99;#3f3f3f55"
          begin="0.2s"
        />
      </circle>
      <circle cx={40} cy={12} r={5} fill="#3f3f3f55">
        <animate id="anim"
          attributeName="r"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;1"
          values="10;5"
          keySplines="0 0.5 0.5 1"
          begin="0.4s"
        />
        <animate
          attributeName="fill"
          repeatCount="indefinite"
          dur="1s"
          calcMode="linear"
          keyTimes="0;0.25;0.5;0.75;1"
          values="#3f3f3f;#3f3f3f;#3f3f3fcc;#3f3f3f99;#3f3f3f55"
          begin="0.4s"
        />
      </circle>
      <circle cx={60} cy={12} r={5} fill="#3f3f3f55">
        <animate id="anim"
          attributeName="r"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;1"
          values="10;5"
          keySplines="0 0.5 0.5 1"
          begin="0.6s"
        />
        <animate
          attributeName="fill"
          repeatCount="indefinite"
          dur="1s"
          calcMode="linear"
          keyTimes="0;0.25;0.5;0.75;1"
          values="#3f3f3f;#3f3f3f;#3f3f3fcc;#3f3f3f99;#3f3f3f55"
          begin="0.6s"
        />
      </circle>
      <circle cx={80} cy={12} r={5} fill="#3f3f3f55">
        <animate id="anim"
          attributeName="r"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;1"
          values="10;5"
          keySplines="0 0.5 0.5 1"
          begin="0.8s"
        />
        <animate
          attributeName="fill"
          repeatCount="indefinite"
          dur="1s"
          calcMode="linear"
          keyTimes="0;0.25;0.5;0.75;1"
          values="#3f3f3f;#3f3f3f;#3f3f3fcc;#3f3f3f99;#3f3f3f55"
          begin="0.8s"
        />
      </circle>

    </svg>
  ), [])

  return(
    <div className={classes.pending_tx_container}>
      <div className={classes.pending_tx_div}>
        <span className={classes.pending_tx_title}>{txName}</span>
        <p>{txDesc}</p>
        <span className={classes.pending_loading}>{loadingSVG()}</span>
      </div>
    </div>
  )
}

export default PendingTransaction