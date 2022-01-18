import Head from "next/head";
import styles from "../styles/season-of-blockchains.module.css";
import Link from "next/link";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
export default function SeasonOfBlockchains() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Season of Blockchains</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerLogo}></div>
        <div
          className={
            "lg:flex flex-grow items-center justify-end " + styles.headerMenu
          }
        >
          <div className={styles.row}>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto w-full">
              <li>
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
              <li>
                <Link href="/home">
                  <a className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70">
                    Try Testnet
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="flex flex-col h-screen">
        <div className="justify-center items-center">
          <div className="font-bold text-5xl text-center mx-96">Season of</div>
          <div className="font-bold text-5xl text-center mx-96">
            Blockchains is here!
          </div>
          <div className="mt-5 text-center mx-96">
            A 3-month long program for developers to work closely
          </div>
          <div className="text-center mx-96">
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
          <div className="font-bold text-5xl text-left mx-96 mt-24 text-left">
            Benefits for the
          </div>
          <div className="font-bold text-5xl text-left mx-96 text-left">
            participants
          </div>
          <div className="">
            <div className="mt-16 mx-96 card lg:card-side h-20 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/exposure.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">Exposure:</div>
                <div className="text-xs">
                  Get a chance to work with the top developers in the industry
                  and get to learn the hottest thing in blockchain technology
                  firsthand
                </div>
              </div>
            </div>

            <div className="mx-96 card lg:card-side h-24 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/cool-stipend.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">
                  Cool stipend:
                </div>
                <div className="text-xs">
                  With Gitopia Season of blockchain, your contributions to the
                  technology would never be free. You will also receive a fixed
                  stipend of $5000 for completing the entire program
                </div>
              </div>
            </div>
            <div className="mx-96 card lg:card-side h-20 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/bragging-rights.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">
                  Bragging rights:
                </div>
                <div className="text-xs">
                  Work with top blockchain projects people follow and brag about
                  it on your social profiles to build a reputation
                </div>
              </div>
            </div>
            <div className="mx-96 card lg:card-side h-16">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/community.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">Community:</div>
                <div className="text-xs">
                  Helps you in networking and gaining contacts in the industry
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center mt-10">
            <img width={700} src="/season-of-blockchains/home-2.svg"></img>
          </div>
          <div className="">
            <div className="mt-5 mx-96 card lg:card-side h-20 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/hiring-pool.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">
                  Access to open hiring pool:
                </div>
                <div className="text-xs">
                  We will also share the entire batch who are interested in
                  getting interviewed by other projects present in the program
                  if no other offer was already offered to the participant.
                </div>
              </div>
            </div>

            <div className="mx-96 card lg:card-side h-24 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/entrepreneurship.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">
                  Entrepreneurship:
                </div>
                <div className="text-xs">
                  Get to know a lot more about blockchain and projects. This
                  would help you in starting one of your own. Maybe funded by
                  the project you worked for.
                </div>
              </div>
            </div>
            <div className="mx-96 card lg:card-side h-20 mb-5">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/grants.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">Grants:</div>
                <div className="text-xs">
                  You can get a grant to continue working on the project you
                  submitted and also hire individuals to work alongside you.
                </div>
              </div>
            </div>
            <div className="mx-96 card lg:card-side h-20">
              <div className="mt-1 ml-1">
                <figure className="h-5 w-5">
                  <img src="/season-of-blockchains/learning-experience.svg" />
                </figure>
              </div>
              <div className="card-body py-0">
                <div className="card-title font-normal text-lg">
                  Provide immersive learning experience:
                </div>
                <div className="text-xs">
                  Long term mentorship such as 3 months can help in immersive
                  learning experience and would help in providing long term
                  benefits to the contributor
                </div>
              </div>
            </div>
          </div>
          <div className="font-bold text-5xl text-center mx-96 mt-24">
            How does it work?
          </div>
          <div className="flex items-center justify-center">
            <div className="ml-48 mt-10 w-1/3">
              <img src="/season-of-blockchains/home-3.png"></img>
            </div>
            <div className="w-1/2 mt-5 ml-12">
              <div>
                <div className="text-xs">
                  <div className="flex">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">1</div>
                    </div>
                    <div className="text-base">
                      Go to the organization page on Gitopia
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">2</div>
                    </div>
                    <div className="text-base">
                      See the list of ideas you can contribute
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">3</div>
                    </div>
                    <div className="text-base">
                      Your proposal would be evaluated by the mentors
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">4</div>
                    </div>
                    <div className="text-base">
                      Mentor will be assigned to you to begin the project
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">5</div>
                    </div>
                    <div className="text-base">
                      Participate and submit a timely evaluation
                    </div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">6</div>
                    </div>
                    <div className="text-base">Get stipend</div>
                  </div>
                  <div className="flex mt-6">
                    <div class="border border-white rounded-full w-6 h-6 pl-2 pt-0.5 mr-4">
                      <div class="">7</div>
                    </div>
                    <div className="text-base">
                      Get open access to the hiring pool from the partners
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"flex items-center justify-center mt-24"}>
            <div className={"card lg:card-side"}>
              <div className={"mt-1 h-24 w-24"}>
                <figure>
                  <img src="/logo-g.svg" />
                </figure>
              </div>
              <div className={"card-body mt-2 px-0 py-0"}>
                <div className="card-title text-3xl">Join the gitopia</div>
                <div className="card-title text-3xl">community</div>
              </div>
            </div>
            <div className={"card lg:card-side ml-5 mt-5"}>
              <div className={"card-body py-0"}>
                <div className="">
                  Check out ideas that you can get started on
                </div>
                <div className="text-base">
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
                    className="px-16 lg:px-20 lg:py-3 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
          <svg
            className={styles.blob1}
            width="916"
            height="1040"
            viewBox="0 0 2034.73 1693.61"
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
            width="1663.45"
            height="1170"
            viewBox="600 -300 1663.45 1997.7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_1056_1216)">
              <path
                d="M122.309 1405.35C-38.3874 948.188 279.198 837.929 155.758 624.126C32.3186 410.322 -241.071 337.068 -454.874 460.507C-668.678 583.947 -741.932 857.336 -618.493 1071.14C-495.053 1284.94 355.811 1911.88 122.309 1405.35Z"
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
            width="500"
            height="500"
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
            width="400"
            height="400"
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
            width="1000"
            height="1500"
            viewBox="-1200 0 1663.45 1997.7"
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
            width="1663.45"
            height="1620"
            viewBox="-1400 -400 1663.45 1997.7"
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
                Contact Us
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
