import Head from "next/head";
import styles from "../../styles/season-of-blockchains/orgView.module.css";
import Link from "next/link";
import Error404 from "../404";
import { useEffect, useState } from "react";
export default function SeasonOfBlockchainsOrgPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <Error404 />;
  // return (
  //   <div className={styles.wrapper}>
  //     <Head>
  //       <title>orgName</title>
  //       <link rel="icon" href="/favicon.png" />
  //     </Head>
  //     <header className={(menuOpen ? "bg-purple " : "") + styles.header}>
  //       <div className={styles.headerLogo}></div>
  //       <div className={styles.headerMenuIcon}>
  //         <button
  //           className={
  //             "text-white cursor-pointer text-xl leading-none px-2 py-2 border-transparent rounded block outline-none focus:outline-none " +
  //             (menuOpen ? "hidden" : "")
  //           }
  //           type="button"
  //           onClick={() => setMenuOpen(!menuOpen)}
  //         >
  //           <svg
  //             fill="white"
  //             xmlns="http://www.w3.org/2000/svg"
  //             viewBox="0 0 92 92"
  //             width={24}
  //             height={24}
  //           >
  //             <path
  //               d="M78,23.5H14c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5h64c3.6,0,6.5,2.9,6.5,6.5S81.6,23.5,78,23.5z M84.5,46
  // c0-3.6-2.9-6.5-6.5-6.5H14c-3.6,0-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5h64C81.6,52.5,84.5,49.6,84.5,46z M84.5,75c0-3.6-2.9-6.5-6.5-6.5
  // H14c-3.6,0-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5h64C81.6,81.5,84.5,78.6,84.5,75z"
  //             />
  //           </svg>
  //         </button>
  //         <button
  //           className={
  //             "text-white cursor-pointer text-xl leading-none px-2 py-2 border-transparent rounded block outline-none focus:outline-none " +
  //             (menuOpen ? "" : "hidden")
  //           }
  //           type="button"
  //           onClick={() => setMenuOpen(!menuOpen)}
  //         >
  //           <svg
  //             fill="white"
  //             xmlns="http://www.w3.org/2000/svg"
  //             width={26}
  //             height={26}
  //             viewBox="0 0 92 92"
  //           >
  //             <path
  //               d="M70.7,64.3c1.8,1.8,1.8,4.6,0,6.4c-0.9,0.9-2,1.3-3.2,1.3c-1.2,0-2.3-0.4-3.2-1.3L46,52.4L27.7,70.7
  //        c-0.9,0.9-2,1.3-3.2,1.3s-2.3-0.4-3.2-1.3c-1.8-1.8-1.8-4.6,0-6.4L39.6,46L21.3,27.7c-1.8-1.8-1.8-4.6,0-6.4c1.8-1.8,4.6-1.8,6.4,0
  //        L46,39.6l18.3-18.3c1.8-1.8,4.6-1.8,6.4,0c1.8,1.8,1.8,4.6,0,6.4L52.4,46L70.7,64.3z"
  //             />
  //           </svg>
  //         </button>
  //       </div>
  //       <div
  //         className={
  //           "lg:flex flex-grow items-center justify-end " +
  //           (menuOpen
  //             ? " flex justify-center absolute left-0 right-0 bg-purple pt-4 pb-4 z-10 shadow-2xl "
  //             : " hidden ") +
  //           styles.headerMenu
  //         }
  //       >
  //         <div className={styles.row}>
  //           <ul className="flex flex-col lg:flex-row list-none lg:ml-auto w-full">
  //             <li className={menuOpen ? "" : "mr-4"}>
  //               <a
  //                 className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
  //                 href="https://airtable.com/shr5PEUTXvcCRF717"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 Apply Now
  //               </a>
  //             </li>
  //             <li className={menuOpen ? "" : "mr-4"}>
  //               <a
  //                 className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
  //                 href="https://gitopia.com/whitepaper.pdf"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 Whitepaper
  //               </a>
  //             </li>
  //             <li>
  //               <a
  //                 className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
  //                 href="https://medium.com/gitopia"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 Blog
  //               </a>
  //             </li>
  //             <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
  //             <li className={menuOpen ? "" : "mr-4"}>
  //               <a
  //                 className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
  //                 href="/home"
  //                 target="_blank"
  //                 rel="noreferrer"
  //               >
  //                 Try Testnet
  //               </a>
  //             </li>
  //             {/* <li className="border-b-2 lg:border-r-2 lg:border-b-0 border-white border-opacity-10 w-full h-2 mb-4 lg:h-6 lg:w-1 lg:mr-4 lg:mb-0 mt-2"></li> */}
  //           </ul>
  //         </div>
  //       </div>
  //       <div className={styles.headerLine}></div>
  //     </header>
  //     <div
  //       className={"relative flex items-center justify-center " + styles.image}
  //     >
  //       <img src="/season-of-blockchains/org-1.png"></img>
  //     </div>
  //     <div className={" " + styles.title}>52°North GmbH</div>
  //     <div className={"hover:text-purple-400 " + styles.content}>
  //       <a href="https://52north.org/" target="_blank" rel="noreferrer">
  //         https://52north.org/
  //       </a>
  //     </div>

  //     <div className={styles.cardContainer}>
  //       <div className={" " + styles.card1}>
  //         <div className={styles.card1a}>
  //           <div className={" " + styles.card1a1}>
  //             <div className={styles.cardTitle}>Topics</div>
  //             <div className={"" + styles.cardBody}>
  //               Science and Medicine, Spatial Information Structure, Science,
  //               Some other titles, and longer titles.
  //             </div>
  //           </div>
  //           <div className={" " + styles.card1a2}>
  //             <div className={styles.cardTitle}>Technologies</div>
  //             <div className="flex">
  //               <div className={""}>
  //                 <div className={styles.cardTech}>JAVA SCRIPT</div>
  //                 <div className={styles.cardTech}>VUE.JS</div>
  //               </div>
  //               <div className={""}>
  //                 <div className={styles.cardTech}>PYTHON</div>
  //                 <div className={styles.cardTech}>WEB GL</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={styles.hr}></div>
  //         <div className={styles.card1b}>
  //           <div className={"flex " + styles.card1b1}>
  //             <svg
  //               width="28"
  //               height="28"
  //               viewBox="0 0 28 28"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <rect width="14" height="14" fill="#D6FFF5" />
  //               <rect x="14" y="14" width="14" height="14" fill="#D6FFF5" />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 0 28)"
  //                 fill="#D6FFF5"
  //               />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 14 14)"
  //                 fill="#D6FFF5"
  //               />
  //             </svg>
  //             <div className={styles.card1b2}>IRC CHANNEL</div>
  //           </div>
  //           <div className={"flex " + styles.card1b1}>
  //             <svg
  //               width="28"
  //               height="28"
  //               viewBox="0 0 28 28"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <rect width="14" height="14" fill="#D6FFF5" />
  //               <rect x="14" y="14" width="14" height="14" fill="#D6FFF5" />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 0 28)"
  //                 fill="#D6FFF5"
  //               />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 14 14)"
  //                 fill="#D6FFF5"
  //               />
  //             </svg>
  //             <div className={styles.card1b2}>MAILING LIST</div>
  //           </div>
  //           <div className={"flex " + styles.card1b1}>
  //             <svg
  //               width="28"
  //               height="28"
  //               viewBox="0 0 28 28"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <rect width="14" height="14" fill="#D6FFF5" />
  //               <rect x="14" y="14" width="14" height="14" fill="#D6FFF5" />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 0 28)"
  //                 fill="#D6FFF5"
  //               />
  //               <rect
  //                 opacity="0.2"
  //                 width="14"
  //                 height="14"
  //                 transform="matrix(1 0 0 -1 14 14)"
  //                 fill="#D6FFF5"
  //               />
  //             </svg>
  //             <div className={styles.card1b2}>CONTACT EMAIL</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div className={" " + styles.content1}>
  //       52°North works on innovative ideas and
  //     </div>
  //     <div className={" " + styles.content1}>
  //       technologies in geoinformatics
  //     </div>
  //     <div className={" " + styles.content2}>
  //       52°North is an international research and development non-profit company
  //       with partners from academia, the public sector and industry. Our goal is
  //       to foster innovation in the field of geoinformatics through a
  //       collaborative software development process. Our focus is Spatial
  //       Information Research and addresses sensor web technologies, the web of
  //       things, linked open data, spatial data infrastructures, citizen science,
  //       earth observation, and standardization. Some of our software projects
  //       are enviroCar, 52°North SOS, 52°North JavaScript Sensor Web Client,
  //       ILWIS, and 52°North WPS.
  //     </div>
  //     <div className={" " + styles.content3}>
  //       Check out our GitHub organization and our Open Hub page to learn more
  //       about the wide range of software we work on: from mobile apps to
  //       standardized web services, from cutting edge research to established
  //       products. 52°North open source projects are used in a broad range of
  //       domains (e.g. oceanology, air quality, hydrology, traffic planning) and
  //       operational as well as research projects (e.g. European Horizon 2020 or
  //       National projects: see our references page). All of the 52°North
  //       software is published under an OSI approved open source license.
  //       52°North GmbH, which is the legal body, acts as a non-profit
  //       organization. This means that the shareholders of 52°North do not
  //       receive profit shares or payments from company funds. Instead, the
  //       profits earned by 52°North are completely re-invested into the
  //       innovation, research and software development process.
  //     </div>
  //     <div className={" " + styles.content4}>Projects</div>
  //     <div className={styles.cardContainer2}>
  //       <div className={" " + styles.card2}>
  //         <div className="flex">
  //           <div className="avatar flex-none items-center">
  //             <div className={"rounded-full " + styles.projectLogo}>
  //               <img src={"/season-of-blockchains/projectlogo.png"} />
  //             </div>
  //           </div>
  //           <div className={styles.projectTitle}>StianSandsgaard</div>
  //           <div className={styles.projectTime}>3 DAYS AGO</div>
  //         </div>
  //         <div className={styles.content5}>
  //           Adjusting the Composition to Fit the Frame.
  //         </div>
  //         <div className={styles.content6}>
  //           I want to apply a framework to the framework and enable it to
  //           perform better with just an additional functional feature...
  //         </div>
  //         <div className={"flex " + styles.card2a}>
  //           <svg
  //             width="24"
  //             height="24"
  //             viewBox="0 0 24 24"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <rect
  //               x="4"
  //               y="6"
  //               width="16"
  //               height="9"
  //               stroke="#ADBECB"
  //               strokeWidth="2"
  //             />
  //             <rect x="7" y="18" width="10" height="2" fill="#ADBECB" />
  //           </svg>
  //           <div className={styles.content7}>
  //             Flutter-Responsive-Admin-Panel-Or-Dashboard
  //           </div>
  //           <div className={"ml-auto " + styles.arrow1}>
  //             <svg
  //               width="20"
  //               height="12"
  //               viewBox="0 0 20 12"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M0 6H18.5M18.5 6L13.5 1M18.5 6L13.5 11"
  //                 stroke="#66CE67"
  //                 strokeWidth="2"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //         <div className={styles.hr1}></div>
  //         <div className={"flex " + styles.card2b}>
  //           <div className={styles.votes}>205 votes</div>
  //           <div className={styles.Arrow}>
  //             <svg
  //               width="10"
  //               height="10"
  //               viewBox="0 0 10 10"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M1 8.5L8.5 1M8.5 1H3.5M8.5 1V6.5"
  //                 stroke="#29B7E4"
  //                 strokeWidth="2"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </div>
  //           <div
  //             className={
  //               "link link-primary modal-button no-underline " + styles.content8
  //             }
  //           >
  //             read proposal
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className={styles.cardContainer2}>
  //       <div className={" " + styles.card2}>
  //         <div className="flex">
  //           <div className="avatar flex-none items-center">
  //             <div className={"rounded-full " + styles.projectLogo}>
  //               <img src={"/season-of-blockchains/projectlogo.png"} />
  //             </div>
  //           </div>
  //           <div className={styles.projectTitle}>StianSandsgaard</div>
  //           <div className={styles.projectTime}>3 DAYS AGO</div>
  //         </div>
  //         <div className={styles.content5}>
  //           Adjusting the Composition to Fit the Frame.
  //         </div>
  //         <div className={styles.content6}>
  //           I want to apply a framework to the framework and enable it to
  //           perform better with just an additional functional feature...
  //         </div>
  //         <div className={"flex " + styles.card2a}>
  //           <svg
  //             width="24"
  //             height="24"
  //             viewBox="0 0 24 24"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <rect
  //               x="4"
  //               y="6"
  //               width="16"
  //               height="9"
  //               stroke="#ADBECB"
  //               strokeWidth="2"
  //             />
  //             <rect x="7" y="18" width="10" height="2" fill="#ADBECB" />
  //           </svg>
  //           <div className={styles.content7}>
  //             Flutter-Responsive-Admin-Panel-Or-Dashboard
  //           </div>
  //           <div className={"ml-auto " + styles.arrow1}>
  //             <svg
  //               width="20"
  //               height="12"
  //               viewBox="0 0 20 12"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M0 6H18.5M18.5 6L13.5 1M18.5 6L13.5 11"
  //                 stroke="#66CE67"
  //                 strokeWidth="2"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //         <div className={styles.hr1}></div>
  //         <div className={"flex " + styles.card2b}>
  //           <div className={styles.votes}>205 votes</div>
  //           <div className={styles.Arrow}>
  //             <svg
  //               width="10"
  //               height="10"
  //               viewBox="0 0 10 10"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M1 8.5L8.5 1M8.5 1H3.5M8.5 1V6.5"
  //                 stroke="#29B7E4"
  //                 strokeWidth="2"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </div>
  //           <div
  //             className={
  //               "link link-primary modal-button no-underline " + styles.content8
  //             }
  //           >
  //             read proposal
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <svg
  //       className={styles.blob1}
  //       width="585"
  //       height="1210"
  //       viewBox="0 0 585 1210"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <g filter="url(#filter0_f_1056_1216)">
  //         <path
  //           d="M122.309 1405.35C-38.3875 948.188 279.198 837.929 155.758 624.126C32.3186 410.322 -241.071 337.068 -454.874 460.507C-668.678 583.947 -741.932 857.336 -618.493 1071.14C-495.053 1284.94 355.811 1911.88 122.309 1405.35Z"
  //           fill="url(#paint0_radial_1056_1216)"
  //         />
  //       </g>
  //       <defs>
  //         <filter
  //           id="filter0_f_1056_1216"
  //           x="-1078.46"
  //           y="0.543945"
  //           width="1663.45"
  //           height="1997.7"
  //           filterUnits="userSpaceOnUse"
  //           colorInterpolationFilters="sRGB"
  //         >
  //           <feFlood floodOpacity="0" result="BackgroundImageFix" />
  //           <feBlend
  //             mode="normal"
  //             in="SourceGraphic"
  //             in2="BackgroundImageFix"
  //             result="shape"
  //           />
  //           <feGaussianBlur
  //             stdDeviation="200"
  //             result="effect1_foregroundBlur_1056_1216"
  //           />
  //         </filter>
  //         <radialGradient
  //           id="paint0_radial_1056_1216"
  //           cx="0"
  //           cy="0"
  //           r="1"
  //           gradientUnits="userSpaceOnUse"
  //           gradientTransform="translate(-231.367 847.633) rotate(-30) scale(447.014)"
  //         >
  //           <stop offset="0.442708" stopColor="#992D81" />
  //           <stop offset="1" stopColor="#6029DB" />
  //         </radialGradient>
  //       </defs>
  //     </svg>
  //     <svg
  //       className={styles.blob2}
  //       width="530"
  //       height="1574"
  //       viewBox="0 0 530 1574"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <g filter="url(#filter0_f_1056_1214)">
  //         <path
  //           d="M462.995 593.807C623.691 1050.97 306.106 1161.22 429.546 1375.03C552.985 1588.83 826.375 1662.09 1040.18 1538.65C1253.98 1415.21 1327.24 1141.82 1203.8 928.014C1080.36 714.21 229.492 87.2769 462.995 593.807Z"
  //           fill="url(#paint0_radial_1056_1214)"
  //         />
  //       </g>
  //       <defs>
  //         <filter
  //           id="filter0_f_1056_1214"
  //           x="0.311768"
  //           y="0.909912"
  //           width="1663.45"
  //           height="1997.7"
  //           filterUnits="userSpaceOnUse"
  //           colorInterpolationFilters="sRGB"
  //         >
  //           <feFlood floodOpacity="0" result="BackgroundImageFix" />
  //           <feBlend
  //             mode="normal"
  //             in="SourceGraphic"
  //             in2="BackgroundImageFix"
  //             result="shape"
  //           />
  //           <feGaussianBlur
  //             stdDeviation="200"
  //             result="effect1_foregroundBlur_1056_1214"
  //           />
  //         </filter>
  //         <radialGradient
  //           id="paint0_radial_1056_1214"
  //           cx="0"
  //           cy="0"
  //           r="1"
  //           gradientUnits="userSpaceOnUse"
  //           gradientTransform="translate(816.671 1151.52) rotate(150) scale(447.014)"
  //         >
  //           <stop offset="0.442708" stopColor="#992D81" />
  //           <stop offset="1" stopColor="#6029DB" />
  //         </radialGradient>
  //       </defs>
  //     </svg>
  //     <footer className={styles.footer}>
  //       <div className={styles.footerLogo}></div>
  //       <div className={styles.footerLinks}>
  //         {/* <a href="#">About Us</a> */}

  //         <a href="https://gitopia.com/whitepaper.pdf">Whitepaper</a>

  //         <a
  //           href="https://twitter.com/gitopiaOrg"
  //           target="_blank"
  //           rel="noreferrer"
  //         >
  //           Twitter
  //         </a>

  //         <a href="https://t.me/Gitopia" target="_blank" rel="noreferrer">
  //           Telegram
  //         </a>

  //         <a href="https://medium.com/gitopia" target="_blank" rel="noreferrer">
  //           Medium
  //         </a>

  //         <a
  //           href="https://discord.gg/mVpQVW3vKE"
  //           target="_blank"
  //           rel="noreferrer"
  //         >
  //           Discord
  //         </a>
  //       </div>
  //       <div>
  //         <button
  //           onClick={() => {
  //             if (window) {
  //               window.open("https://t.me/Gitopia");
  //             }
  //           }}
  //           type="button"
  //           className="px-16 lg:px-28 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
  //         >
  //           Contact us
  //         </button>
  //       </div>
  //     </footer>
  //   </div>
  // );
}
