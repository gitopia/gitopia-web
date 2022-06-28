import Head from "next/head";
import styles from "../../styles/season-of-blockchains/homepage.module.css";
import Link from "next/link";
import { useState } from "react";
export default function SeasonOfBlockchains() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={"overflow-x-hidden " + styles.wrapper}>
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
                  href={"/season-of-blockchains/#applyNow"}
                >
                  Apply Now
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#organisations"}
                >
                  Organisations
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#howItWorks"}
                >
                  How it works
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#contact"}
                >
                  Contact
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#about"}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#faqs"}
                >
                  FAQs
                </a>
              </li>
              <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="/home"
                  target="_blank"
                >
                  Try our Testnet
                </a>
              </li>
              {/* <li className="border-b-2 lg:border-r-2 lg:border-b-0 border-white border-opacity-10 w-full h-2 mb-4 lg:h-6 lg:w-1 lg:mr-4 lg:mb-0 mt-2"></li> */}
            </ul>
          </div>
        </div>
        <div className={styles.headerLine}></div>
      </header>
      <div className="flex flex-col h-screen">
        <div className="justify-center items-center lg:mx-auto lg:max-w-screen-lg py-12 lg:px-4">
          <div className={"sm:flex " + styles.midScreen} id="applyNow">
            <div>
              <div className={" " + styles.title}>Season of</div>
              <div className={" " + styles.title2}>Blockchains is here!</div>
              <div className={"mt-5 " + styles.content}>
                GSOB is the first-ever six-week global blockchain program to
                bring the budding developers together to work on challenging
                projects for the most exciting organisations in the Web3
                space!🚀Know more about the program
              </div>
              <div className={"flex " + styles.topButtons}>
                <button
                  onClick={() => {
                    if (window) {
                      window.open("https://airtable.com/shr5PEUTXvcCRF717");
                    }
                  }}
                  type="button"
                  className={
                    "btn-sm sm:py-1.5 btn-primary rounded " +
                    styles.registerButton
                  }
                >
                  Register for Program
                </button>
              </div>
            </div>
            <div className={styles.midScreenImage}>
              <img src="/season-of-blockchains/home-1.svg"></img>
            </div>
          </div>
          <div className={styles.orgCardWrapper}>
            <div
              id="organisations"
              className={
                "grid grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-5 sm:grid-rows-1 " +
                styles.orgCard
              }
            >
              <div className="">
                <svg
                  width="175"
                  height="47"
                  viewBox="0 0 175 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="175" height="47" rx="8" fill="#2F3C4B" />
                </svg>
              </div>
              <div className="">
                <svg
                  width="175"
                  height="47"
                  viewBox="0 0 175 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="175" height="47" rx="8" fill="#2F3C4B" />
                </svg>
              </div>
              <div className="">
                <svg
                  width="175"
                  height="47"
                  viewBox="0 0 175 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="175" height="47" rx="8" fill="#2F3C4B" />
                </svg>
              </div>
              <div className="">
                <svg
                  width="175"
                  height="47"
                  viewBox="0 0 175 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="175" height="47" rx="8" fill="#2F3C4B" />
                </svg>
              </div>
              <div className="">
                <svg
                  width="175"
                  height="47"
                  viewBox="0 0 175 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="175" height="47" rx="8" fill="#2F3C4B" />
                </svg>
              </div>
            </div>
          </div>
          <div className={"flex " + styles.midScreen}>
            <div className={" " + styles.image2}>
              <img src="/season-of-blockchains/home-2.svg"></img>
            </div>
            <div className="">
              <div className={" " + styles.title3}>Benefits for the</div>
              <div className={" " + styles.title4}>participants</div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/inspire.svg" />
                </div>
                <div className={"card " + styles.card}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Inspire:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Inspiring developers to contribute to open source
                      development in the Web3 space
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/technology.svg" />
                </div>
                <div className={"card " + styles.card}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Technology:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Helping budding Web3 projects to bring in new developers
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/transition.svg" />
                </div>
                <div className={"card " + styles.card}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Transition:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Give exposure to developers
                    </div>
                    <div className={"  " + styles.cardBody}>
                      transitioning into the Web3 space
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/learning.svg" />
                </div>
                <div className={"card  " + styles.card}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Learning:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Providing an immersive learning experience to the
                      participants
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.section3}>
            <div className={styles.section3Content}>
              The entire web experience as we know it is shifting towards a new
              framework. This is your chance to get in early and set the stages
              for what’s to come for the world.
            </div>
            <div className={"flex " + styles.section3End}>
              <div className={styles.section3Name}>Kushagz</div>
              <div className={"mr-4 ml-4 " + styles.vl}></div>
              <div className={styles.section3Designation}>
                Head of Marketing @ Gitopia
              </div>
            </div>
          </div>
          <div className={"flex " + styles.midScreen}>
            <div className={"sm:mb-36 " + styles.section4}>
              <div className={" " + styles.title3}>
                How GSOB will contribute
              </div>
              <div className={" " + styles.title4}>to the Web3 ecosystem</div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/learning.svg" />
                </div>
                <div className={"card mt-3 " + styles.card2}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Learning:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Aquire more skills as you learn both technical and
                      communicational skills.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/exposure.svg" />
                </div>
                <div className={"card " + styles.card2}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Exposure:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Contribute to the best projects from Web3, team up with
                      giants and get exposure.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/coolstipend.svg" />
                </div>
                <div className={"card e " + styles.card2}>
                  <div className="card-body py-0 px-1.5">
                    <div className={"card-title  " + styles.cardTitle}>
                      Cool stipend:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Give exposure to developers transitioning into the Web3
                      space
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className={"mt-1 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/hiring.svg" />
                </div>
                <div className={"card " + styles.card2}>
                  <div className={"card-body py-0 px-1.5"}>
                    <div className={"card-title  " + styles.cardTitle}>
                      Hiring:
                    </div>
                    <div className={"  " + styles.cardBody}>
                      Get access to all participants in the hiring pool to see
                      the best talent.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.midScreenImage}>
              <img src="/season-of-blockchains/home-3.svg"></img>
            </div>
          </div>
          <div className={styles.margin} id="howItWorks">
            <div className={styles.section5}>
              <div className={styles.box}></div>
              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 1</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl2}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5BodyTitle}>
                    Announcing GSOB
                  </div>
                  <div className={styles.section5Content}>
                    User visits the GSOB site Sign up for Gitopia Join discord
                    and Register for GSOB (can be a voluntary step to receive
                    updates regarding GSOB)
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section5}>
              <div className={styles.box}></div>

              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 2</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl2}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5BodyTitle}>
                    Organizations Announced
                  </div>

                  <div className={styles.section5Content}>
                    Users can check ideas of the participating organizations
                    They can interact with the participating organization
                    members to discuss application ideas and flows and get
                    initial insights into the project (This can be done on our
                    discord. We can make a specific category for GSOB on discord
                    and channels will be named after participating orgs)
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section5}>
              <div className={styles.box}></div>
              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 3</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl2}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5BodyTitle}>
                    GSOB Participant applications out
                  </div>
                  <div className={styles.section5Content}>
                    Contributors can share their proposals to the organization
                    that they are willing to participate Accepted participants
                    announced
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section5}>
              <div className={styles.box}></div>
              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 4</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl2}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5BodyTitle}>
                    1 week community bonding period
                  </div>
                  <div className={styles.section5Content}>
                    Selected contributors interact with mentors and
                  </div>
                  <div className={styles.section5Content}>
                    get familiar with the project
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section5}>
              <div className={styles.box}></div>
              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 5</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl2}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5BodyTitle}>Coding period</div>
                  <div className={styles.section5Content}>
                    Day 1-15: Coding Phase 1 followed by initial
                    evaluation/submission
                  </div>
                  <div className={styles.section5Content}>
                    Day 16-30: Coding Phase 2 followed by a mid
                    evaluation/submission
                  </div>
                  <div className={styles.section5Content}>
                    Day 31-45: Coding phase 3 followed by a final
                    evaluation/submission
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className={styles.vlMinor}></div>
            </div>
            <div className={styles.section5}>
              <div className={styles.box}></div>
              <div
                className={
                  "flex flex-row items-center justify-center absolute lg:w-full top-0"
                }
              >
                <div className={styles.section5Title}>PHASE 6</div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className={styles.vlCircle}></div>
                  <hr className={styles.vl3}></hr>
                </div>
                <div className={styles.section5Body}>
                  <div className={styles.section5Content}>What’s next?</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.endHeadline} id="about">
            What OGs have to say about GSOB?
          </div>
          <div className="flex flex-row items-center justify-center">
            <div className={styles.endCircle}>
              <svg
                width="20"
                height="17"
                viewBox="0 0 20 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.endCircleImage}
              >
                <path
                  d="M0.984204 16.8135C0.328068 13.9156 0 11.4004 0 9.26792C0 6.20596 0.710814 3.90948 2.13244 2.37849C3.55407 0.79283 5.63183 0 8.36573 0V3.28068C6.9441 3.28068 5.90522 3.66343 5.24909 4.42892C4.64763 5.19441 4.3469 6.34265 4.3469 7.87363V9.76002H8.44775V16.8135H0.984204ZM12.0565 16.8135C11.4004 13.9156 11.0723 11.4004 11.0723 9.26792C11.0723 6.20596 11.7831 3.90948 13.2047 2.37849C14.6264 0.79283 16.7041 0 19.438 0V3.28068C18.0164 3.28068 16.9775 3.66343 16.3214 4.42892C15.7199 5.19441 15.4192 6.34265 15.4192 7.87363V9.76002H19.52V16.8135H12.0565Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center text-center">
            <div className={styles.endQuote}>
              “Testimonials in auto float format, some from the participating
              organisation founders and some from Web3 influencers!”
            </div>
          </div>
          <div className="flex flex-row items-center justify-center text-center">
            <div className={"flex " + styles.endQuoteContent}>
              <div className={styles.endQuoteName}>Alex Doe</div>
              <div className={" " + styles.vl}></div>
              <div className={styles.endQuoteDesig}>CryptoWallet</div>
            </div>
          </div>
          <div
            className="flex flex-col lg:flex-row items-center justify-center text-center"
            id="contact"
          >
            <a
              className={styles.linksBoxContainer}
              href="https://t.me/Gitopia"
              target="_blank"
            >
              <div className={"flex " + styles.linksBox}>
                <div>
                  <svg
                    width="35"
                    height="41"
                    viewBox="0 0 35 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8798 16.7939C12.7398 16.7939 11.8398 17.7948 11.8398 19.0158C11.8398 20.2368 12.7598 21.2376 13.8798 21.2376C15.0198 21.2376 15.9198 20.2368 15.9198 19.0158C15.9398 17.7948 15.0198 16.7939 13.8798 16.7939ZM21.1798 16.7939C20.0398 16.7939 19.1398 17.7948 19.1398 19.0158C19.1398 20.2368 20.0598 21.2376 21.1798 21.2376C22.3198 21.2376 23.2198 20.2368 23.2198 19.0158C23.2198 17.7948 22.3198 16.7939 21.1798 16.7939Z"
                      fill="white"
                    />
                    <path
                      d="M30.9 0H4.1C1.84 0 0 1.8415 0 4.12337V31.1855C0 33.4673 1.84 35.3088 4.1 35.3088H26.78L25.72 31.6058L28.28 33.9878L30.7 36.2296L35 40.0327V4.12337C35 1.8415 33.16 0 30.9 0ZM23.18 26.1413C23.18 26.1413 22.46 25.2806 21.86 24.52C24.48 23.7794 25.48 22.1381 25.48 22.1381C24.66 22.6785 23.88 23.0588 23.18 23.319C22.18 23.7394 21.22 24.0196 20.28 24.1797C18.36 24.54 16.6 24.44 15.1 24.1597C13.96 23.9395 12.98 23.6193 12.16 23.299C11.7 23.1189 11.2 22.8987 10.7 22.6185C10.64 22.5784 10.58 22.5584 10.52 22.5184C10.48 22.4984 10.46 22.4784 10.44 22.4583C10.08 22.2582 9.88 22.1181 9.88 22.1181C9.88 22.1181 10.84 23.7194 13.38 24.48C12.78 25.2406 12.04 26.1413 12.04 26.1413C7.62 26.0012 5.94 23.0989 5.94 23.0989C5.94 16.6536 8.82 11.4293 8.82 11.4293C11.7 9.26757 14.44 9.32762 14.44 9.32762L14.64 9.56781C11.04 10.6087 9.38 12.19 9.38 12.19C9.38 12.19 9.82 11.9498 10.56 11.6095C12.7 10.6687 14.4 10.4085 15.1 10.3484C15.22 10.3284 15.32 10.3084 15.44 10.3084C16.66 10.1483 18.04 10.1083 19.48 10.2684C21.38 10.4886 23.42 11.049 25.5 12.19C25.5 12.19 23.92 10.6887 20.52 9.64788L20.8 9.32762C20.8 9.32762 23.54 9.26757 26.42 11.4293C26.42 11.4293 29.3 16.6536 29.3 23.0989C29.3 23.0989 27.6 26.0012 23.18 26.1413Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className={styles.links}>Join Discord</div>
              </div>
            </a>
            <a
              className={"flex" + styles.linksBoxContainer}
              href="https://t.me/Gitopia"
              target="_blank"
            >
              <div className={"flex " + styles.linksBox}>
                <div>
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <rect
                      width="39"
                      height="39"
                      rx="19.5"
                      fill="url(#pattern0)"
                    />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlinkHref="#image0_2447_7018"
                          transform="scale(0.0025)"
                        />
                      </pattern>
                      <image
                        id="image0_2447_7018"
                        width="400"
                        height="400"
                        xlinkHref="data:image/jpeg;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <div className={styles.links}>Join Telegram</div>
              </div>
            </a>
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
            width="597"
            height="2077"
            viewBox="0 0 597 2077"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2438_4571)">
              <path
                d="M820.148 569.385C730.736 1045.64 400.57 982.338 400.57 1229.22C400.57 1476.1 600.705 1676.23 847.584 1676.23C1094.46 1676.23 1294.6 1476.1 1294.6 1229.22C1294.6 982.338 871.194 13.9658 820.148 569.385Z"
                fill="url(#paint0_radial_2438_4571)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2438_4571"
                x="0.569824"
                y="0.125977"
                width="1694.03"
                height="2076.11"
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
                  result="effect1_foregroundBlur_2438_4571"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2438_4571"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(847.584 1229.22) rotate(180) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className={styles.blob3}
            width="597"
            height="2077"
            viewBox="0 0 597 2077"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2438_4571)">
              <path
                d="M820.148 569.385C730.736 1045.64 400.57 982.338 400.57 1229.22C400.57 1476.1 600.705 1676.23 847.584 1676.23C1094.46 1676.23 1294.6 1476.1 1294.6 1229.22C1294.6 982.338 871.194 13.9658 820.148 569.385Z"
                fill="url(#paint0_radial_2438_4571)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2438_4571"
                x="0.569824"
                y="0.125977"
                width="1694.03"
                height="2076.11"
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
                  result="effect1_foregroundBlur_2438_4571"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2438_4571"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(847.584 1229.22) rotate(180) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob4}
            width="530"
            height="1999"
            viewBox="0 0 530 1999"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2438_4572)">
              <path
                d="M462.995 593.809C623.691 1050.97 306.106 1161.23 429.546 1375.03C552.985 1588.83 826.375 1662.09 1040.18 1538.65C1253.98 1415.21 1327.24 1141.82 1203.8 928.015C1080.36 714.212 229.492 87.2784 462.995 593.809Z"
                fill="url(#paint0_radial_2438_4572)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2438_4572"
                x="0.311523"
                y="0.911133"
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
                  result="effect1_foregroundBlur_2438_4572"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2438_4572"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(816.671 1151.52) rotate(150) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob5}
            width="584"
            height="1449"
            viewBox="0 0 584 1449"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2447_7021)">
              <path
                d="M1506.85 874.45C1030.59 963.862 1093.89 1294.03 847.014 1294.03C600.135 1294.03 400 1093.89 400 847.014C400 600.135 600.135 400 847.014 400C1093.89 400 2062.27 823.404 1506.85 874.45Z"
                fill="url(#paint0_radial_2447_7021)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2447_7021"
                x="0"
                y="0"
                width="2076.11"
                height="1694.03"
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
                  result="effect1_foregroundBlur_2447_7021"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2447_7021"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(847.014 847.014) rotate(90) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob6}
            width="858"
            height="1449"
            viewBox="0 0 858 1449"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2447_6936)">
              <path
                d="M287.846 819.578C-188.412 730.166 -125.107 400 -371.986 400C-618.865 400 -819 600.135 -819 847.014C-819 1093.89 -618.865 1294.03 -371.986 1294.03C-125.107 1294.03 843.266 870.624 287.846 819.578Z"
                fill="url(#paint0_radial_2447_6936)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2447_6936"
                x="-1219"
                y="0"
                width="2076.11"
                height="1694.03"
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
                  result="effect1_foregroundBlur_2447_6936"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2447_6936"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-371.986 847.014) rotate(-90) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stop-color="#992D81" />
                <stop offset="1" stop-color="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            className={styles.blob7}
            width="1597"
            height="981"
            viewBox="0 0 1597 981"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.2">
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
                fill="url(#paint0_linear_1217_1539)"
              />
              <mask
                id="mask0_1217_1539"
                style={{ "mask-type": "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="42"
                width="1599"
                height="941"
              >
                <path
                  opacity="0.3"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
                  fill="url(#paint1_linear_1217_1539)"
                />
              </mask>
              <g mask="url(#mask0_1217_1539)">
                <g filter="url(#filter0_f_1217_1539)">
                  <circle
                    cx="1500.79"
                    cy="885.888"
                    r="193.34"
                    transform="rotate(90 1500.79 885.888)"
                    fill="#8C49E1"
                  />
                </g>
                <g filter="url(#filter1_f_1217_1539)">
                  <circle
                    cx="1110.5"
                    cy="337.971"
                    r="193.34"
                    transform="rotate(90 1110.5 337.971)"
                    fill="#2EDDE9"
                  />
                </g>
              </g>
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
                fill="url(#paint2_linear_1217_1539)"
              />
              <mask
                id="mask1_1217_1539"
                style={{ "mask-type": "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="42"
                width="1599"
                height="941"
              >
                <path
                  opacity="0.3"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
                  fill="url(#paint3_linear_1217_1539)"
                />
              </mask>
              <g mask="url(#mask1_1217_1539)">
                <g filter="url(#filter2_f_1217_1539)">
                  <circle
                    cx="321.504"
                    cy="727.836"
                    r="193.34"
                    transform="rotate(90 321.504 727.836)"
                    fill="#49B4E1"
                  />
                </g>
              </g>
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1164.03 332.676C1140.42 389.666 1128.27 450.748 1128.27 512.434L1128.3 512.434C1128.28 555.561 1119.77 598.263 1103.27 638.107C1086.74 678.001 1062.52 714.248 1031.99 744.781C1001.46 775.314 965.211 799.534 925.318 816.058C885.425 832.582 842.669 841.087 799.49 841.087C756.31 841.087 713.553 832.582 673.66 816.058C633.767 799.534 597.519 775.314 566.986 744.781C536.453 714.248 512.233 678 495.709 638.107C479.185 598.214 470.68 555.457 470.68 512.277L470.64 512.277C470.64 450.591 458.49 389.51 434.884 332.52C411.278 275.529 376.678 223.747 333.06 180.129C289.441 136.51 237.659 101.91 180.669 78.3041C123.679 54.698 62.5968 42.5481 0.911174 42.5481L0.911168 183.467C44.0911 183.467 86.8482 191.972 126.741 208.496C166.634 225.02 202.882 249.24 233.415 279.773C263.948 310.306 288.168 346.554 304.692 386.447C321.216 426.34 329.721 469.097 329.721 512.277L329.761 512.277C329.761 573.963 341.911 635.044 365.517 692.035C389.123 749.025 423.723 800.807 467.342 844.426C510.96 888.044 562.743 922.644 619.733 946.25C676.722 969.856 737.803 982.006 799.487 982.006L1233.46 692.035C1257.07 635.045 1269.22 573.963 1269.22 512.277L1269.19 512.277C1269.21 469.15 1277.72 426.448 1294.22 386.604C1310.75 346.71 1334.97 310.463 1365.5 279.93C1396.03 249.397 1432.28 225.177 1472.17 208.653C1512.06 192.128 1554.82 183.624 1598 183.624L1598 42.7048C1536.32 42.7048 1475.23 54.8547 1418.24 78.4608C1361.25 102.067 1309.47 136.667 1265.85 180.285C1222.24 223.904 1187.64 275.686 1164.03 332.676Z"
                fill="url(#paint4_linear_1217_1539)"
              />
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M434.887 290.374C458.493 347.364 470.643 408.446 470.643 470.131L470.617 470.131C470.638 513.258 479.142 555.96 495.646 595.805C512.17 635.698 536.39 671.946 566.923 702.479C597.456 733.011 633.704 757.231 673.597 773.756C713.49 790.28 756.247 798.785 799.427 798.785C842.606 798.784 885.362 790.28 925.254 773.756C965.147 757.232 1001.39 733.012 1031.93 702.479C1062.46 671.946 1086.68 635.698 1103.2 595.805C1119.73 555.912 1128.23 513.155 1128.23 469.975L1269.15 469.975C1269.15 531.66 1257 592.742 1233.4 649.732C1209.79 706.722 1175.19 758.505 1131.57 802.123C1087.95 845.742 1036.17 880.342 979.181 903.948C922.191 927.554 861.11 939.704 799.424 939.704L799.424 939.704C737.739 939.703 676.659 927.553 619.67 903.948C562.68 880.341 510.897 845.741 467.279 802.123C423.66 758.505 389.06 706.722 365.454 649.732C341.848 592.742 329.698 531.66 329.698 469.975L329.724 469.975C329.704 426.848 321.199 384.146 304.695 344.301C288.171 304.408 263.951 268.16 233.418 237.627C202.885 207.095 166.637 182.875 126.744 166.35C86.8512 149.826 44.0941 141.321 0.914122 141.321L0.914104 0.402405C62.5998 0.402407 123.681 12.5523 180.672 36.1584C237.662 59.7645 289.444 94.3645 333.063 137.983C376.681 181.601 411.281 233.384 434.887 290.374ZM1128.27 469.975C1128.27 408.289 1140.42 347.207 1164.03 290.217C1187.63 233.227 1222.23 181.444 1265.85 137.826C1309.47 94.2077 1361.25 59.6077 1418.24 36.0016C1475.23 12.3955 1536.32 0.245612 1598 0.245614L1598 141.164C1554.82 141.164 1512.06 149.669 1472.17 166.194C1432.28 182.718 1396.03 206.938 1365.5 237.471C1334.96 268.003 1310.74 304.251 1294.22 344.144C1277.7 384.037 1269.19 426.795 1269.19 469.975L1128.27 469.975Z"
                fill="url(#paint5_linear_1217_1539)"
              />
              <path
                opacity="0.3"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M434.887 290.374C458.493 347.364 470.643 408.446 470.643 470.131L470.617 470.131C470.638 513.258 479.142 555.96 495.646 595.805C512.17 635.698 536.39 671.946 566.923 702.479C597.456 733.011 633.704 757.231 673.597 773.756C713.49 790.28 756.247 798.785 799.427 798.785C842.606 798.784 885.362 790.28 925.254 773.756C965.147 757.232 1001.39 733.012 1031.93 702.479C1062.46 671.946 1086.68 635.698 1103.2 595.805C1119.73 555.912 1128.23 513.155 1128.23 469.975L1269.15 469.975C1269.15 531.66 1257 592.742 1233.4 649.732C1209.79 706.722 1175.19 758.505 1131.57 802.123C1087.95 845.742 1036.17 880.342 979.181 903.948C922.191 927.554 861.11 939.704 799.424 939.704L799.424 939.704C737.739 939.703 676.659 927.553 619.67 903.948C562.68 880.341 510.897 845.741 467.279 802.123C423.66 758.505 389.06 706.722 365.454 649.732C341.848 592.742 329.698 531.66 329.698 469.975L329.724 469.975C329.704 426.848 321.199 384.146 304.695 344.301C288.171 304.408 263.951 268.16 233.418 237.627C202.885 207.095 166.637 182.875 126.744 166.35C86.8512 149.826 44.0941 141.321 0.914122 141.321L0.914104 0.402405C62.5998 0.402407 123.681 12.5523 180.672 36.1584C237.662 59.7645 289.444 94.3645 333.063 137.983C376.681 181.601 411.281 233.384 434.887 290.374ZM1128.27 469.975C1128.27 408.289 1140.42 347.207 1164.03 290.217C1187.63 233.227 1222.23 181.444 1265.85 137.826C1309.47 94.2077 1361.25 59.6077 1418.24 36.0016C1475.23 12.3955 1536.32 0.245612 1598 0.245614L1598 141.164C1554.82 141.164 1512.06 149.669 1472.17 166.194C1432.28 182.718 1396.03 206.938 1365.5 237.471C1334.96 268.003 1310.74 304.251 1294.22 344.144C1277.7 384.037 1269.19 426.795 1269.19 469.975L1128.27 469.975Z"
                fill="url(#paint6_linear_1217_1539)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_1217_1539"
                x="1140.05"
                y="525.148"
                width="721.481"
                height="721.481"
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
                  stdDeviation="83.7003"
                  result="effect1_foregroundBlur_1217_1539"
                />
              </filter>
              <filter
                id="filter1_f_1217_1539"
                x="749.756"
                y="-22.7692"
                width="721.481"
                height="721.481"
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
                  stdDeviation="83.7003"
                  result="effect1_foregroundBlur_1217_1539"
                />
              </filter>
              <filter
                id="filter2_f_1217_1539"
                x="-39.2365"
                y="367.095"
                width="721.481"
                height="721.481"
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
                  stdDeviation="83.7003"
                  result="effect1_foregroundBlur_1217_1539"
                />
              </filter>
              <linearGradient
                id="paint0_linear_1217_1539"
                x1="1646.9"
                y1="912.77"
                x2="799.458"
                y2="411.261"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1217_1539"
                x1="1646.9"
                y1="912.77"
                x2="799.458"
                y2="411.261"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1217_1539"
                x1="0.911392"
                y1="1088.95"
                x2="717.382"
                y2="248.636"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1217_1539"
                x1="0.911392"
                y1="1088.95"
                x2="717.382"
                y2="248.636"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1217_1539"
                x1="70.9999"
                y1="96.6303"
                x2="362.129"
                y2="261.033"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_1217_1539"
                x1="1430.1"
                y1="-59.3705"
                x2="1226.13"
                y2="312.081"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_1217_1539"
                x1="443.31"
                y1="723.711"
                x2="1149.67"
                y2="702.547"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="0.489583" stop-color="white" />
                <stop offset="0.96875" stop-color="white" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={styles.coin1}>
          <img src="/season-of-blockchains/coin1.svg"></img>
        </div>
        <div className={styles.coin2}>
          <img src="/season-of-blockchains/coin2.svg"></img>
        </div>
        <div className={styles.coin3}>
          <img src="/season-of-blockchains/coin3.svg"></img>
        </div>
        <div className={styles.coin4}>
          <img src="/season-of-blockchains/coin4.svg"></img>
        </div>
        <div className={styles.coin5}>
          <img src="/season-of-blockchains/coin5.svg"></img>
        </div>
        <div className={styles.coin6}>
          <img src="/season-of-blockchains/coin6.svg"></img>
        </div>
        <div className={styles.coin7}>
          <img src="/season-of-blockchains/coin7.svg"></img>
        </div>
        <div className={styles.coin8}>
          <img src="/season-of-blockchains/coin8.svg"></img>
        </div>
        <div className={styles.coin9}>
          <img src="/season-of-blockchains/coin9.svg"></img>
        </div>
        <div className={styles.coin10}>
          <img src="/season-of-blockchains/coin10.svg"></img>
        </div>
        <div className={styles.coin11}>
          <img src="/season-of-blockchains/coin11.svg"></img>
        </div>
        <div className={styles.coin11b}>
          <img src="/season-of-blockchains/coin11b.svg"></img>
        </div>
        <div className={styles.coin12}>
          <img src="/season-of-blockchains/coin12.svg"></img>
        </div>
        <div className={styles.coin13}>
          <img src="/season-of-blockchains/coin13.svg"></img>
        </div>
        <div className={styles.coin14}>
          <img src="/season-of-blockchains/coin14.svg"></img>
        </div>
        <div className={styles.coin15}>
          <img src="/season-of-blockchains/coin15.svg"></img>
        </div>
        <div className={styles.coin16}>
          <img src="/season-of-blockchains/coin16.svg"></img>
        </div>
        <div className={styles.coin17}>
          <img src="/season-of-blockchains/coin17.svg"></img>
        </div>
        <div className={styles.coin18}>
          <img src="/season-of-blockchains/coin18.svg"></img>
        </div>
        <div className={styles.coin19}>
          <img src="/season-of-blockchains/coin19.svg"></img>
        </div>
        <footer className={styles.footer} id="faqs">
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
  );
}
