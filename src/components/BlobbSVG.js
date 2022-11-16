import classes from "./BlobbSVG.module.css"

function BlobbSVG({ currAccount, blobHP, show, setShow }) {
  const SVG_SQWARE = (bHP, smooth) => 
    <svg className={classes.blobb_svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 125" fill="none">
      <style type="text/css">
        {`
          #blobb, #blobb-shadow, #path {
            // animation: spin infinite 10s linear;
            transform-box: fill-box;
            transform-origin: center;
            scale: `+bHP/10+`;
            transition: .25s ease;            
          }
          #blobb:active {
            scale: `+(bHP/10+.1)+`;
          }
          #blobb-blur {
            filter: blur(2px);
          }
          #blobb-shadow {
            transform-box: fill-box;
            filter: blur(3px);
          }
          .address_text {
            font-weight: bold;
            font-size: 5px;
            text-shadow: 2px 2px 0 #0009;
          }
          @keyframes spin {
            from {
              rotate: 0deg;
            }
            to {
              rotate: 360deg;
            }
          }
        `}
      </style>
      <g>
        <rect width="100%" height="100%" />
        <rect id="blobb-shadow"
          width={100}
          height={100}
          rx={smooth}
          fill="#000"
          x={14}
          y={14}
        />
        <g id="blobb">
          {/* <rect id="blobb-blur"
            width={100}
            height={100}
            rx={smooth}
            fill="url(#grad)"
            x={12.5}
            y={12.5}
          /> */}
          <rect
            width={100}
            height={100}
            rx={smooth}
            // ry="10%"
            fill="url(#grad)"
            x={12.5}
            y={12.5}
          />
        </g>
        <path id="path" d="M12.5,12.5 h100 v100 H12.5 Z" fill="black"></path>
        
        <a href={"https://mumbai.polygonscan.com/address/"+currAccount} target="_blank">
          <text className="address_text" x={0} y={"100%"} dy="-5" fill={"#3f3f3f"} textAnchor="start">{currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42)}</text>
        </a>
        
      </g>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: "rgb(255,0,0)", stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: "rgb(255,255,0)", stopOpacity: 1}} />
        </linearGradient>
      </defs>
    </svg>
  const SVG_BLOBB = () => 
    <svg className={show ? classes.blobb_svg_w_stats : classes.blobb_svg } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
      <style type="text/css"> {`
        #b-path {
          transform: translate(100px, 100px);
          animation: b_anim infinite 10s ease forwards;
        }
        #t-path {
          animation: t_anim infinite 10s ease forwards;
        }
        #blobs {
          user-select: none;
          cursor: pointer;
          transform-origin: center;
          // scale: `+ 1 +`;
          transition: .25s ease;
        }
        #blobs:active {
          scale: `+ 1.1 +`
        }
        #b, #b-blur {
          fill: url(#grad);
          stroke: url(#s-grad);
          stroke-width: 4px;
        }
        #b-blur {
          filter: blur(2px);
        }
        #b-shad {
          transform: translate(2px, 2px);
          filter: blur(3px);
          stroke: black;
          stroke-width: 4px;
          // fill: #000000
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
      `}</style>
      <g id="blobs">
        <use id="b-shad" href="#b-path" />
        <use id="b" href="#b-path" />
        <use id="b-blur" href="#b-path" onClick={() => setShow(!show)} />
        <text fill="white" filter="drop-shadow(0 1px 0 #000000bb)">
          <textPath textAnchor="middle" startOffset="50%" style={{fontFamily: "Titan One", pointerEvents: "none"}}>
            {currAccount.slice(0, 5) + "..." + currAccount.slice(38, 42)}
            <animate attributeName="href" repeatCount="indefinite" dur="1s" values="#t-path" />
          </textPath>
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
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: "rgb(255,0,0,"+blobHP/10+")", stopopacity: 0.5}} />
          <stop offset="100%" style={{stopColor: "rgb(255,255,0,"+blobHP/10+")", stopopacity: 0.5}} />
        </linearGradient>
        <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: "rgb(255,0,0)", stopopacity: 0.5}} />
          <stop offset="100%" style={{stopColor: "rgb(255,255,0)", stopopacity: 0.5}} />
        </linearGradient>
        <linearGradient id="t-grad" x1="25%" y1="0%" x2="50%" y2="0%">
          <stop offset="0%" style={{stopColor: "rgb(200,200,200)", stopopacity: 0.5}} />
          <stop offset="45%" style={{stopColor: "rgb(200,200,200)", stopopacity: 0.5}} />
          <stop offset="50%" style={{stopColor: "rgb(255,255,255)", stopopacity: 0.5}} />
          <stop offset="65%" style={{stopColor: "rgb(255,255,255)", stopopacity: 0.5}} />
          <stop offset="100%" style={{stopColor: "rgb(200,200,200)", stopopacity: 0.5}} />
        </linearGradient>
      </defs>
    </svg>
  
  return SVG_BLOBB()
}

export default BlobbSVG