import Head from "next/head";
import styles from "../../styles/season-of-blockchains/homepage.module.css";
import Link from "next/link";
import { useState } from "react";
export default function SeasonOfBlockchains() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Season of Blockchains</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header className={(menuOpen ? "bg-purple " : "") + styles.header}>
        <div className={styles.headerLogo}></div>
        <div className={styles.headerMenuIcon}>
          <button
            className={
              "text-white cursor-pointer text-xl leading-none px-2 py-2 border-transparent rounded block outline-none focus:outline-none " +
              (menuOpen ? "hidden" : "")
            }
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 92 92"
              width={24}
              height={24}
            >
              <path
                d="M78,23.5H14c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5h64c3.6,0,6.5,2.9,6.5,6.5S81.6,23.5,78,23.5z M84.5,46
	c0-3.6-2.9-6.5-6.5-6.5H14c-3.6,0-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5h64C81.6,52.5,84.5,49.6,84.5,46z M84.5,75c0-3.6-2.9-6.5-6.5-6.5
	H14c-3.6,0-6.5,2.9-6.5,6.5s2.9,6.5,6.5,6.5h64C81.6,81.5,84.5,78.6,84.5,75z"
              />
            </svg>
          </button>
          <button
            className={
              "text-white cursor-pointer text-xl leading-none px-2 py-2 border-transparent rounded block outline-none focus:outline-none " +
              (menuOpen ? "" : "hidden")
            }
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              viewBox="0 0 92 92"
            >
              <path
                d="M70.7,64.3c1.8,1.8,1.8,4.6,0,6.4c-0.9,0.9-2,1.3-3.2,1.3c-1.2,0-2.3-0.4-3.2-1.3L46,52.4L27.7,70.7
         c-0.9,0.9-2,1.3-3.2,1.3s-2.3-0.4-3.2-1.3c-1.8-1.8-1.8-4.6,0-6.4L39.6,46L21.3,27.7c-1.8-1.8-1.8-4.6,0-6.4c1.8-1.8,4.6-1.8,6.4,0
         L46,39.6l18.3-18.3c1.8-1.8,4.6-1.8,6.4,0c1.8,1.8,1.8,4.6,0,6.4L52.4,46L70.7,64.3z"
              />
            </svg>
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center justify-end " +
            (menuOpen
              ? " flex justify-center absolute left-0 right-0 bg-purple pt-4 pb-4 z-10 shadow-2xl "
              : " hidden ") +
            styles.headerMenu
          }
        >
          <div className={styles.row}>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto w-full">
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="https://gitopia.com/whitepaper.pdf"
                  target="_blank"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="https://medium.com/gitopia"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="/home"
                  target="_blank"
                >
                  Try Testnet
                </a>
              </li>
              {/* <li className="border-b-2 lg:border-r-2 lg:border-b-0 border-white border-opacity-10 w-full h-2 mb-4 lg:h-6 lg:w-1 lg:mr-4 lg:mb-0 mt-2"></li> */}
            </ul>
          </div>
        </div>
        <div className={styles.headerLine}></div>
      </header>
      <div className="flex flex-col h-screen">
        <div className="justify-center items-center">
          <div className={" " + styles.title}>Season of</div>
          <div className={" " + styles.title2}>Blockchains is here!</div>
          <div className={"mt-5 " + styles.content}>
            A 3-month long program for developers to work closely
          </div>
          <div className={" " + styles.content}>
            with experienced mentors from the project you like.
          </div>
          <div className="relative flex items-center justify-center mt-5">
            <img width={600} src="/season-of-blockchains/home-1.svg"></img>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                if (window) {
                  window.open("/home");
                }
              }}
              type="button"
              className="btn-sm px-16 lg:px-20 py-1.5 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Join Gitopia
            </button>
          </div>
          <div className={" " + styles.title3}>Benefits for the</div>
          <div className={" " + styles.title4}>participants</div>
          <div className="">
            <div className={"card lg:card-side mt-16 " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/exposure.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Exposure:
                </div>
                <div className={"  " + styles.cardBody}>
                  Get a chance to work with the top developers in the industry
                  and get to learn the hottest thing in blockchain technology
                  firsthand
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/cool-stipend.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Cool stipend:
                </div>
                <div className={"  " + styles.cardBody}>
                  With Gitopia Season of blockchain, your contributions to the
                  technology would never be free. You will also receive a fixed
                  stipend of $5000 for completing the entire program
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/bragging-rights.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Bragging rights:
                </div>
                <div className={"  " + styles.cardBody}>
                  Work with top blockchain projects people follow and brag about
                  it on your social profiles to build a reputation
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/community.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Community:
                </div>
                <div className={"  " + styles.cardBody}>
                  Helps you in networking and gaining contacts in the industry
                </div>
              </div>
            </div>
          </div>
          <div className={" " + styles.image2}>
            <img width={700} src="/season-of-blockchains/home-2.svg"></img>
          </div>
          <div className="mb-36">
            <div className={"card lg:card-side mt-3 " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/hiring-pool.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Access to open hiring pool:
                </div>
                <div className={"  " + styles.cardBody}>
                  We will also share the entire batch who are interested in
                  getting interviewed by other projects present in the program
                  if no other offer was already offered to the participant.
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className="mt-1 ml-1">
                <figure className={"mt-1 ml-1" + styles.cardImage}>
                  <img src="/season-of-blockchains/entrepreneurship.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>
                  Entrepreneurship:
                </div>
                <div className={"  " + styles.cardBody}>
                  Get to know a lot more about blockchain and projects. This
                  would help you in starting one of your own. Maybe funded by
                  the project you worked for.
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/grants.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className={"card-title  " + styles.cardTitle}>Grants:</div>
                <div className={"  " + styles.cardBody}>
                  You can get a grant to continue working on the project you
                  submitted and also hire individuals to work alongside you.
                </div>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className={"card lg:card-side " + styles.card}>
              <div className={"mt-1 ml-1" + styles.cardImage}>
                <figure className="">
                  <img src="/season-of-blockchains/learning-experience.svg" />
                </figure>
              </div>
              <div className={"card-body py-0"}>
                <div className={"card-title  " + styles.cardTitle}>
                  Provide immersive learning experience:
                </div>
                <div className={"  " + styles.cardBody}>
                  Long term mentorship such as 3 months can help in immersive
                  learning experience and would help in providing long term
                  benefits to the contributor
                </div>
              </div>
            </div>
          </div>
          <div className={" " + styles.title}>How does it work?</div>
          <div
            className={"flex items-center justify-center " + styles.section3}
          >
            <div className={" " + styles.image3}>
              <img src="/season-of-blockchains/home-3.png"></img>
            </div>
            <div className="w-1/2 ml-12">
              <div>
                <div className="">
                  <div className="flex">
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>1</div>
                    </div>
                    <div className={" " + styles.working}>
                      Go to the organization page on Gitopia
                    </div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div className={styles.number}>2</div>
                    </div>
                    <div className={" " + styles.working}>
                      See the list of ideas you can contribute
                    </div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>3</div>
                    </div>
                    <div className={" " + styles.working}>
                      Your proposal would be evaluated by the mentors
                    </div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>4</div>
                    </div>
                    <div className={" " + styles.working}>
                      Mentor will be assigned to you to begin the project
                    </div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>5</div>
                    </div>
                    <div className={" " + styles.working}>
                      Participate and submit a timely evaluation
                    </div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>6</div>
                    </div>
                    <div className={" " + styles.working}>Get stipend</div>
                  </div>
                  <div className={"flex " + styles.section3a}>
                    <div class={"mr-4 " + styles.circle}>
                      <div class={styles.number}>7</div>
                    </div>
                    <div className={" " + styles.working}>
                      Get open access to the hiring pool from the partners
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={"flex items-center justify-center mt-20 " + styles.cards}
          >
            <div className={"flex"}>
              <div className={"mt-3 " + styles.cardLogo}>
                <img src="/logo-g.svg" />
              </div>
              <div className={"card lg:card-side " + styles.joinGitopia}>
                <div className={"card-body mt-2 px-0 py-0"}>
                  <div className="card-title">Join the gitopia</div>
                  <div className="card-title">community</div>
                </div>
              </div>
            </div>
            <div className={"card lg:card-side ml-5 mt-14"}>
              <div className={"card-body py-0"}>
                <div className={styles.endCard}>
                  Check out ideas that you can get started on
                </div>
                <div className={styles.endCard}>
                  right now through our organization page.
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => {
                      if (window) {
                        window.open("https://t.me/Gitopia");
                      }
                    }}
                    type="button"
                    className={
                      "px-16 lg:px-20 lg:py-1 py-4 rounded text-white bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 " +
                      styles.cardButton
                    }
                  >
                    Contact us
                  </button>
                </div>
              </div>
            </div>
          </div>
          <svg
            className={styles.blob1}
            width="916"
            height="1040"
            viewBox="0 0 916 1040"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1212)">
              <path
                d="M371.033 44.3481C-64.4668 256.849 84.1232 558.409 -153.918 623.874C-391.959 689.339 -638 549.439 -703.465 311.398C-768.93 73.3567 -629.03 -172.684 -390.988 -238.149C-152.947 -303.614 893.033 -152.152 371.033 44.3481Z"
                fill="url(#paint0_radial_1056_1212)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1212"
                x="-1119.58"
                y="-653.617"
                width="2034.73"
                height="1693.61"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_1056_1212"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1212"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-272.453 192.863) rotate(74.6229) scale(447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob2}
            width="585"
            height="1210"
            viewBox="0 0 585 1210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1216)">
              <path
                d="M122.309 1405.35C-38.3875 948.188 279.198 837.929 155.758 624.126C32.3186 410.322 -241.071 337.068 -454.874 460.507C-668.678 583.947 -741.932 857.336 -618.493 1071.14C-495.053 1284.94 355.811 1911.88 122.309 1405.35Z"
                fill="url(#paint0_radial_1056_1216)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1216"
                x="-1078.46"
                y="0.543945"
                width="1663.45"
                height="1997.7"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_1056_1216"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1216"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-231.367 847.633) rotate(-30) scale(447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob3}
            width="746"
            height="746"
            viewBox="0 0 746 746"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1209)">
              <circle
                cx="373"
                cy="373"
                r="187"
                fill="url(#paint0_radial_1056_1209)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1209"
                x="0"
                y="0"
                width="746"
                height="746"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="93"
                  result="effect1_foregroundBlur_1056_1209"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1209"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(317.011 373) rotate(90) scale(187 131.011)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob4}
            width="746"
            height="746"
            viewBox="0 0 746 746"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1208)">
              <circle
                cx="373"
                cy="373"
                r="187"
                fill="url(#paint0_radial_1056_1208)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1208"
                x="0"
                y="0"
                width="746"
                height="746"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="93"
                  result="effect1_foregroundBlur_1056_1208"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1208"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(317.011 373) rotate(90) scale(187 131.011)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob5}
            width="530"
            height="1998"
            viewBox="0 0 530 1998"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1213)">
              <path
                d="M462.995 592.937C623.691 1050.1 306.106 1160.35 429.546 1374.16C552.985 1587.96 826.375 1661.22 1040.18 1537.78C1253.98 1414.34 1327.24 1140.95 1203.8 927.143C1080.36 713.34 229.492 86.4067 462.995 592.937Z"
                fill="url(#paint0_radial_1056_1213)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1213"
                x="0.311768"
                y="0.0397034"
                width="1663.45"
                height="1997.7"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_1056_1213"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1213"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(816.671 1150.65) rotate(150) scale(447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob6}
            width="530"
            height="1574"
            viewBox="0 0 530 1574"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1214)">
              <path
                d="M462.995 593.807C623.691 1050.97 306.106 1161.22 429.546 1375.03C552.985 1588.83 826.375 1662.09 1040.18 1538.65C1253.98 1415.21 1327.24 1141.82 1203.8 928.014C1080.36 714.21 229.492 87.2769 462.995 593.807Z"
                fill="url(#paint0_radial_1056_1214)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1056_1214"
                x="0.311768"
                y="0.909912"
                width="1663.45"
                height="1997.7"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_1056_1214"
                />
              </filter>
              <radialGradient
                id="paint0_radial_1056_1214"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(816.671 1151.52) rotate(150) scale(447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <footer className={styles.footer}>
            <div className={styles.footerLogo}></div>
            <div className={styles.footerLinks}>
              {/* <a href="#">About Us</a> */}

              <a href="https://gitopia.com/whitepaper.pdf">Whitepaper</a>

              <a href="https://twitter.com/gitopiaOrg" target="_blank">
                Twitter
              </a>

              <a href="https://t.me/Gitopia" target="_blank">
                Telegram
              </a>

              <a href="https://medium.com/gitopia" target="_blank">
                Medium
              </a>

              <a href="https://discord.gg/mVpQVW3vKE" target="_blank">
                Discord
              </a>
            </div>
            <div>
              <button
                onClick={() => {
                  if (window) {
                    window.open("https://t.me/Gitopia");
                  }
                }}
                type="button"
                className="px-16 lg:px-28 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Contact us
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
