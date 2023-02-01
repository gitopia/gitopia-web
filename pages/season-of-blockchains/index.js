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
                  href={"/season-of-blockchains/organizations-list"}
                  target="_blank"
                  rel="noreferrer"
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
                  href={"https://medium.com/@gitopia"}
                  target="_blank"
                  rel="noreferrer"
                >
                  About
                </a>
              </li>
              {/* <li>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"https://docs.gitopia.com/basic-faq"}
                  target="_blank"
                  rel="noreferrer"
                >
                  FAQs
                </a>
              </li> */}
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href={"/season-of-blockchains/#contact"}
                >
                  Contact
                </a>
              </li>
              <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="/home"
                  target="_blank"
                  rel="noreferrer"
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
                GSoB is the first-ever six-week global blockchain program to
                bring the budding developers together to work on challenging
                projects for the most exciting organisations in the Web3 space!
                🚀
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
                    "btn-sm sm:py-1.5 btn-primary rounded active:bg-green-900 hover:bg-green-400 " +
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
          <div className={"flex " + styles.topCardBorder}>
            <div className={styles.topCardImage}>
              <img src="/season-of-blockchains/partnerships.svg"></img>
            </div>
            <div className={styles.topCardBody}>
              <div className={styles.topCardTitle}>
                Interested in partnering with Gitopia? Let us know!
              </div>
              <div>
                <button
                  onClick={() => {
                    if (window) {
                      window.open("https://airtable.com/shrtI4oMi7uPswr9I");
                    }
                  }}
                  type="button"
                  className={
                    "lg:px-10 py-4 rounded text-white text-sm font-bold active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 " +
                    styles.topCardButton
                  }
                >
                  Talk to us
                </button>
              </div>
            </div>
          </div>
          {/*
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
          */}
          <div className={"flex " + styles.midScreen}>
            <div className={" " + styles.image2}>
              <img src="/season-of-blockchains/home-2.svg"></img>
            </div>
            <div className={"sm:mb-36 " + styles.section4}>
              <div className={" " + styles.title3}>Benefits for the</div>
              <div className={" " + styles.title4}>participants</div>
              <div className="flex">
                <div className={"mt-0 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/learning.svg" />
                </div>
                <div className={"card pt-2 " + styles.card2}>
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
                <div className={"mt-0 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/exposure.svg" />
                </div>
                <div className={"card pt-2 " + styles.card2}>
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
                <div className={"mt-0 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/coolstipend.svg" />
                </div>
                <div className={"card pt-2 " + styles.card2}>
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
                <div className={"mt-0 ml-1 " + styles.cardImage}>
                  <img src="/season-of-blockchains/hiring.svg" />
                </div>
                <div className={"card pt-1.5 " + styles.card2}>
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

              <div className={"flex text-center "} id="fa">
                <button
                  id="fas"
                  onClick={() => {
                    window.open("https://blog.gitopia.com/");
                  }}
                  type="button1"
                  className={
                    "btn-sm btn-primary rounded mt-6 h-10 w-80 bg-green active:bg-green-900 hover:bg-green-400"
                  }
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div className={styles.section3}>
            <div className={styles.section3Content}>
              When decentralized blockchain protocols start displacing the
              centralized web services that dominate the current Internet,
              we&apos;ll start to see real internet-based sovereignty. The
              future Internet will be decentralized.
            </div>
            <div className={"flex " + styles.section3End}>
              <div className={styles.section3Name}>Olaf Carlson-Wee</div>
              <div className={"mr-4 ml-4 " + styles.vl}></div>
              <div className={styles.section3Designation}>
                Founder & CEO of Polychain Capital
              </div>
            </div>
          </div>
          <div className={"flex " + styles.midScreen}>
            <div className={"sm:mb-36 " + styles.section4}>
              <div className={" " + styles.title3}>
                How GSoB will contribute
              </div>
              <div className={" " + styles.title4}>to the Web3 ecosystem</div>

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
                      Give exposure to developers<br className={styles.br}></br>{" "}
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
                      Providing an immersive learning
                      <br className={styles.br}></br> experience to the
                      participants
                    </div>
                  </div>
                </div>
              </div>
              <div className={"flex text-center "}>
                <button
                  onClick={() => {
                    if (window) {
                      window.open("/season-of-blockchains/organizations-list");
                    }
                  }}
                  type="button"
                  className={
                    "btn-sm btn-primary rounded mt-6 h-10 w-80 bg-green active:bg-green-900 hover:bg-green-400"
                  }
                >
                  Become a partner
                </button>
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
                    GSoB Announcement and Projects Application Period
                  </div>
                  <div className={styles.section5Content}>
                    Interested projects can submit their applications to be
                    <br className={styles.br}></br> mentor projects for GSoB.
                    Program administrators will
                    <br className={styles.br}></br> start reviewing the project
                    applications. Interested
                    <br className={styles.br}></br> participants can fill out
                    the pre-interest forms and join the
                    <br className={styles.br}></br> Gitopia Discord channel for
                    updates.
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
                    Participating Projects Announced
                  </div>
                  <div className={styles.section5Content}>
                    The list of selected mentoring projects is published.
                    <br className={styles.br}></br> Potential GSoB contributors
                    can check the ideas of the
                    <br className={styles.br}></br> participating projects and
                    interact with the project members
                    <br className={styles.br}></br> to discuss application ideas
                    and get initial insights into the
                    <br className={styles.br}></br> project.
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
                    Contributors Application Period
                  </div>
                  <div className={styles.section5Content}>
                    Potential contributors can submit their proposals to the
                    <br className={styles.br}></br> mentor projects they are
                    interested in contributing to.
                    <br className={styles.br}></br> Accepted contributor
                    proposals are announced after review.
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
                    Community Bonding Period
                  </div>
                  <div className={styles.section5Content}>
                    Selected contributors can spend the one-week
                    <br className={styles.br}></br>
                    community bonding period getting to know their
                    <br className={styles.br}></br>
                    mentors, read the documentation, and get up to
                    <br className={styles.br}></br>
                    speed to begin working on their projects.
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
                  <div className={styles.section5BodyTitle}>
                    Development Period
                  </div>
                  <div className={styles.section5Content}>
                    Contributors start working on their Gitopia Season of
                    Blockchains projects.
                  </div>
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
                  <div className={styles.section5BodyTitle}>
                    Results Announced
                  </div>
                  <div className={styles.section5Content}>
                    Contributors are notified of the results, and the stipends
                    are distributed.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*
				
          <div className={styles.endHeadline} id="about">
            What OGs have to say about GSoB?
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
              target="_blank" rel="noreferrer"
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
              target="_blank" rel="noreferrer"
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
						*/}
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
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
                fillRule="evenodd"
                clipRule="evenodd"
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
                  fillRule="evenodd"
                  clipRule="evenodd"
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
                fillRule="evenodd"
                clipRule="evenodd"
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
                  fillRule="evenodd"
                  clipRule="evenodd"
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1164.03 332.676C1140.42 389.666 1128.27 450.748 1128.27 512.434L1128.3 512.434C1128.28 555.561 1119.77 598.263 1103.27 638.107C1086.74 678.001 1062.52 714.248 1031.99 744.781C1001.46 775.314 965.211 799.534 925.318 816.058C885.425 832.582 842.669 841.087 799.49 841.087C756.31 841.087 713.553 832.582 673.66 816.058C633.767 799.534 597.519 775.314 566.986 744.781C536.453 714.248 512.233 678 495.709 638.107C479.185 598.214 470.68 555.457 470.68 512.277L470.64 512.277C470.64 450.591 458.49 389.51 434.884 332.52C411.278 275.529 376.678 223.747 333.06 180.129C289.441 136.51 237.659 101.91 180.669 78.3041C123.679 54.698 62.5968 42.5481 0.911174 42.5481L0.911168 183.467C44.0911 183.467 86.8482 191.972 126.741 208.496C166.634 225.02 202.882 249.24 233.415 279.773C263.948 310.306 288.168 346.554 304.692 386.447C321.216 426.34 329.721 469.097 329.721 512.277L329.761 512.277C329.761 573.963 341.911 635.044 365.517 692.035C389.123 749.025 423.723 800.807 467.342 844.426C510.96 888.044 562.743 922.644 619.733 946.25C676.722 969.856 737.803 982.006 799.487 982.006L1233.46 692.035C1257.07 635.045 1269.22 573.963 1269.22 512.277L1269.19 512.277C1269.21 469.15 1277.72 426.448 1294.22 386.604C1310.75 346.71 1334.97 310.463 1365.5 279.93C1396.03 249.397 1432.28 225.177 1472.17 208.653C1512.06 192.128 1554.82 183.624 1598 183.624L1598 42.7048C1536.32 42.7048 1475.23 54.8547 1418.24 78.4608C1361.25 102.067 1309.47 136.667 1265.85 180.285C1222.24 223.904 1187.64 275.686 1164.03 332.676Z"
                fill="url(#paint4_linear_1217_1539)"
              />
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M434.887 290.374C458.493 347.364 470.643 408.446 470.643 470.131L470.617 470.131C470.638 513.258 479.142 555.96 495.646 595.805C512.17 635.698 536.39 671.946 566.923 702.479C597.456 733.011 633.704 757.231 673.597 773.756C713.49 790.28 756.247 798.785 799.427 798.785C842.606 798.784 885.362 790.28 925.254 773.756C965.147 757.232 1001.39 733.012 1031.93 702.479C1062.46 671.946 1086.68 635.698 1103.2 595.805C1119.73 555.912 1128.23 513.155 1128.23 469.975L1269.15 469.975C1269.15 531.66 1257 592.742 1233.4 649.732C1209.79 706.722 1175.19 758.505 1131.57 802.123C1087.95 845.742 1036.17 880.342 979.181 903.948C922.191 927.554 861.11 939.704 799.424 939.704L799.424 939.704C737.739 939.703 676.659 927.553 619.67 903.948C562.68 880.341 510.897 845.741 467.279 802.123C423.66 758.505 389.06 706.722 365.454 649.732C341.848 592.742 329.698 531.66 329.698 469.975L329.724 469.975C329.704 426.848 321.199 384.146 304.695 344.301C288.171 304.408 263.951 268.16 233.418 237.627C202.885 207.095 166.637 182.875 126.744 166.35C86.8512 149.826 44.0941 141.321 0.914122 141.321L0.914104 0.402405C62.5998 0.402407 123.681 12.5523 180.672 36.1584C237.662 59.7645 289.444 94.3645 333.063 137.983C376.681 181.601 411.281 233.384 434.887 290.374ZM1128.27 469.975C1128.27 408.289 1140.42 347.207 1164.03 290.217C1187.63 233.227 1222.23 181.444 1265.85 137.826C1309.47 94.2077 1361.25 59.6077 1418.24 36.0016C1475.23 12.3955 1536.32 0.245612 1598 0.245614L1598 141.164C1554.82 141.164 1512.06 149.669 1472.17 166.194C1432.28 182.718 1396.03 206.938 1365.5 237.471C1334.96 268.003 1310.74 304.251 1294.22 344.144C1277.7 384.037 1269.19 426.795 1269.19 469.975L1128.27 469.975Z"
                fill="url(#paint5_linear_1217_1539)"
              />
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1217_1539"
                x1="1646.9"
                y1="912.77"
                x2="799.458"
                y2="411.261"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1217_1539"
                x1="0.911392"
                y1="1088.95"
                x2="717.382"
                y2="248.636"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1217_1539"
                x1="0.911392"
                y1="1088.95"
                x2="717.382"
                y2="248.636"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1217_1539"
                x1="70.9999"
                y1="96.6303"
                x2="362.129"
                y2="261.033"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_1217_1539"
                x1="1430.1"
                y1="-59.3705"
                x2="1226.13"
                y2="312.081"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_1217_1539"
                x1="443.31"
                y1="723.711"
                x2="1149.67"
                y2="702.547"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.489583" stopColor="white" />
                <stop offset="0.96875" stopColor="white" stopOpacity="0" />
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

        <footer
          className={
            styles.footerContainer + " flex flex-col items-center relative"
          }
          id="contact"
        >
          <div className={styles.footer + " "}>
            <div className={styles.footerLogo}></div>
            <div className={styles.footerSection}>
              <div className={styles.footerTitle}>Learn more about Gitopia</div>
              <div className="flex justify-between  sm:flex-col">
                <div
                  onClick={() => {
                    if (window) {
                      window.open("https://gitopia.com/whitepaper.pdf");
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Whitepaper
                </div>
                <div className={styles.footerLinks + " invisible"}>
                  About Gitopia
                </div>
                <div className={styles.footerLinks + " invisible"}>
                  LORE tokeneconomics{" "}
                </div>
              </div>
            </div>
            <div className={styles.footerSection + " pr-14 sm:pr-0"}>
              <div className={styles.footerTitle}>Guide to Gitopia</div>
              <div className="flex justify-between sm:flex-col">
                <div
                  onClick={() => {
                    if (window) {
                      window.open("https://docs.gitopia.com/");
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Documentation
                </div>
                <div
                  onClick={() => {
                    if (window) {
                      window.open(
                        "https://www.youtube.com/channel/UCsAVjkAUnT5krP_e8HyFRHg"
                      );
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Videos
                </div>
                <div
                  onClick={() => {
                    if (window) {
                      window.open("https://blog.gitopia.com/");
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Blog
                </div>
              </div>
            </div>
            <div className={styles.footerSection}>
              <div className={styles.footerTitle}>Quick links</div>
              <div className="flex  justify-between sm:flex-col">
                <div
                  onClick={() => {
                    if (window) {
                      window.open(
                        "https://docs.gitopia.com/gitguides/basic-commands/index.html"
                      );
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Git Commands
                </div>
                <div
                  onClick={() => {
                    if (window) {
                      window.open(
                        "https://blog.gitopia.com/post/2022/04/game-of-lore/"
                      );
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  The Game of $LORE
                </div>
                <div
                  onClick={() => {
                    if (window) {
                      window.open("http://blog.gitopia.com/");
                    }
                  }}
                  target="_blank"
                  className={styles.footerLinks + " cursor-pointer"}
                >
                  Read More
                </div>
              </div>
            </div>
            <div className={styles.footerSection + " pr-20 sm:pr-5 lg:pr-0"}>
              <div className={styles.footerTitle}>Socials</div>
              <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-3">
                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 40 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open("https://discord.gg/aqsKW3hUHD");
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect
                    y="0.818115"
                    width="40"
                    height="40"
                    rx="20"
                    fill="#222933"
                  />
                  <g clipPath="url(#clip0_3129_6346)">
                    <path
                      d="M18.4464 19.438C18.2076 19.4577 17.9849 19.5664 17.8225 19.7427C17.6602 19.9189 17.57 20.1498 17.57 20.3895C17.57 20.6291 17.6602 20.86 17.8225 21.0362C17.9849 21.2125 18.2076 21.3212 18.4464 21.3409C18.5666 21.3365 18.6847 21.3083 18.794 21.258C18.9032 21.2077 19.0014 21.1363 19.0829 21.0478C19.1644 20.9593 19.2275 20.8556 19.2687 20.7426C19.3099 20.6296 19.3283 20.5096 19.3228 20.3895C19.3287 20.2692 19.3106 20.149 19.2696 20.0358C19.2286 19.9226 19.1655 19.8187 19.0839 19.7302C19.0023 19.6416 18.904 19.5702 18.7945 19.52C18.6851 19.4699 18.5667 19.442 18.4464 19.438ZM21.575 19.438C21.3835 19.4223 21.1917 19.4647 21.0247 19.5597C20.8577 19.6547 20.7232 19.7979 20.6389 19.9706C20.5546 20.1433 20.5244 20.3374 20.5522 20.5275C20.5799 20.7176 20.6644 20.8949 20.7946 21.0363C20.9248 21.1776 21.0946 21.2763 21.2818 21.3196C21.469 21.3629 21.6649 21.3486 21.8439 21.2787C22.0229 21.2089 22.1767 21.0866 22.285 20.9279C22.3934 20.7693 22.4514 20.5816 22.4514 20.3895C22.4569 20.2695 22.4385 20.1496 22.3975 20.0368C22.3564 19.9239 22.2935 19.8203 22.2122 19.7318C22.131 19.6434 22.033 19.5719 21.924 19.5215C21.815 19.4711 21.6971 19.4427 21.5771 19.438H21.575Z"
                      fill="white"
                    />
                    <path
                      d="M25.7428 12.2467H14.2571C14.0256 12.2473 13.7965 12.2935 13.5829 12.3826C13.3693 12.4718 13.1753 12.6022 13.0121 12.7664C12.8489 12.9306 12.7197 13.1253 12.6318 13.3395C12.5439 13.5537 12.4991 13.7831 12.5 14.0146V25.601C12.4991 25.8325 12.5439 26.0619 12.6318 26.276C12.7197 26.4902 12.8489 26.685 13.0121 26.8492C13.1753 27.0133 13.3693 27.1437 13.5829 27.2329C13.7965 27.3221 14.0256 27.3683 14.2571 27.3688H23.9771L23.5228 25.7831L24.62 26.801L25.6571 27.761L27.5 29.3896V14.0146C27.5008 13.7831 27.456 13.5537 27.3682 13.3395C27.2803 13.1253 27.1511 12.9306 26.9879 12.7664C26.8247 12.6022 26.6307 12.4718 26.4171 12.3826C26.2034 12.2935 25.9743 12.2473 25.7428 12.2467V12.2467ZM22.4343 23.4431C22.4343 23.4431 22.1257 23.0746 21.8686 22.7467C22.4903 22.6014 23.0406 22.2409 23.4221 21.7288C23.1137 21.9341 22.783 22.1038 22.4364 22.2346C22.0377 22.4048 21.6206 22.5284 21.1936 22.6031C20.4595 22.7383 19.7066 22.7354 18.9736 22.5946C18.5432 22.5104 18.1214 22.387 17.7136 22.226C17.3691 22.0924 17.0401 21.9222 16.7321 21.7181C17.0989 22.2198 17.6295 22.5776 18.2321 22.7296C17.975 23.0553 17.6578 23.441 17.6578 23.441C17.1487 23.4547 16.6439 23.3431 16.1881 23.1159C15.7322 22.8887 15.3391 22.5529 15.0436 22.1381C15.0707 20.4006 15.492 18.692 16.2757 17.141C16.9666 16.5984 17.809 16.2839 18.6864 16.241L18.7721 16.3438C17.9473 16.548 17.1776 16.9313 16.5178 17.4667C16.5178 17.4667 16.7064 17.3638 17.0236 17.2181C17.6403 16.9367 18.2977 16.7544 18.9714 16.6781C19.0194 16.6682 19.0681 16.6625 19.1171 16.661C19.6915 16.5862 20.2728 16.5804 20.8486 16.6438C21.754 16.7473 22.6304 17.0268 23.4286 17.4667C22.8022 16.9569 22.0747 16.5858 21.2943 16.3781L21.4143 16.241C22.2917 16.2839 23.1341 16.5984 23.825 17.141C24.6087 18.692 25.03 20.4006 25.0571 22.1381C24.7593 22.5529 24.3647 22.8886 23.9076 23.116C23.4505 23.3435 22.9447 23.4558 22.4343 23.4431Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3129_6346">
                      <rect
                        width="17.1429"
                        height="17.1429"
                        fill="white"
                        transform="translate(11.4286 12.2466)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open("https://t.me/Gitopia");
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect
                    x="0.697662"
                    y="0.818115"
                    width="40"
                    height="40"
                    rx="20"
                    fill="#222933"
                  />
                  <g clipPath="url(#clip0_3129_6351)">
                    <path
                      d="M29.2342 14.0514C29.2205 13.9881 29.1901 13.9297 29.1464 13.8819C29.1026 13.8342 29.047 13.799 28.9851 13.7798C28.76 13.7354 28.5272 13.752 28.3107 13.828C28.3107 13.828 13.2909 19.2264 12.4332 19.8243C12.2478 19.9528 12.1862 20.0273 12.1557 20.1157C12.0073 20.541 12.4691 20.7285 12.4691 20.7285L16.3401 21.9901C16.4055 22.0015 16.4726 21.9974 16.5362 21.9784C17.4169 21.4223 25.3964 16.3834 25.8576 16.2141C25.93 16.1921 25.9835 16.2141 25.9717 16.2676C25.7832 16.9137 18.8923 23.0375 18.8542 23.075C18.8358 23.0901 18.8212 23.1096 18.8119 23.1316C18.8026 23.1536 18.7987 23.1776 18.8007 23.2014L18.4407 26.9787C18.4407 26.9787 18.2896 28.1573 19.466 26.9787C20.3001 26.1435 21.1005 25.4525 21.5017 25.1166C22.833 26.0353 24.2655 27.0516 24.8832 27.5809C24.9868 27.6815 25.1097 27.7603 25.2444 27.8124C25.3792 27.8645 25.5231 27.8889 25.6675 27.8841C26.2567 27.8616 26.4175 27.2171 26.4175 27.2171C26.4175 27.2171 29.1539 16.2055 29.246 14.7296C29.2546 14.585 29.2669 14.4923 29.268 14.3932C29.2729 14.2782 29.2615 14.1632 29.2342 14.0514Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3129_6351">
                      <rect
                        width="17.1429"
                        height="17.1429"
                        fill="white"
                        transform="translate(12.1262 12.2466)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open("https://twitter.com/gitopiaDAO");
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect
                    x="0.395325"
                    y="0.818115"
                    width="40"
                    height="40"
                    rx="20"
                    fill="#222933"
                  />
                  <g clipPath="url(#clip0_3129_6355)">
                    <path
                      d="M28.9667 15.5145C28.3238 15.7823 27.681 15.9966 26.931 16.0502C27.681 15.6216 28.2167 14.9252 28.4845 14.1216C27.7881 14.5502 27.0381 14.818 26.2345 14.9788C25.5917 14.2823 24.681 13.8538 23.7167 13.8538C21.7881 13.8538 20.181 15.4073 20.181 17.3895C20.181 17.6573 20.2345 17.9252 20.2881 18.193C17.3417 18.0323 14.7703 16.6395 13.0024 14.4966C12.681 15.0323 12.5203 15.6216 12.5203 16.2645C12.5203 17.4966 13.1631 18.568 14.0738 19.2109C13.4845 19.2109 12.9488 19.0502 12.4667 18.7823V18.8359C12.4667 20.5502 13.6988 21.943 15.306 22.2645C14.9845 22.318 14.7167 22.3716 14.3953 22.3716C14.181 22.3716 13.9667 22.3716 13.7524 22.318C14.181 23.7109 15.5203 24.7288 17.0203 24.7823C15.8417 25.7466 14.2881 26.2823 12.6274 26.2823C12.3595 26.2823 12.0381 26.2823 11.7703 26.2288C13.3774 27.193 15.2524 27.7823 17.2345 27.7823C23.7167 27.7823 27.2524 22.4252 27.2524 17.7645C27.2524 17.6038 27.2524 17.443 27.2524 17.3359C27.8953 16.8002 28.4845 16.2109 28.9667 15.5145Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3129_6355">
                      <rect
                        width="17.1429"
                        height="17.1429"
                        fill="white"
                        transform="translate(11.8239 12.2466)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open("https://www.reddit.com/r/Gitopia/");
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect width="40" height="40" rx="20" fill="#222933" />
                  <path
                    d="M28.9999 19.8404C28.9999 18.7173 28.0884 17.8057 26.9652 17.8057C26.4118 17.8057 25.9234 18.0173 25.5653 18.3754C24.1817 17.3825 22.2609 16.7314 20.1448 16.65L21.0727 12.3038L24.0841 12.9386C24.1166 13.7037 24.7514 14.3222 25.5328 14.3222C26.3304 14.3222 26.9815 13.6711 26.9815 12.8735C26.9815 12.0759 26.3304 11.4248 25.5328 11.4248C24.9631 11.4248 24.4747 11.7504 24.2468 12.2387L20.8773 11.5225C20.7797 11.5062 20.682 11.5225 20.6006 11.5713C20.5192 11.6201 20.4704 11.7015 20.4378 11.7992L19.4123 16.65C17.2474 16.7151 15.3103 17.3499 13.9104 18.3754C13.5523 18.0336 13.0477 17.8057 12.5106 17.8057C11.3874 17.8057 10.4758 18.7173 10.4758 19.8404C10.4758 20.6706 10.9642 21.3705 11.6804 21.6961C11.6478 21.8914 11.6316 22.103 11.6316 22.3146C11.6316 25.44 15.2615 27.963 19.7542 27.963C24.2468 27.963 27.8768 25.44 27.8768 22.3146C27.8768 22.103 27.8605 21.9077 27.8279 21.7124C28.4953 21.3868 28.9999 20.6706 28.9999 19.8404ZM15.0824 21.2891C15.0824 20.4915 15.7336 19.8404 16.5312 19.8404C17.3288 19.8404 17.9799 20.4915 17.9799 21.2891C17.9799 22.0868 17.3288 22.7379 16.5312 22.7379C15.7336 22.7379 15.0824 22.0868 15.0824 21.2891ZM23.1725 25.1144C22.1796 26.1074 20.2913 26.1725 19.7379 26.1725C19.1844 26.1725 17.2799 26.0911 16.3033 25.1144C16.1568 24.9679 16.1568 24.7238 16.3033 24.5773C16.4498 24.4308 16.6939 24.4308 16.8404 24.5773C17.459 25.1958 18.7938 25.4237 19.7542 25.4237C20.7146 25.4237 22.0331 25.1958 22.6679 24.5773C22.8144 24.4308 23.0586 24.4308 23.2051 24.5773C23.319 24.74 23.319 24.9679 23.1725 25.1144ZM22.9121 22.7379C22.1144 22.7379 21.4633 22.0868 21.4633 21.2891C21.4633 20.4915 22.1144 19.8404 22.9121 19.8404C23.7097 19.8404 24.3608 20.4915 24.3608 21.2891C24.3608 22.0868 23.7097 22.7379 22.9121 22.7379Z"
                    fill="white"
                  />
                </svg>
                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open(
                        "https://www.youtube.com/channel/UCsAVjkAUnT5krP_e8HyFRHg"
                      );
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect width="40" height="40" rx="20" fill="#222933" />
                  <g clipPath="url(#clip0_3235_6604)">
                    <path
                      d="M29.582 15.1861C29.352 14.3256 28.6744 13.648 27.8139 13.418C26.2542 13 20 13 20 13C20 13 13.7458 13 12.1861 13.418C11.3256 13.648 10.6479 14.3256 10.4179 15.1861C10 16.7458 10 20 10 20C10 20 10 23.2541 10.4179 24.814C10.6479 25.6744 11.3256 26.352 12.1861 26.5821C13.7458 27 20 27 20 27C20 27 26.2542 27 27.8139 26.5821C28.6744 26.352 29.352 25.6744 29.582 24.814C30 23.2541 30 20 30 20C30 20 30 16.7458 29.582 15.1861Z"
                      fill="white"
                    />
                    <path
                      d="M17.9546 22.9546L23.1818 20.0002L17.9546 17.0455V22.9546Z"
                      fill="#222933"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3235_6604">
                      <rect
                        width="20"
                        height="14"
                        fill="white"
                        transform="translate(10 13)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    if (window) {
                      window.open("https://www.linkedin.com/company/gitopia/");
                    }
                  }}
                  target="_blank"
                >
                  <svg
                    width={"40"}
                    height={"41"}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute"
                  >
                    <rect width="40" height="40" rx="20" fill="#222933" />
                  </svg>
                  <svg
                    width={"19"}
                    height={"17"}
                    viewBox="0 0 19 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute mt-3 ml-3"
                  >
                    <g clipPath="url(#clip0_3235_6618)">
                      <path
                        d="M18.0677 15.9027C18.1084 15.9031 18.1488 15.8947 18.1864 15.8781C18.224 15.8614 18.2579 15.8369 18.286 15.8059C18.3141 15.7749 18.3359 15.7382 18.3499 15.6981C18.364 15.6579 18.37 15.6151 18.3677 15.5724C18.3677 15.3382 18.233 15.2263 17.9568 15.2263H17.5105V16.4525H17.6784V15.918H17.8847L17.8894 15.9245L18.2095 16.4525H18.389L18.0446 15.9061L18.0677 15.9027ZM17.8735 15.7798H17.6789V15.3653H17.9256C18.053 15.3653 18.1983 15.3871 18.1983 15.5623C18.1983 15.7637 18.0513 15.7798 17.8725 15.7798"
                        fill="white"
                      />
                      <path
                        d="M13.6883 14.3658H11.3078V10.4534C11.3078 9.5205 11.292 8.31952 10.0698 8.31952C8.82995 8.31952 8.64025 9.33599 8.64025 10.3855V14.3655H6.25979V6.32015H8.54502V7.41963H8.57702C8.80572 7.00926 9.13619 6.67166 9.53325 6.4428C9.9303 6.21395 10.3791 6.1024 10.8318 6.12003C13.2445 6.12003 13.6893 7.78552 13.6893 9.95223L13.6883 14.3658ZM3.57385 5.2204C3.30063 5.22046 3.03353 5.13548 2.80633 4.97622C2.57913 4.81696 2.40205 4.59057 2.29745 4.32568C2.19285 4.06079 2.16543 3.7693 2.21869 3.48807C2.27194 3.20683 2.40347 2.94848 2.59663 2.74569C2.78978 2.5429 3.03591 2.40478 3.30386 2.34879C3.57182 2.2928 3.84957 2.32146 4.10201 2.43114C4.35445 2.54082 4.57023 2.7266 4.72206 2.96498C4.87389 3.20337 4.95496 3.48365 4.95501 3.77038C4.95504 3.96077 4.91934 4.1493 4.84995 4.3252C4.78055 4.50111 4.67884 4.66095 4.55058 4.79559C4.42233 4.93024 4.27005 5.03706 4.10247 5.10995C3.93488 5.18284 3.75526 5.22037 3.57385 5.2204ZM4.76407 14.3658H2.38114V6.32015H4.76407V14.3658ZM14.8751 0.000904572H1.18497C0.874242 -0.00277548 0.57482 0.123161 0.352524 0.35104C0.130228 0.578919 0.00324293 0.890096 -0.000549316 1.21619V15.6433C0.00311314 15.9695 0.130024 16.2809 0.352312 16.509C0.574601 16.7371 0.874088 16.8633 1.18497 16.8599H14.8751C15.1866 16.864 15.4869 16.7381 15.71 16.51C15.9332 16.2819 16.061 15.9702 16.0653 15.6433V1.21515C16.0608 0.888409 15.933 0.576877 15.7098 0.349004C15.4866 0.12113 15.1864 -0.00444615 14.8751 -0.000136782"
                        fill="white"
                      />
                      <path
                        d="M17.8939 14.6799C17.6043 14.6829 17.3275 14.806 17.1242 15.0225C16.9209 15.239 16.8075 15.5312 16.8089 15.8351C16.8103 16.1391 16.9263 16.4301 17.1316 16.6445C17.3369 16.8589 17.6148 16.9793 17.9044 16.9793C18.194 16.9793 18.4719 16.8589 18.6772 16.6445C18.8825 16.4301 18.9985 16.1391 18.9999 15.8351C19.0013 15.5312 18.8879 15.239 18.6846 15.0225C18.4813 14.806 18.2046 14.6829 17.9149 14.6799H17.8939ZM17.8939 16.8477C17.7039 16.851 17.5173 16.7951 17.3576 16.6871C17.1979 16.5791 17.0723 16.4238 16.9966 16.2409C16.921 16.058 16.8988 15.8557 16.9327 15.6595C16.9667 15.4633 17.0553 15.2821 17.1874 15.1388C17.3195 14.9955 17.4891 14.8965 17.6748 14.8543C17.8605 14.8122 18.054 14.8287 18.2307 14.902C18.4074 14.9752 18.5594 15.1018 18.6676 15.2657C18.7758 15.4296 18.8352 15.6235 18.8384 15.8229C18.8384 15.8286 18.8384 15.8341 18.8384 15.8398C18.8437 16.1013 18.7498 16.3544 18.5774 16.5433C18.405 16.7322 18.1681 16.8415 17.9189 16.8472H17.8941"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3235_6618">
                        <rect width="19" height="17" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <svg
                  width={"40"}
                  height={"41"}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (window) {
                      window.open("https://forum.gitopia.com/");
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <rect width="40" height="40" rx="20" fill="#222933" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.9107 19.3276C21.7634 19.3276 23.2654 17.8306 23.2654 15.9839C23.2654 14.1372 21.7634 12.6401 19.9107 12.6401C18.0579 12.6401 16.556 14.1372 16.556 15.9839C16.556 17.8306 18.0579 19.3276 19.9107 19.3276ZM19.9107 21.8753C23.175 21.8753 25.8213 19.2376 25.8213 15.9839C25.8213 12.7302 23.175 10.0925 19.9107 10.0925C16.6463 10.0925 14 12.7302 14 15.9839C14 19.2376 16.6463 21.8753 19.9107 21.8753Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.9751 26.5903C20.9176 26.5903 21.8217 26.2171 22.4882 25.5528C23.1547 24.8884 23.5291 23.9873 23.5291 23.0479H25.8985C25.8985 24.6137 25.2744 26.1155 24.1636 27.2227C23.0528 28.3299 21.5461 28.952 19.9751 28.952C18.4041 28.952 16.8974 28.3299 15.7865 27.2227C14.6757 26.1155 14.0516 24.6137 14.0516 23.0479H16.421C16.421 23.9873 16.7954 24.8884 17.4619 25.5528C18.1285 26.2171 19.0325 26.5903 19.9751 26.5903Z"
                    fill="white"
                  />
                  <path d="M18.607 8H21.2764V11.07H18.607V8Z" fill="white" />
                  <path
                    d="M18.607 28.2622H21.2764V31.0593H18.607V28.2622Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
          <hr className={styles.divider}></hr>
          <div className={"flex flex-col sm:flex-row " + styles.footerEnd}>
            <div className="">
              Copyright © 2023 Gitopia | All Rights Reserved
            </div>
            <div className="flex ">
              <div className="mr-4">Privacy policy</div>
              <div className="mr-4">Terms of services</div>
              <div className="">Blockchain Disclaimer</div>
            </div>
          </div>
          <svg
            width="584"
            height="1449"
            viewBox="0 0 584 1449"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.blob5 + " bottom-0 right-0"}
          >
            <g filter="url(#filter0_f_2770_4799)">
              <path
                d="M1506.85 874.45C1030.59 963.862 1093.89 1294.03 847.014 1294.03C600.135 1294.03 400 1093.89 400 847.014C400 600.135 600.135 400 847.014 400C1093.89 400 2062.27 823.404 1506.85 874.45Z"
                fill="url(#paint0_radial_2770_4799)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2770_4799"
                x="0"
                y="0"
                width="2076.11"
                height="1694.03"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_2770_4799"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2770_4799"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(847.014 847.014) rotate(90) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            width="858"
            height="1449"
            viewBox="0 0 858 1449"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.blob6 + " bottom-0 left-0"}
          >
            <g filter="url(#filter0_f_2770_4798)">
              <path
                d="M287.846 819.578C-188.412 730.166 -125.107 400 -371.986 400C-618.865 400 -819 600.135 -819 847.014C-819 1093.89 -618.865 1294.03 -371.986 1294.03C-125.107 1294.03 843.266 870.624 287.846 819.578Z"
                fill="url(#paint0_radial_2770_4798)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2770_4798"
                x="-1219"
                y="0"
                width="2076.11"
                height="1694.03"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="200"
                  result="effect1_foregroundBlur_2770_4798"
                />
              </filter>
              <radialGradient
                id="paint0_radial_2770_4798"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-371.986 847.014) rotate(-90) scale(447.014 447.014)"
              >
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
        </footer>
      </div>
    </div>
  );
}
