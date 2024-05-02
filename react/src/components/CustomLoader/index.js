import { Card, Typography } from '@material-ui/core'
import "./style.css"
function CustomLoader() {
  return (
    <div className="my-loader">

      {
        //<div className="main">
        // <Card className="card" style={{ borderRadius: 10 }}>
        //   <Typography variant="h5" align="center"
        //     style={{
        //       color: '#42a5f5', paddingBottom: 20,
        //       textShadow: '1px 1px 3px #42aff5'
        //     }} >Please wait</Typography>
        //   <svg className="svg" width="243" height="95" viewBox="0 0 243 95" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <g id="Truck" filter="url(#filter0_f)">
        //       <g id="Body">
        //         <g id="Line 6" filter="url(#filter1_f)">
        //           <line x1="158.623" y1="70.42" x2="186.738" y2="70.42" stroke="#42AFF5" stroke-width="6" />
        //         </g>
        //         <g id="Vector 5" filter="url(#filter2_f)">
        //           <path d="M202.302 56.3196C204.348 55.3516 215.144 53.2749 221.485 56.3196C226.876 58.9084 228.122 66.2449 227.879 69.9761" stroke="#42AFF5" stroke-width="4" />
        //         </g>
        //         <g id="Vector 2" filter="url(#filter3_f)">
        //           <path d="M178.184 16.3499C183.429 18.1074 186.57 20.6757 186.57 20.6757C191.558 24.3622 195.776 37.0119 181.452 38.7376C174.11 39.6221 170.209 38.0463 168.37 34.8369C166.898 32.2694 166.507 27.2496 166.703 25.9559" stroke="#42AFF5" stroke-width="3" />
        //         </g>
        //         <g id="Line 5" filter="url(#filter4_f)">
        //           <line x1="178.705" y1="58.7246" x2="83.8157" y2="58.7246" stroke="#42AFF5" stroke-width="8" stroke-linejoin="round" />
        //         </g>
        //         <g id="Vector 3" filter="url(#filter5_f)">
        //           <path d="M140.953 8.48371C143.745 28.781 136.491 36.6147 132.516 37.9944" stroke="#42AFF5" stroke-width="3" />
        //         </g>
        //         <g id="Vector 4" filter="url(#filter6_f)">
        //           <path d="M97.3842 6.01828C99.5641 20.903 93.9327 26.6518 90.8445 27.6655" stroke="#42AFF5" stroke-width="3" />
        //         </g>
        //         <g id="Vector 1" filter="url(#filter7_f)">
        //           <path d="M88.3342 4.78828C116.585 1.25574 137.005 3.58604 146.078 6.3643C158.127 10.0542 167.151 27.4195 162.639 36.7672C153.734 55.2166 140.549 51.5267 138.289 51.5267C122.07 51.5267 91.5822 35.8469 77.2888 24.2926" stroke="#42AFF5" stroke-width="4" stroke-linecap="square" stroke-linejoin="round" />
        //         </g>
        //         <g id="Vector 6" filter="url(#filter8_f)">
        //           <path d="M233.179 64.3183C244.626 68.2541 239.12 70.7141 234.936 71.452" stroke="#42AFF5" stroke-width="3" />
        //         </g>
        //         <g id="Vector 7" filter="url(#filter9_f)">
        //           <path d="M196.007 58.557V23.0506H219.633L233.483 42.6835V56.0506" stroke="#42AFF5" stroke-width="5" />
        //         </g>
        //       </g>
        //       <g id="right-wheel" filter="url(#filter10_f)">
        //         <g id="Ellipse 1" filter="url(#filter11_f)">
        //           <path d="M223.624 78.7595C223.624 85.4827 218.048 91.019 211.062 91.019C204.076 91.019 198.5 85.4827 198.5 78.7595C198.5 72.0363 204.076 66.5 211.062 66.5C218.048 66.5 223.624 72.0363 223.624 78.7595Z" stroke="#42AFF5" stroke-width="5" />
        //         </g>
        //         <g id="Line 8" filter="url(#filter12_f)">
        //           <path d="M216.854 73.7509L205.765 84.9076" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //         <g id="Line 9" filter="url(#filter13_f)">
        //           <path d="M205.722 73.6169L217.474 85.0344" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //       </g>
        //       <g id="left-wheel" filter="url(#filter14_f)">
        //         <g id="Ellipse 1_2" filter="url(#filter15_f)">
        //           <path d="M114.624 78.7595C114.624 85.4827 109.048 91.019 102.062 91.019C95.0761 91.019 89.5 85.4827 89.5 78.7595C89.5 72.0363 95.0761 66.5 102.062 66.5C109.048 66.5 114.624 72.0363 114.624 78.7595Z" stroke="#42AFF5" stroke-width="5" />
        //         </g>
        //         <g id="Line 8_2" filter="url(#filter16_f)">
        //           <path d="M107.854 73.7509L96.7649 84.9076" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //         <g id="Line 9_2" filter="url(#filter17_f)">
        //           <path d="M96.7218 73.6169L108.475 85.0343" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //       </g>
        //       <g id="center-wheel" filter="url(#filter18_f)">
        //         <g id="Ellipse 1_3" filter="url(#filter19_f)">
        //           <path d="M153.624 78.7595C153.624 85.4827 148.048 91.019 141.062 91.019C134.076 91.019 128.5 85.4827 128.5 78.7595C128.5 72.0363 134.076 66.5 141.062 66.5C148.048 66.5 153.624 72.0363 153.624 78.7595Z" stroke="#42AFF5" stroke-width="5" />
        //         </g>
        //         <g id="Line 8_3" filter="url(#filter20_f)">
        //           <path d="M146.854 73.7509L135.765 84.9076" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //         <g id="Line 9_3" filter="url(#filter21_f)">
        //           <path d="M135.722 73.6169L147.475 85.0343" stroke="#42AFF5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        //         </g>
        //       </g>
        //       <path id="smoke" d="M47.2735 61.5175C47.3488 61.5353 47.4229 61.5554 47.4988 61.5716C48.8911 61.869 50.3334 61.8744 51.7398 61.5873C53.1463 61.3002 54.4882 60.7265 55.6857 59.9004C56.0545 59.8101 56.4189 59.6998 56.7772 59.57C58.7875 60.7792 60.9839 61.6382 63.2795 62.1131C71.1872 63.7939 78.5295 60.9471 79.6789 55.7543C80.8284 50.5615 75.3497 44.9894 67.4419 43.3085C65.7299 42.9406 63.977 42.7834 62.2201 42.8402C60.8862 40.8685 58.9437 39.421 56.6967 38.7243C54.4498 38.0276 52.0253 38.1212 49.803 38.9902C50.9474 38.1117 51.9154 37.012 52.6506 35.7552C53.3859 34.4984 53.8739 33.1094 54.0862 31.6689C54.2986 30.2284 54.2311 28.765 53.8877 27.3636C53.5443 25.9623 52.9318 24.651 52.0858 23.5058C51.2398 22.3606 50.177 21.4043 48.9593 20.6924C47.7416 19.9805 46.3931 19.5273 44.9922 19.3589C43.5912 19.1905 42.1657 19.3104 40.7983 19.7116C39.431 20.1128 38.149 20.7873 37.0268 21.696C36.7758 19.7135 35.999 17.8512 34.7809 16.3115C33.5628 14.7718 31.95 13.6134 30.1176 12.9623C28.2852 12.3112 26.3033 12.1923 24.3873 12.6183C22.4712 13.0444 20.6943 13.9992 19.2494 15.3791C17.8046 16.759 16.7471 18.5111 16.1919 20.4452C15.6367 22.3793 15.6049 24.4213 16.1001 26.3495C16.5952 28.2777 17.5984 30.0183 19.0005 31.3822C20.4027 32.7462 22.1503 33.6813 24.0534 34.086C24.2059 34.1184 24.3583 34.1453 24.5106 34.1708C23.7472 35.5534 23.279 37.0822 23.1378 38.6533C22.9965 40.2244 23.1855 41.8012 23.6919 43.2764C24.1982 44.7517 25.0102 46.0909 26.0725 47.2032C27.1349 48.3155 28.4228 49.1748 29.8487 49.7227C28.7795 50.8985 27.9672 52.2938 27.4683 53.8118C26.9695 55.3298 26.796 56.934 26.96 58.5131C27.1239 60.0923 27.6213 61.6085 28.4177 62.9565C29.214 64.3045 30.2903 65.452 31.5717 66.3194C32.8531 67.1868 34.3089 67.7532 35.8381 67.9794C37.3673 68.2056 38.9333 68.086 40.4273 67.6292C41.9213 67.1723 43.3076 66.389 44.4898 65.3336C45.672 64.2782 46.6219 62.976 47.2735 61.5175V61.5175ZM44.1861 41.647C44.2204 41.492 44.2495 41.337 44.2772 41.1822C44.6063 41.1512 44.9321 41.1046 45.2546 41.0424C44.8851 41.2321 44.5261 41.4432 44.1793 41.6746L44.1861 41.647Z" fill="#CFDFEA" />
        //       <circle id="outer1" cx="16" cy="37" r="10" fill="#CFDFEA" />
        //       <circle id="outer2" cx="21" cy="51" r="10" fill="#CFDFEA" />
        //       <circle id="outer3" cx="11" cy="26" r="10" fill="#CFDFEA" />
        //       <circle id="outer4" cx="37" cy="16" r="10" fill="#CFDFEA" />
        //     </g>
        //     <defs>
        //       <filter id="filter0_f" x="0" y="-3.05176e-05" width="242.5" height="94.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter1_f" x="157.623" y="66.42" width="30.1155" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter2_f" x="200.447" y="51.7245" width="30.4605" height="19.3817" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter3_f" x="164.156" y="13.9276" width="29.6007" height="27.5516" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter4_f" x="82.8157" y="53.7246" width="96.8897" height="10" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter5_f" x="131.024" y="7.27927" width="13.0494" height="33.1322" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter6_f" x="89.3767" y="4.80093" width="10.9929" height="25.2898" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter7_f" x="73.4761" y="-3.05176e-05" width="93.3469" height="54.8232" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter8_f" x="231.691" y="61.8998" width="10.8087" height="12.0294" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter9_f" x="192.507" y="19.5506" width="44.4755" height="40.0063" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter10_f" x="195" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter11_f" x="195" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter12_f" x="203.152" y="71.3729" width="16.3152" height="15.9126" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter13_f" x="203.139" y="71.204" width="16.9174" height="16.2432" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter14_f" x="86" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter15_f" x="86" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter16_f" x="94.152" y="71.3729" width="16.3152" height="15.9126" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter17_f" x="94.1395" y="71.204" width="16.9174" height="16.2432" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter18_f" x="125" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter19_f" x="125" y="63" width="32.1237" height="31.519" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter20_f" x="133.152" y="71.3729" width="16.3152" height="15.9126" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //       <filter id="filter21_f" x="133.139" y="71.204" width="16.9174" height="16.2432" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        //         <feFlood flood-opacity="0" result="BackgroundImageFix" />
        //         <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        //         <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur" />
        //       </filter>
        //     </defs>
        //   </svg>
        //   <Typography variant="body1" align="center" style={{ color: 'gray', paddingTop: 20 }}>while your app is loading...</Typography>


        // </Card>

      }


    </div >
  )
}

export default CustomLoader
