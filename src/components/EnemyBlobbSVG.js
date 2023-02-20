import { useState } from "react"
import classes from "./EnemyBlobbSVG.module.css"

const MAX_ATTACKS_LVL = 1000

function EnemyBlobbSVG({ fBlobb, show, setShow, isSearched }) {
  // const [state, setState] = useState({exp: 0, lvl: 1, time: 250, colors: {...fBlobb.colors, ...{a: .7}}})

  // setTimeout(() => {
  //   const v = state.colors <= .1 ? 0.1 : -0.1
  //   const a = state.colors.a-0.3
  //   setState({...state, ...{colors: { ...state.colors, a }}})
  // }, 1500);

  const lvl_anim_time = fBlobb.bType === 1 || fBlobb.bType >= 3 ? "10s" : "0s"
  const text_gradient = fBlobb.number <= 50 ? "url(#c-grad)" : "url(#t-grad)"
  const SVG_BLOBB = () => 
    <svg className={show ? isSearched ? classes.s_blobb_svg_w_stats : classes.blobb_svg_w_stats : isSearched ? classes.s_blobb_svg : classes.blobb_svg } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
      <style type="text/css"> {`
        #b-path {
          transform: translate(100px, 100px);
          animation: b_anim infinite 10s ease forwards;
        }
        #t-path {
          animation: t_anim infinite 10s ease forwards;
        }
        #blobs {
          --b-value: 2px;
          user-select: none;
          cursor: pointer;
          transform-origin: center;
          // scale: `+ 1 +`;
          transition: .25s ease;
        }
        #blobs:active {
          scale: `+ 1.1 +`;
        }
        #blobs:hover {
          --b-value: 5px;
        } 
        #b, #b-blur {
          fill: url(#grad);
          stroke: url(#s-grad);
          stroke-width: 4px;
        }
        #b-blur {
          filter: blur(var(--b-value));
          transition: .25s ease;
        }
        #b-shad {
          transform: translate(2px, 2px);
          filter: blur(3px);
          stroke: black;
          stroke-width: 4px;
          // fill: #000000
        }
        #b-lvl {
          transform: translate(150px, 50px);
          transition: .25s ease;
        }
        #exp {
          transition: .25s ease;
        }
        #ver {
          pointer-events: none;
          transform: translate(130px, 147px) rotate(0deg);
          animation: ver infinite 10s ease forwards;
        }
        #crown {
          pointer-events: none;
          transform: translate(100px, 3px) rotate(25deg) scale(1.5);
          animation: c_anim infinite 10s ease forwards;
        }
        stop {
          transition: .25s ease;
        }
        textPath {
          font-family: Titan One;
          pointer-events: none;
        }
        @keyframes c_anim {
          25% { transform: translate(90px, 13px) rotate(15deg) scale(1.5); }
          50% { transform: translate(85px, 7px) rotate(0deg) scale(1.5); }
          75% { transform: translate(100px, 0px) rotate(15deg) scale(1.5); }
        }
        @keyframes t_anim {
          25% { d: path("M-65.17 26.34C-40.14 21.76-30.99 41.15-1.38 27.15 26.98 2 41.15 18.53 50.58 16.11") }
          50% { d: path("M-53.75 44.61C-48.66 9.51-7.22 26.3-.35-2.44 10.84-28.12 32.96-23.03 36.27-33.2") }
          75% { d: path("M-45.31-39.13C-27.43-10.3-12.21-23.92-.35-2.44 13.15 18.79 41.98 4.11 69.21 19.86") }
        }
        @keyframes b_anim {
          25% { d: path("M31,-41.9C41.5,-35,52.4,-27.8,60,-16.6C67.6,-5.4,72.1,9.7,71.3,26.6C70.5,43.4,64.5,61.9,51.7,67.5C39,73,19.5,65.5,0.7,64.6C-18.2,63.7,-36.3,69.3,-50.2,64.2C-64.1,59,-73.7,43,-79.2,25.8C-84.7,8.6,-86.1,-9.9,-78.9,-23.6C-71.7,-37.4,-55.9,-46.3,-41.4,-51.9C-26.8,-57.5,-13.4,-59.6,-1.6,-57.4C10.2,-55.2,20.5,-48.7,31,-41.9Z") }
          50% { d: path("M36.8,-50.2C49.5,-41.4,62.9,-33.1,66.8,-21.6C70.7,-10,65.3,4.7,57.5,15.6C49.7,26.6,39.7,33.7,29.7,45.4C19.8,57,9.9,73.2,-4,78.7C-18,84.3,-35.9,79.3,-48.8,68.5C-61.6,57.8,-69.3,41.4,-74.2,24.6C-79,7.7,-81,-9.6,-73.2,-20.7C-65.4,-31.8,-47.8,-36.7,-34,-45.1C-20.1,-53.5,-10.1,-65.5,1,-66.9C12,-68.3,24.1,-59,36.8,-50.2Z") }
          75% { d: path("M42-55.7C56-47.6 70.1-37.5 78.7-22.8 87.3-8.1 90.4 11.1 85.9 28.8 81.4 46.4 69.2 62.5 53.6 69.4 38 76.3 19 74.1 2.6 70.5-13.8 66.9-27.5 61.9-38.3 53.4-49.1 44.9-56.9 33-61.4 19.8-65.8 6.6-67-7.8-65-23.3-62.9-38.9-57.7-55.6-46.4-64.6-35-73.6-17.5-75-1.8-72.6 14-70.1 27.9-63.9 42-55.7Z") }
        }
        @keyframes ver {
          25% { transform: translate(145px, 155px) rotate(-15deg); }
          50% { transform: translate(125px, 130px) rotate(5deg); }
          75% { transform: translate(160px, 147px) rotate(20deg); }
        }
        @keyframes lvl {
          25% { transform: translate(145px, 52px) rotate(-10deg); }
          50% { transform: translate(150px, 44px) rotate(5deg); }
          75% { transform: translate(160px, 41px) rotate(15deg); }
        }
      `}</style>
      <g id="blobs">
        <g id="crown" style={{opacity: Number(fBlobb.king)}}>
          <use href="#c-path" filter="blur(1px)" stroke="url(#s-grad)" strokeWidth="2" />
          <use href="#c-path" filter="drop-shadow(1px 1px 1 #000b)" stroke="url(#s-grad)" strokeWidth="0.5" />
          <circle r={2} stroke="#0006" strokeWidth={0.75} transform="translate(12.3 8.3)" />
          <circle r={1} fill="url(#s-grad)" strokeWidth={1} transform="translate(3.75 8)" />
          <circle r={1} fill="url(#s-grad)" strokeWidth={1} transform="translate(20.25 8)" />
          <circle r={2} stroke="url(#s-grad)" strokeWidth={0.75} transform="translate(12 8)" />
        </g>
        <use id="b-shad" href="#b-path" />
        <use id="b" href="#b-path" />
        <use id="b-blur" href="#b-path" onClick={() => setShow(!show)} />
        <text fill={text_gradient} filter="drop-shadow(0 1px 0 #000000bb)">
          <textPath textAnchor="middle" startOffset="50%" style={{fontFamily: "Titan One", pointerEvents: "none"}}>
            {fBlobb.owner.slice(0, 5) + "..." + fBlobb.owner.toLowerCase().slice(38, 42)}
            <animate attributeName="href" repeatCount="indefinite" dur="1s" values="#t-path" />
          </textPath>
        </text>
        <g id="ver" style={{opacity: Number(fBlobb.creator === fBlobb.owner)}}>
          <circle r={8} fill="url(#s-grad)" stroke="url(#s-grad)" strokeWidth={1} filter="drop-shadow(1 1 1 #0008)" />
          <path d="M-3,1 L-1,4 L3,-3" stroke={text_gradient} /*stroke="white"*/ strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(1 0 1 #0009)" />
        </g>
        <g id="b-id">
          <text fill={text_gradient} fontSize="12px" filter="drop-shadow(0 1 0 #000d)">
            <textPath textAnchor="middle" startOffset="80%">
              {fBlobb.number + " / 1000"}
              <animate attributeName="href" repeatCount="indefinite" dur="1s" values="#b-path" />
            </textPath>
          </text>
        </g>
      </g>

      <g id="b-lvl" style={{"animation": "lvl infinite " + lvl_anim_time + " ease forwards"}}>
        <circle r={10} fill="url(#grad)" stroke="url(#s-grad)" strokeWidth={1} filter="drop-shadow(1 1 1 #000b)" />
        <circle r={10} stroke="url(#s-grad)" strokeWidth={2} filter="blur(1px)" />
        <circle id="exp" r="15" stroke={text_gradient} strokeDasharray="10" strokeDashoffset={(fBlobb.totalAttacks < MAX_ATTACKS_LVL ? 10 - fBlobb.totalAttacks%10 : 0)} pathLength="10" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 1 #000b)" transform="rotate(-90)" />
        <text fill={text_gradient} filter="drop-shadow(0 1px 0 #000d)" textAnchor="middle" style={{fontFamily: "Titan One", pointerEvents: "none", fontSize: "12px"}} transform="translate(0 4)">
          {fBlobb.totalAttacks < MAX_ATTACKS_LVL ? Math.floor(fBlobb.totalAttacks/10) : 99}
        </text>
      </g>
      <defs>
        <path id="t-path"
          d="M-60.38 7.8C-47.55-6.28-41.34-19.94-5.32-3.79 26.98 2 27.9433-15.1133 45.61-15.39"
          transform="translate(100 100)"
        />
        <path id="b-path" 
          d="M33.6-46C45.8-37.4 59.6-30.6 64-20.1 68.4-9.6 63.4 4.7 59.2 19.8 55.1 34.9 51.8 50.9 42.1 59.2 32.4 67.5 16.2 68.2-.6 69-17.4 69.9-34.9 71-46.4 63.2-57.8 55.5-63.4 38.9-69.3 22.2-75.2 5.4-81.5-11.5-78.2-26.6-75-41.7-62.3-55-47.6-62.8-33-70.7-16.5-73.2-2.9-69.2 10.7-65.1 21.4-54.6 33.6-46Z"
        />
        <path id="c-path" fill="url(#c-grad)"
          d="M2.801 5.2 7 8l4.186-5.86a1 1 0 011.628 0L17 8l4.2-2.8a1 1 0 011.547.95l-1.643 6a1 1 0 01-.993.883H3.889a1 1 0 01-.993-.883L1.253 6.149A1 1 0 012.8 5.2"
        />
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "rgb("+fBlobb.colors.start+","+fBlobb.hp/10+")"}}>
            {fBlobb.bType === 4 && 
              <animate 
                attributeName="stop-color" 
                values={"rgba(255,0,0,"+ fBlobb.hp/10 +");rgba(0,255,0,"+ fBlobb.hp/10 +");rgba(0,0,255,"+ fBlobb.hp/10 +");rgba(255,0,0,"+ fBlobb.hp/10 +");"}
                dur="5s" 
                repeatCount="indefinite" 
              />
            }
          </stop>
          <stop offset="100%" style={{stopColor: "rgb("+fBlobb.colors.end+","+fBlobb.hp/10+")"}}>
            {fBlobb.bType === 4 && 
              <animate 
                attributeName="stop-color" 
                values={"rgba(255,255,0,"+ fBlobb.hp/10 +");rgba(0,255,255,"+ fBlobb.hp/10 +");rgba(255,0,255,"+ fBlobb.hp/10 +");rgba(255,255,0,"+ fBlobb.hp/10 +");"}
                dur="5s" 
                repeatCount="indefinite" 
              />
            }
          </stop>
        </linearGradient>
        <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: "rgb("+fBlobb.colors.start+")"}}>
            {fBlobb.bType === 4 && 
              <animate 
                attributeName="stop-color" 
                values={"rgb(255,0,0);rgb(0,255,0);rgb(0,0,255);rgb(255,0,0);"}
                dur="5s" 
                repeatCount="indefinite" 
              />
            }
          </stop>
          <stop offset="100%" style={{stopColor: "rgb("+fBlobb.colors.end+")"}}>
            {fBlobb.bType === 4 && 
              <animate 
                attributeName="stop-color" 
                values={"rgb(255,255,0);rgb(0,255,255);rgb(255,0,255);rgb(255,255,0);"}
                dur="5s" 
                repeatCount="indefinite" 
              />
            }
          </stop>
          {fBlobb.bType >= 2 && <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="1.5s" repeatCount="indefinite" />}
        </linearGradient>
        <linearGradient id="t-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "#fffd"}} />
          <stop offset="45%" style={{stopColor: "#fffd"}} />
          <stop offset="50%" style={{stopColor: "#fff"}} />
          <stop offset="60%" style={{stopColor: "#fff"}} />
          <stop offset="65%" style={{stopColor: "#fffd"}} />
          <stop offset="100%" style={{stopColor: "#fffd"}} />
        </linearGradient>
        <linearGradient id="c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "#fe9"}} />
          <stop offset="40%" style={{stopColor: "#fb4"}} />
          <stop offset="50%" style={{stopColor: "#fe9"}} />
          <stop offset="60%" style={{stopColor: "#fe9"}} />
          <stop offset="70%" style={{stopColor: "#fb4"}} />
          <stop offset="100%" style={{stopColor: "#fe9"}} />
        </linearGradient>
      </defs>
    </svg>
  // const SVG_BLOBB_FOR_VIDEOS = () => 
  //   <svg className={show ? isSearched ? classes.s_blobb_svg_w_stats : classes.blobb_svg_w_stats : isSearched ? classes.s_blobb_svg : classes.blobb_svg } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  //     <style type="text/css"> {`
  //       #b-path {
  //         transform: translate(100px, 100px);
  //         animation: b_anim infinite 10s ease forwards;
  //       }
  //       #t-path {
  //         animation: t_anim infinite 10s ease forwards;
  //       }
  //       #blobs {
  //         --b-value: 2px;
  //         user-select: none;
  //         cursor: pointer;
  //         transform-origin: center;
  //         // scale: `+ 1 +`;
  //         transition: .25s ease;
  //       }
  //       #blobs:active {
  //         scale: `+ 1.1 +`;
  //       }
  //       #blobs:hover {
  //         --b-value: 5px;
  //       } 
  //       #b, #b-blur {
  //         fill: url(#grad);
  //         stroke: url(#s-grad);
  //         stroke-width: 4px;
  //       }
  //       #b-blur {
  //         filter: blur(var(--b-value));
  //         transition: .25s ease;
  //       }
  //       #b-shad {
  //         transform: translate(2px, 2px);
  //         filter: blur(3px);
  //         stroke: black;
  //         stroke-width: 4px;
  //         // fill: #000000
  //       }
  //       #b-lvl {
  //         transform: translate(150px, 50px);
  //         transition: .25s ease;
  //       }
  //       #exp {
  //         transition: .25s ease;
  //       }
  //       #ver {
  //         pointer-events: none;
  //         transform: translate(130px, 147px) rotate(0deg);
  //         animation: ver infinite 10s ease forwards;
  //       }
  //       #crown {
  //         pointer-events: none;
  //         transform: translate(100px, 3px) rotate(25deg) scale(1.5);
  //         animation: c_anim infinite 10s ease forwards;
  //       }
  //       stop {
  //         transition: .25s ease;
  //       }
  //       textPath {
  //         font-family: Titan One;
  //         pointer-events: none;
  //       }
  //       @keyframes c_anim {
  //         25% { transform: translate(90px, 13px) rotate(15deg) scale(1.5); }
  //         50% { transform: translate(85px, 7px) rotate(0deg) scale(1.5); }
  //         75% { transform: translate(100px, 0px) rotate(15deg) scale(1.5); }
  //       }
  //       @keyframes t_anim {
  //         25% { d: path("M-65.17 26.34C-40.14 21.76-30.99 41.15-1.38 27.15 26.98 2 41.15 18.53 50.58 16.11") }
  //         50% { d: path("M-53.75 44.61C-48.66 9.51-7.22 26.3-.35-2.44 10.84-28.12 32.96-23.03 36.27-33.2") }
  //         75% { d: path("M-45.31-39.13C-27.43-10.3-12.21-23.92-.35-2.44 13.15 18.79 41.98 4.11 69.21 19.86") }
  //       }
  //       @keyframes b_anim {
  //         25% { d: path("M31,-41.9C41.5,-35,52.4,-27.8,60,-16.6C67.6,-5.4,72.1,9.7,71.3,26.6C70.5,43.4,64.5,61.9,51.7,67.5C39,73,19.5,65.5,0.7,64.6C-18.2,63.7,-36.3,69.3,-50.2,64.2C-64.1,59,-73.7,43,-79.2,25.8C-84.7,8.6,-86.1,-9.9,-78.9,-23.6C-71.7,-37.4,-55.9,-46.3,-41.4,-51.9C-26.8,-57.5,-13.4,-59.6,-1.6,-57.4C10.2,-55.2,20.5,-48.7,31,-41.9Z") }
  //         50% { d: path("M36.8,-50.2C49.5,-41.4,62.9,-33.1,66.8,-21.6C70.7,-10,65.3,4.7,57.5,15.6C49.7,26.6,39.7,33.7,29.7,45.4C19.8,57,9.9,73.2,-4,78.7C-18,84.3,-35.9,79.3,-48.8,68.5C-61.6,57.8,-69.3,41.4,-74.2,24.6C-79,7.7,-81,-9.6,-73.2,-20.7C-65.4,-31.8,-47.8,-36.7,-34,-45.1C-20.1,-53.5,-10.1,-65.5,1,-66.9C12,-68.3,24.1,-59,36.8,-50.2Z") }
  //         75% { d: path("M42-55.7C56-47.6 70.1-37.5 78.7-22.8 87.3-8.1 90.4 11.1 85.9 28.8 81.4 46.4 69.2 62.5 53.6 69.4 38 76.3 19 74.1 2.6 70.5-13.8 66.9-27.5 61.9-38.3 53.4-49.1 44.9-56.9 33-61.4 19.8-65.8 6.6-67-7.8-65-23.3-62.9-38.9-57.7-55.6-46.4-64.6-35-73.6-17.5-75-1.8-72.6 14-70.1 27.9-63.9 42-55.7Z") }
  //       }
  //       @keyframes ver {
  //         25% { transform: translate(145px, 155px) rotate(-15deg); }
  //         50% { transform: translate(125px, 130px) rotate(5deg); }
  //         75% { transform: translate(160px, 147px) rotate(20deg); }
  //       }
  //       @keyframes lvl {
  //         25% { transform: translate(145px, 52px) rotate(-10deg); }
  //         50% { transform: translate(150px, 44px) rotate(5deg); }
  //         75% { transform: translate(160px, 41px) rotate(15deg); }
  //       }
  //     `}</style>
  //     <g id="blobs">
  //       <g id="crown" style={{opacity: Number(fBlobb.king)}}>
  //         <use href="#c-path" filter="blur(1px)" />
  //         <use href="#c-path" filter="drop-shadow(1px 1px 1 #000b)" />
  //         <circle r={2} stroke="#0006" strokeWidth={0.75} transform="translate(12.3 8.3)" />
  //         <circle r={1} fill="url(#s-grad)" strokeWidth={1} transform="translate(3.75 8)" />
  //         <circle r={1} fill="url(#s-grad)" strokeWidth={1} transform="translate(20.25 8)" />
  //         <circle r={2} stroke="url(#s-grad)" strokeWidth={0.75} transform="translate(12 8)" />
  //       </g>
  //       <use id="b-shad" href="#b-path" />
  //       <use id="b" href="#b-path" />
  //       <use id="b-blur" href="#b-path" onClick={() => setShow(!show)} />
  //       <text fill="url(#t-grad)" filter="drop-shadow(0 1px 0 #000000bb)">
  //         <textPath textAnchor="middle" startOffset="50%" style={{fontFamily: "Titan One", pointerEvents: "none"}}>
  //           {fBlobb.owner.slice(0, 5) + "..." + fBlobb.owner.toLowerCase().slice(38, 42)}
  //           <animate attributeName="href" repeatCount="indefinite" dur="1s" values="#t-path" />
  //         </textPath>
  //       </text>
  //       <g id="ver" style={{opacity: Number(fBlobb.creator === fBlobb.owner)}}>
  //         <circle r={8} fill="url(#s-grad)" stroke="url(#s-grad)" strokeWidth={1} filter="drop-shadow(1 1 1 #0008)" />
  //         <path d="M-3,1 L-1,4 L3,-3" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(1 0 1 #0009)" />
  //       </g>
  //       <g id="b-id">
  //         <text fill="url(#t-grad)" fontSize="12px" filter="drop-shadow(0 1 0 #000d)">
  //           <textPath textAnchor="middle" startOffset="80%">
  //             {/*fBlobb.number*/4 + " / 1000"}
  //             <animate attributeName="href" repeatCount="indefinite" dur="1s" values="#b-path" />
  //           </textPath>
  //         </text>
  //       </g>
  //     </g>

  //     <g id="b-lvl" style={{"animation": "lvl infinite " + lvl_anim_time + " ease forwards"}}>
  //       <circle r={10} fill="url(#grad)" stroke="url(#s-grad)" strokeWidth={1} filter="drop-shadow(1 1 1 #000b)" />
  //       <circle r={10} stroke="url(#s-grad)" strokeWidth={2} filter="blur(1px)" />
  //       <circle id="exp" r="15" stroke={fBlobb.number <= 0 ? "url(#c-grad)" : "url(#t-grad)"} strokeDasharray="10" strokeDashoffset={(fBlobb.totalAttacks > MAX_ATTACKS_LVL ? 10 - fBlobb.totalAttacks%10 : 7)} pathLength="10" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 1 #000b)" transform="rotate(-90)" />
  //       <text fill={fBlobb.number <= 0 ? "url(#c-grad)" : "url(#t-grad)"} filter="drop-shadow(0 1px 0 #000d)" textAnchor="middle" style={{fontFamily: "Titan One", pointerEvents: "none", fontSize: "12px"}} transform="translate(0 4)">
  //         {fBlobb.totalAttacks > MAX_ATTACKS_LVL ? Math.floor(fBlobb.totalAttacks/10) : 10}
  //       </text>
  //     </g>
  //     <defs>
  //       <path id="t-path"
  //         d="M-60.38 7.8C-47.55-6.28-41.34-19.94-5.32-3.79 26.98 2 27.9433-15.1133 45.61-15.39"
  //         transform="translate(100 100)"
  //       />
  //       <path id="b-path" 
  //         d="M33.6-46C45.8-37.4 59.6-30.6 64-20.1 68.4-9.6 63.4 4.7 59.2 19.8 55.1 34.9 51.8 50.9 42.1 59.2 32.4 67.5 16.2 68.2-.6 69-17.4 69.9-34.9 71-46.4 63.2-57.8 55.5-63.4 38.9-69.3 22.2-75.2 5.4-81.5-11.5-78.2-26.6-75-41.7-62.3-55-47.6-62.8-33-70.7-16.5-73.2-2.9-69.2 10.7-65.1 21.4-54.6 33.6-46Z"
  //       />
  //       <path id="c-path" fill="url(#c-grad)"
  //         d="M2.801 5.2 7 8l4.186-5.86a1 1 0 011.628 0L17 8l4.2-2.8a1 1 0 011.547.95l-1.643 6a1 1 0 01-.993.883H3.889a1 1 0 01-.993-.883L1.253 6.149A1 1 0 012.8 5.2"
  //       />
  //       <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
  //         <stop offset="0%" style={{stopColor: "rgb("+state.colors.start+","+state.colors.a+")", stopopacity: 0.5}} />
  //         <stop offset="100%" style={{stopColor: "rgb("+state.colors.end+","+state.colors.a+")", stopopacity: 0.5}} />
  //       </linearGradient>
  //       <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="0%">
  //         <stop offset="0%" style={{stopColor: "rgb("+state.colors.start+")", stopopacity: 0.5}} />
  //         <stop offset="100%" style={{stopColor: "rgb("+state.colors.end+")", stopopacity: 0.5}} />
  //         <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="1.5s" repeatCount="indefinite" />
  //       </linearGradient>
  //       <linearGradient id="t-grad" x1="0%" y1="0%" x2="100%" y2="100%">
  //         <stop offset="0%" style={{stopColor: "#fffd"}} />
  //         <stop offset="45%" style={{stopColor: "#fffd"}} />
  //         <stop offset="50%" style={{stopColor: "#fff"}} />
  //         <stop offset="60%" style={{stopColor: "#fff"}} />
  //         <stop offset="65%" style={{stopColor: "#fffd"}} />
  //         <stop offset="100%" style={{stopColor: "#fffd"}} />
  //       </linearGradient>
  //       <linearGradient id="c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
  //         <stop offset="0%" style={{stopColor: "#fe9"}} />
  //         <stop offset="40%" style={{stopColor: "#fb4"}} />
  //         <stop offset="50%" style={{stopColor: "#fe9"}} />
  //         <stop offset="60%" style={{stopColor: "#fe9"}} />
  //         <stop offset="70%" style={{stopColor: "#fb4"}} />
  //         <stop offset="100%" style={{stopColor: "#fe9"}} />
  //       </linearGradient>
  //     </defs>
  //   </svg>
  
  return SVG_BLOBB()
}

export default EnemyBlobbSVG