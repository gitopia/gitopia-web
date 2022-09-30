import Head from "next/head";
import { useState, useEffect } from "react";
import React from "react";
import classnames from "classnames";
import styles from "../styles/landing.module.css";
import getBranchSha from "../helpers/getBranchSha";
import getAnyRepository from "../helpers/getAnyRepository";
import Link from "next/link";
import getCommitHistory from "../helpers/getCommitHistory";
import getContent from "../helpers/getContent";
import YoutubeEmbed from "../helpers/youtubeEmbed";
import GitopiaLive from "../helpers/gitopiaLive";
import getAllRepositoryBranch from "../helpers/getAllRepositoryBranch";

const pCircles = [
  {
    url: "#circle1",
    x: -20,
    y: -420,
    z: 11,
    mx: -350,
    my: -570,
    r: 220,
  },
  {
    url: "#circle2",
    x: 470,
    y: -200,
    z: 5,
    mx: 440,
    my: -280,
    r: 166,
  },
  {
    url: "#circle3",
    x: -430,
    y: -100,
    z: 9,
    mx: -600,
    my: -220,
    r: 160,
  },
  {
    url: "#circle4",
    x: 130,
    y: 70,
    z: 7,
    mx: 800,
    my: 0,
    r: 134,
  },
  {
    url: "#circle5",
    x: 170,
    y: 180,
    z: 9,
    mx: 450,
    my: 100,
    r: 72,
  },
  {
    url: "#circle6",
    x: -430,
    y: -150,
    z: 15,
    mx: -500,
    my: -400,
    r: 148,
  },
  {
    url: "#circle7",
    x: -650,
    y: 100,
    z: 13,
    mx: -700,
    my: -100,
    r: 110,
  },
];
const globContentStyles = [
  styles.storageCircleContent1,
  styles.storageCircleContent2,
  styles.storageCircleContent3,
];
let scrollOffset = 0,
  lastOffset = 0,
  isMobile = true,
  isAnimatingCircles = false,
  isAnimatingGlob = false;
let platformCircles, storageLanes, storageAnimSource;

function updateOffset() {
  if (window.innerWidth > 1023) {
    scrollOffset = window.pageYOffset;
    isMobile = false;
  } else {
    scrollOffset = 0;
    isMobile = true;
  }
  if (!isAnimatingCircles) animateCircles();
}

function animateCircles() {
  let i = 0;
  for (let circle of platformCircles) {
    circle.style =
      "transform: translateX(" +
      (isMobile ? pCircles[i].mx : pCircles[i].x) +
      "px) translateY(" +
      (isMobile
        ? pCircles[i].my
        : pCircles[i].y - scrollOffset / pCircles[i].z) +
      "px);";
    i++;
  }
}

function addOrUpdateGlobs() {
  for (let currentLane of storageLanes) {
    if (currentLane.children.length < 5) {
      const glob = document.createElement("div"),
        globContent = document.createElement("span"),
        style = Math.floor(Math.random() * 3),
        overallTiming = Math.random() < 0.3 ? 4 : 8;
      let animTiming =
        overallTiming == 4
          ? 2 * (0.75 + Math.random() / 4)
          : 4 * (0.75 + Math.random() / 4);
      animTiming = animTiming.toFixed(1);
      let delayTiming = overallTiming - animTiming;
      glob.className = styles.storageCircle;
      glob.style =
        "transition: transform " +
        animTiming +
        "s cubic-bezier(" +
        (0.25 + Math.random() / 2) +
        ", 0, " +
        (0.25 + Math.random() / 2) +
        ", 1.0) " +
        delayTiming +
        "s; transform: translateX(-80px);";
      globContent.className = globContentStyles[style];
      glob.appendChild(globContent);
      currentLane.appendChild(glob);
      glob.addEventListener("transitionend", () => {
        glob.remove();
      });
    }
  }
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repository, setRepository] = useState({
    collaborators: [],
    releases: [],
  });
  const [commitDetail, setCommitDetail] = useState({
    author: {},
    message: "",
    title: "",
    id: "",
  });
  const [entityList, setEntityList] = useState([]);
  const [mobile, setMobile] = useState(false);

  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setMobile(true) : setMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectWindowSize);
    }
    detectWindowSize();
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", detectWindowSize);
      }
    };
  });

  const demoAddress = process.env.NEXT_PUBLIC_GITOPIA_ADDRESS,
    demoRepoName = "gitopia",
    demoRepoBranch = "master";

  const initDemoRepo = async () => {
    const repo = await getAnyRepository(demoAddress, demoRepoName);
    let branches = await getAllRepositoryBranch(demoAddress, demoRepoName);
    if (repo) {
      setRepository(repo);
      let branchSha = getBranchSha(repo.defaultBranch, branches);
      const commitHistory = await getCommitHistory(repo.id, branchSha, null, 1);

      if (
        commitHistory &&
        commitHistory.commits &&
        commitHistory.commits.length
      ) {
        setCommitDetail(commitHistory.commits[0]);
      }
      const res = await getContent(repo.id, branchSha, null, null, 1000);
      if (res) {
        if (res.content) {
          setEntityList(res.content);
        }
      }
    } else {
      console.log("Unable to query demo repo");
    }
  };

  useEffect(() => {
    if (window) {
      platformCircles = document.getElementsByClassName("platformCircles");
      window.addEventListener("scroll", updateOffset);
      window.addEventListener("resize", updateOffset);
      if (platformCircles && platformCircles[0]) {
        platformCircles[0].addEventListener("transitionstart", () => {
          isAnimatingCircles = true;
        });
        platformCircles[0].addEventListener("transitionend", () => {
          isAnimatingCircles = false;
          if (lastOffset !== scrollOffset) {
            lastOffset = scrollOffset;
            window.requestAnimationFrame(animateCircles);
          }
        });
      }
      storageLanes = document.getElementsByClassName(
        styles.storageAnimSourceLane
      );
      storageAnimSource = document.getElementById("storageAnimSource");
      const storageAnimSinkFlash = document.getElementById(
        "storageAnimSinkFlash"
      );

      addOrUpdateGlobs();
      storageAnimSinkFlash.addEventListener("animationiteration", () => {
        window.requestAnimationFrame(() => {
          for (let currentLane of storageLanes) {
            const flip1 = Math.random() < 0.8,
              flip2 = Math.random() < 0.5;
            if (flip1 && currentLane.children[0]) {
              currentLane.children[0].style.transform = "translateX(500px)";
            }
            if (flip2 && currentLane.children[1]) {
              currentLane.children[1].style.transform = "translateX(500px)";
            }
          }
        });
        if (window.requestIdleCallback) {
          window.requestIdleCallback(addOrUpdateGlobs);
        } else {
          setTimeout(addOrUpdateGlobs, 0);
        }
      });
    }

    initDemoRepo();

    return () => {
      if (window) {
        window.removeEventListener("scroll", updateOffset);
        window.removeEventListener("resize", updateOffset);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="A new age decentralized code collaboration platform for developers
          to collaborate, BUIDL, and get rewarded."
        />
        <meta
          name="keywords"
          content="code, collaboration, decentralized, git, web3, crypto"
        />
        <meta
          property="og:title"
          content="Gitopia - Code Collaboration for Web3"
        />
        <meta
          property="og:description"
          content="A new age decentralized code collaboration platform for developers
            to collaborate, BUIDL, and get rewarded."
        />
        <meta
          property="og:image"
          content="https://gitopia.com/og-gitopia.jpg"
        />
      </Head>
      <header className={(menuOpen ? "bg-[#13181E] " : "") + styles.header}>
        <div className="flex">
          <div
            type="button"
            onClick={() => {
              if (window) {
                window.location.reload();
              }
            }}
            className={styles.headerLogo + " cursor-pointer"}
          ></div>
          {mobile && !menuOpen ? (
            <div className="mt-2 ml-auto mr-10">
              <Link href="/home" className="">
                <a className="h-8 px-7 py-1.5 w-24 rounded-md text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
                  Login
                </a>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
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
              width="21"
              height="15"
              viewBox="0 0 21 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.5 1.5H20.5" stroke="white" strokeWidth="2" />
              <path d="M0.5 8H20.5" stroke="white" strokeWidth="2" />
              <path d="M0.5 14H20.5" stroke="white" strokeWidth="2" />
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
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.928955 0.928711L15.0711 15.0708"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M0.928955 15.0713L15.0711 0.929154"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center justify-end " +
            (menuOpen
              ? " flex justify-center absolute left-0 right-0 bg-[#13181E] pt-4 pb-4 z-10 shadow-2xl "
              : " hidden ") +
            styles.headerMenu
          }
        >
          <div className={styles.row}>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto w-full">
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  href="https://blog.gitopia.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-12 sm:px-3 py-4 md:py-2 flex items-center text-3xl lg:text-sm text-white font-bold transition-all focus:text-primary"
                >
                  Blog
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-12 sm:px-3 py-4 md:py-2 flex items-center text-3xl lg:text-sm text-white font-bold transition-all hover:text-primary"
                  href="https://docs.gitopia.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="px-12 sm:px-3 py-4 md:py-2 flex items-center text-3xl lg:text-sm text-white font-bold transition-all hover:text-primary"
                  href="https://docs.gitopia.com/lore-token"
                  target="_blank"
                  rel="noreferrer"
                >
                  LORE Token
                </a>
              </li>
              {/* <li className="border-b-2 lg:border-r-2 lg:border-b-0 border-white border-opacity-10 w-full h-2 mb-4 lg:h-6 lg:w-1 lg:mr-4 lg:mb-0 mt-2"></li> */}
              <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
              <li className={menuOpen ? "hidden" : "mr-4 ml-4 mt-1"}>
                <div className="flex flex-col justify-center items-center">
                  <a
                    href="/login"
                    target="_blank"
                    className="h-8 px-4 py-1.5 w-24 rounded-md text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Login
                  </a>
                </div>
              </li>
            </ul>
            {menuOpen ? (
              <div className="absolute bottom-0 ">
                <div className={classnames("mb-2 px-6", styles.primaryCTA)}>
                  <a
                    href="/home"
                    target="_blank"
                    className="h-14 px-8 py-4 w-80 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Get Started
                  </a>
                </div>
                <div className={classnames("mb-4 px-6", styles.primaryCTA)}>
                  <a
                    href="/login"
                    target="_blank"
                    className="h-14 px-8 py-4 w-80 rounded text-white text-sm font-bold bg-tranparent btn btn-outline btn-grey active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Login
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
            {menuOpen ? (
              <div>
                <img
                  className={"absolute pointer-events-none z-1 w-full -top-24 "}
                  src="./mobile-stars.svg"
                />
                <img
                  className={"absolute pointer-events-none z-1 left-10 top-0"}
                  src="./shootingStar.svg"
                />
                <img
                  className={
                    "absolute pointer-events-none z-1 -right-10 top-1/2"
                  }
                  src="./shootingStar3.svg"
                />
                <img
                  className={
                    "absolute pointer-events-none z-1 bottom-1/4 right-8 mr-10"
                  }
                  src="./star-2.svg"
                  width="100"
                  height="100"
                />
                <img
                  className={"absolute pointer-events-none z-1 top-4 right-1/4"}
                  src="./star-6.svg"
                />
                <img
                  className={
                    "absolute pointer-events-none z-1 top-20 -right-1/3 sm:left-0 sm:top-1/3"
                  }
                  src="./star-1.svg"
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={styles.headerLine}></div>
      </header>

      <section className={classnames([styles.section, styles.heroSection])}>
        <div className={styles.row}>
          <h1 className={classnames([styles.h1])}>
            Code Collaboration <br /> for Web3
          </h1>
          <div className={styles.byline}>
            Gitopia is the next-generation Code Collaboration Platform fuelled
            by a decentralized network and interactive token economy. It is
            designed to optimize the open-source software development process
            through collaboration, transparency, and incentivization.
          </div>
          <div className="flex flex-col justify-center items-center">
            <div
              className={classnames(
                "mb-8 px-6 mt-64 sm:mt-0 sm:px-0",
                styles.primaryCTA
              )}
            >
              <a
                href="/home"
                target="_blank"
                className="h-14 px-8 py-4 w-80 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                {mobile ? " Get Started" : "Push code to Gitopia"}
              </a>
            </div>
          </div>
        </div>
        <img
          className={
            "absolute pointer-events-none z-1 w-full " +
            (mobile ? "hidden" : "top-0")
          }
          src="./stars.svg"
        />
        {mobile ? (
          <img
            className={"absolute pointer-events-none z-1 w-full -top-24"}
            src="./mobile-stars.svg"
          />
        ) : (
          ""
        )}
        <img
          className={
            "absolute pointer-events-none z-1 " +
            (mobile ? "-right-14" : "top-1/4 left-10")
          }
          src="./star-1.svg"
          width={mobile ? "130" : "244"}
          height={mobile ? "101" : "189"}
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? "hidden" : "top-0 right-2/3 mr-10")
          }
          src="./star-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile
              ? " -left-8 blur-[1px] opacity-70 top-1/2 pt-5"
              : " top-3/4 left-10 mr-10")
          }
          src="./car.svg"
          width={mobile ? "175" : "487"}
          height={mobile ? "70" : "194"}
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? "hidden" : "top-0 left-2/3 top-2/3")
          }
          src="./star-3.svg"
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? "top-1/3 mt-20" : "top-1/2 left-2/3")
          }
          src="./moon.svg"
          width={mobile ? "239" : "423"}
          height={mobile ? "271" : "480"}
        />
        <img
          className={
            "absolute pointer-events-none -z-10  " +
            (mobile
              ? " -right-16 top-2/3 opacity-90 "
              : " top-0 left-2/3 mt-10")
          }
          src="./star-4.svg"
          width={mobile ? "243" : "431"}
          height={mobile ? "168" : "297"}
        />
        <img
          className={
            "absolute pointer-events-none -z-10 " +
            (mobile ? " top-0 -right-12" : " top-full right-10")
          }
          src="./star-5.svg"
          width={mobile ? "111" : "215"}
          height={mobile ? "83" : "184"}
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? "hidden" : " top-2/3 right-5")
          }
          src="./star-6.svg"
        />
        <img
          className={
            "absolute pointer-events-none z-1 top-0  " +
            (mobile ? " left-3" : " right-1/4")
          }
          src="./shootingStar.svg"
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? "hidden" : " top-1/4 left-1/4")
          }
          src="./shootingStar2.svg"
        />
        <img
          className={
            "absolute pointer-events-none z-1  " +
            (mobile ? " -left-10 top-1/3" : " bottom-0 left-1/2")
          }
          src="./shootingStar3.svg"
        />
      </section>
      {repository.id ? (
        <section className={classnames([styles.section, styles.codeSection])}>
          <div className="text-2xl mb-8">Try Gitopia Live, click around 👇</div>
          <GitopiaLive
            repository={repository}
            demoAddress={demoAddress}
            demoRepoName={demoRepoName}
            commitDetail={commitDetail}
            entityList={entityList}
            demoRepoBranch={demoRepoBranch}
          />
          <svg
            width="1600"
            height="1255"
            viewBox="0 0 1600 1255"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute opacity-90 -z-10 left-0"
          >
            <g filter="url(#filter0_f_3088_7350)">
              <path
                d="M602.835 374.359C422.202 462.498 483.833 587.576 385.1 614.729C286.368 641.882 184.318 583.856 157.165 485.123C130.012 386.391 188.038 284.341 286.771 257.188C385.503 230.035 819.345 292.857 602.835 374.359Z"
                fill="url(#paint0_radial_3088_7350)"
              />
            </g>
            <g filter="url(#filter1_f_3088_7350)">
              <path
                d="M1229.51 945.493C1139.56 765.757 1015.1 828.642 986.96 730.188C958.816 631.733 1015.81 529.105 1114.27 500.96C1212.72 472.816 1315.35 529.813 1343.49 628.267C1371.64 726.722 1313.18 1161.17 1229.51 945.493Z"
                fill="url(#paint1_radial_3088_7350)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_3088_7350"
                x="-99.5193"
                y="0.771973"
                width="1012.13"
                height="870.641"
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
                  stdDeviation="125"
                  result="effect1_foregroundBlur_3088_7350"
                />
              </filter>
              <filter
                id="filter1_f_3088_7350"
                x="729.772"
                y="243.771"
                width="870.872"
                height="1011.04"
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
                  stdDeviation="125"
                  result="effect1_foregroundBlur_3088_7350"
                />
              </filter>
              <radialGradient
                id="paint0_radial_3088_7350"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(335.936 435.958) rotate(74.6229) scale(185.408 185.408)"
              >
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
              </radialGradient>
              <radialGradient
                id="paint1_radial_3088_7350"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(1165.23 679.227) rotate(164.047) scale(185.408 185.408)"
              >
                <stop offset="0.442708" stopColor="#992D81" />
                <stop offset="1" stopColor="#6029DB" />
              </radialGradient>
            </defs>
          </svg>
        </section>
      ) : (
        ""
      )}

      <section className={classnames([styles.section, styles.circleSection])}>
        <svg width="0" height="0">
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220 220"
            //id="circle1"
          >
            <g filter="url(#filter0_ii_3088_7412)">
              <circle cx="72" cy="72" r="72" fill="#5957AA" />
            </g>
            <defs>
              <filter
                id="filter0_ii_3088_7412"
                x="-30.1224"
                y="-5.14286"
                width="177.061"
                height="149.878"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-30.1224" dy="-5.14286" />
                <feGaussianBlur stdDeviation="18.3673" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_3088_7412"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="2.93878" dy="0.734694" />
                <feGaussianBlur stdDeviation="3.67347" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.418889 0 0 0 0 0.868067 0 0 0 0 0.966667 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_innerShadow_3088_7412"
                  result="effect2_innerShadow_3088_7412"
                />
              </filter>
            </defs>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 166 166"
            id="circle2"
          >
            <g filter="url(#filter0_ii_3238_5951)">
              <circle
                r="62.5221"
                transform="matrix(-1 0 0 1 63.2716 63.4821)"
                fill="#2E3148"
              />
            </g>
            <g clipPath="url(#clip0_3238_5951)">
              <path
                d="M63.2487 90.1043C77.9644 90.1043 89.8939 78.1749 89.8939 63.4591C89.8939 48.7434 77.9644 36.814 63.2487 36.814C48.533 36.814 36.6035 48.7434 36.6035 63.4591C36.6035 78.1749 48.533 90.1043 63.2487 90.1043Z"
                fill="#1B1E36"
              />
              <path
                d="M63.3431 23.397C58.3863 23.397 54.367 41.3757 54.367 63.5538C54.367 85.7318 58.3863 103.711 63.3431 103.711C68.3 103.711 72.3193 85.7318 72.3193 63.5538C72.3193 41.3757 68.3 23.397 63.3431 23.397ZM63.9629 101.444C63.396 102.2 62.8292 101.633 62.8292 101.633C60.5464 98.9881 59.405 94.0742 59.405 94.0742C55.4122 81.2243 56.3625 53.6342 56.3625 53.6342C58.239 31.7306 61.6525 26.5563 62.8141 25.4075C62.9328 25.2903 63.0889 25.2187 63.2552 25.2052C63.4214 25.1918 63.5871 25.2374 63.723 25.3341C65.4085 26.5284 66.8221 31.523 66.8221 31.523C70.9964 47.0188 70.6184 61.5696 70.6184 61.5696C70.9964 74.2308 68.5266 88.4036 68.5266 88.4036C66.6255 99.1747 63.9629 101.444 63.9629 101.444Z"
                fill="#6F7390"
              />
              <path
                d="M98.1746 43.5701C95.7067 39.269 78.1133 44.7302 58.8668 55.7665C39.6203 66.8028 26.0441 79.237 28.5102 83.5362C30.9763 87.8354 48.5715 82.3761 67.818 71.3398C87.0645 60.3035 100.641 47.8693 98.1746 43.5701ZM30.7871 82.9462C29.8422 82.8272 30.0557 82.0506 30.0557 82.0506C31.2147 78.755 34.903 75.3194 34.903 75.3194C44.0661 65.4609 68.4722 52.5558 68.4722 52.5558C88.4031 43.2828 94.5939 43.6741 96.1644 44.1064C96.3256 44.1514 96.4657 44.252 96.5598 44.3904C96.654 44.5288 96.6961 44.696 96.6787 44.8625C96.4899 46.9197 92.8519 50.6301 92.8519 50.6301C81.496 61.9665 68.6857 68.881 68.6857 68.881C57.8915 75.5119 44.3688 80.4195 44.3688 80.4195C34.0794 84.1273 30.7874 82.9462 30.7874 82.9462H30.7871Z"
                fill="#6F7390"
              />
              <path
                d="M98.0876 83.6795C100.575 79.3898 87.0326 66.8988 67.8537 55.7794C48.6748 44.6601 31.0836 39.1313 28.5988 43.4283C26.1139 47.7254 39.6538 60.2091 58.8437 71.3284C78.0336 82.4477 95.6028 87.9769 98.0876 83.6795ZM30.2467 45.0859C29.8794 44.2148 30.6549 44.0051 30.6549 44.0051C34.0883 43.3567 38.911 44.8342 38.911 44.8342C52.0314 47.822 75.4268 62.4768 75.4268 62.4768C93.4397 75.0814 96.2023 80.6333 96.6163 82.2093C96.6584 82.371 96.6421 82.5423 96.5702 82.6931C96.4982 82.8438 96.3754 82.9643 96.2233 83.0333C94.3449 83.8933 89.3143 82.612 89.3143 82.612C73.809 78.4545 61.4087 70.8372 61.4087 70.8372C50.2669 64.8279 39.2497 55.5814 39.2497 55.5814C30.8782 48.5328 30.2493 45.0954 30.2493 45.0954L30.2467 45.0859Z"
                fill="#6F7390"
              />
              <path
                d="M63.2488 68.1834C65.8579 68.1834 67.973 66.0683 67.973 63.4591C67.973 60.85 65.8579 58.7349 63.2488 58.7349C60.6396 58.7349 58.5245 60.85 58.5245 63.4591C58.5245 66.0683 60.6396 68.1834 63.2488 68.1834Z"
                fill="#B7B9C8"
              />
              <path
                d="M82.6183 48.1521C84.1316 48.1521 85.3584 46.883 85.3584 45.3175C85.3584 43.752 84.1316 42.4829 82.6183 42.4829C81.1049 42.4829 79.8781 43.752 79.8781 45.3175C79.8781 46.883 81.1049 48.1521 82.6183 48.1521Z"
                fill="#B7B9C8"
              />
              <path
                d="M37.6428 57.7902C39.1562 57.7902 40.383 56.5212 40.383 54.9557C40.383 53.3902 39.1562 52.1211 37.6428 52.1211C36.1295 52.1211 34.9026 53.3902 34.9026 54.9557C34.9026 56.5212 36.1295 57.7902 37.6428 57.7902Z"
                fill="#B7B9C8"
              />
              <path
                d="M57.674 92.5607C59.1873 92.5607 60.4142 91.2917 60.4142 89.7262C60.4142 88.1607 59.1873 86.8916 57.674 86.8916C56.1606 86.8916 54.9338 88.1607 54.9338 89.7262C54.9338 91.2917 56.1606 92.5607 57.674 92.5607Z"
                fill="#B7B9C8"
              />
            </g>
            <defs>
              <filter
                id="filter0_ii_3238_5951"
                x="-3.91632"
                y="-1.83954"
                width="129.71"
                height="127.843"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-4.66583" dy="-2.7995" />
                <feGaussianBlur stdDeviation="7.46532" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_3238_5951"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-4.66583" dy="-2.7995" />
                <feGaussianBlur stdDeviation="7.46532" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.255903 0 0 0 0 0.321979 0 0 0 0 0.916667 0 0 0 0.15 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_innerShadow_3238_5951"
                  result="effect2_innerShadow_3238_5951"
                />
              </filter>
              <clipPath id="clip0_3238_5951">
                <rect
                  width="70.3951"
                  height="80.4829"
                  fill="white"
                  transform="translate(28.0741 23.2407)"
                />
              </clipPath>
            </defs>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 267 246"
            id="circle3"
          >
            <path
              d="M210.501 195.291C244.244 152.488 234.061 88.1983 187.758 51.6954C141.454 15.1924 76.5631 20.2994 42.8201 63.1022C9.07711 105.905 19.2596 170.195 65.5634 206.698C111.867 243.201 176.758 238.094 210.501 195.291Z"
              fill="#291D40"
            />
            <path
              d="M216.654 188.677C250.293 146.006 240.142 81.913 193.981 45.5221C147.819 9.13124 83.1275 14.2226 49.4881 56.8939C15.8487 99.5653 26 163.658 72.1616 200.049C118.323 236.44 183.015 231.348 216.654 188.677Z"
              fill="url(#paint0_linear_3122_5674)"
            />
            <path
              d="M193.976 45.5284C240.134 81.9166 250.285 146.004 216.648 188.673C183.011 231.341 118.324 236.432 72.166 200.044C26.0078 163.655 15.8573 99.5676 49.4942 56.8994C83.1311 14.2311 147.818 9.14017 193.976 45.5284Z"
              stroke="#F8E4FF"
              strokeWidth="0.646439"
            />
            <path
              d="M227.095 135.56C230.318 84.9737 190.841 38.2542 138.922 31.2094C87.0033 24.1646 42.302 59.4623 39.0792 110.049C35.8564 160.635 75.3326 207.355 127.252 214.4C179.171 221.445 223.872 186.147 227.095 135.56Z"
              fill="url(#paint1_linear_3122_5674)"
            />
            <path
              d="M108.522 101.142L121.911 100.088L120.195 89.2508M103.356 117.718L124.441 116.058L125.897 125.252M121.826 100.003L124.566 101.985C123.14 103.679 122.449 105.83 122.809 108.102C123.168 110.374 124.516 112.365 126.436 113.795L124.385 116.155"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M148.988 97.9578L135.598 99.0115L133.882 88.174M159.212 113.322L138.128 114.982L139.584 124.175M135.654 98.9151L133.602 101.275C135.523 102.705 136.87 104.696 137.23 106.968C137.59 109.24 136.899 111.391 135.473 113.085L138.212 115.067"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M122.801 89.3008L124.221 98.2661C126.766 100.089 130.265 99.8136 132.177 97.6399L130.757 88.6746"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M128.925 127.963L127.505 118.998C129.417 116.824 132.915 116.549 135.461 118.372L136.881 127.337"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M107.461 119.307L122.534 118.121L123.622 124.99"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M155.705 115.51L140.632 116.697L141.72 123.565"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M124.822 90.5981L125.746 96.4378C127.177 97.643 129.099 97.4918 130.117 96.0939L129.192 90.2542"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M130.49 126.385L129.565 120.545C130.583 119.147 132.505 118.996 133.935 120.201L134.86 126.041"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M110.276 103.824L120.147 103.047C119.108 104.522 118.632 106.406 118.949 108.407C119.266 110.407 120.32 112.171 121.794 113.448L109.417 114.422"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M148.116 100.847L138.245 101.623C139.719 102.9 140.773 104.664 141.09 106.664C141.407 108.665 140.93 110.549 139.892 112.024L152.268 111.049"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M104.812 99.2341L119.361 98.089L118.493 92.6074"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M152.008 95.5197L137.459 96.6647L136.591 91.1831"
              stroke="#F7CE69"
              strokeWidth="0.969658"
            />
            <path
              d="M227.516 135.623C230.75 84.8467 191.127 37.9524 139.013 30.8813C86.8999 23.8102 42.0314 59.2399 38.7965 110.016C35.5617 160.792 75.1855 207.686 127.299 214.757C179.412 221.828 224.281 186.398 227.516 135.623Z"
              fill="url(#paint2_linear_3122_5674)"
            />
            <path
              d="M210.926 122.095L210.924 122.082L211.748 122.017L210.926 122.095Z"
              fill="url(#paint3_linear_3122_5674)"
            />
            <path
              d="M189.112 51.6981C231.584 85.1804 240.924 144.15 209.973 183.411C179.022 222.672 119.502 227.356 77.0296 193.874C34.5576 160.392 25.2177 101.422 56.1683 62.161C87.119 22.9002 146.64 18.2159 189.112 51.6981Z"
              stroke="#1B1229"
              strokeWidth="1.93932"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M122.891 86.3467L131.504 85.6689L132.643 92.8629C141.362 94.1653 148.8 101.133 150.21 110.036C151.857 120.437 144.654 129.54 134.122 130.369C123.59 131.198 113.716 123.439 112.069 113.038C110.647 104.064 115.814 96.0559 124.023 93.495L122.891 86.3467ZM141.963 110.685C142.898 116.588 138.81 121.755 132.832 122.225C126.854 122.696 121.25 118.292 120.315 112.389C119.38 106.485 123.468 101.319 129.446 100.848C135.424 100.378 141.028 104.782 141.963 110.685ZM144.301 141.472C142.486 143.765 139.758 145.187 136.717 145.426C133.676 145.666 130.57 144.702 128.083 142.748C125.597 140.794 123.932 138.008 123.457 135.005L115.812 135.607C116.605 140.612 119.379 145.254 123.523 148.512C126.443 150.806 129.874 152.281 133.418 152.813L134.566 160.059L143.179 159.382L142.039 152.184C145.416 151.13 148.377 149.132 150.552 146.384C153.575 142.563 154.828 137.604 154.036 132.598L146.391 133.2C146.866 136.203 146.115 139.179 144.301 141.472Z"
              fill="#F6DEFF"
            />
            <path
              d="M211.338 124.732L179.74 127.219C179.377 147.312 165.43 164.027 145.38 167.869L147.222 179.5C171.635 175.395 189.15 156.361 191.364 132.624L212.642 130.949M208.853 109.041L177.285 111.525C170.689 91.8725 151.769 77.6475 130.922 77.046L129.08 65.417C131.354 65.4331 133.611 65.5775 135.843 65.8438C158.346 68.5288 178.279 83.6061 186.96 104.477L207.734 102.843"
              stroke="url(#paint4_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M196.695 103.711C196.528 102.653 197.257 101.728 198.325 101.644L201.38 101.403C202.447 101.319 203.449 102.109 203.616 103.167C203.784 104.225 203.054 105.15 201.986 105.234L198.932 105.475C197.864 105.559 196.863 104.769 196.695 103.711Z"
              fill="url(#paint5_linear_3122_5674)"
            />
            <path
              d="M118.896 66.2249C89.7843 71.1195 70.5226 97.4978 75.2604 127.411C79.9983 157.325 107.039 180.059 136.965 180.307L135.123 168.677C111.667 167.964 90.6669 150.008 86.9423 126.492C83.2177 102.976 98.0825 82.1975 120.738 77.8555L118.896 66.2249Z"
              stroke="url(#paint6_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              d="M213.253 137.168L203.49 137.936C199.217 167.138 175.737 189.982 144.084 192.473C107.539 195.349 73.1326 170.069 64.1647 135.002L76.8443 134.004M207.785 96.6503L197.171 97.4857C183.933 69.5159 153.791 50.7542 122.034 53.2535C85.443 56.1333 59.7743 86.2115 62.0717 121.868L73.7123 120.952"
              stroke="url(#paint7_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              d="M145.677 202.526C101.269 206.021 59.62 173.188 52.6516 129.191C45.6832 85.194 76.0339 46.6944 120.442 43.1994C157.718 40.2657 193.053 62.9302 207.56 96.3097L214.034 137.179C210.327 171.992 182.953 199.592 145.677 202.526Z"
              stroke="url(#paint8_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M120.703 44.9346C119.408 45.0366 118.125 45.1689 116.855 45.3309C115.807 45.4646 114.782 44.7281 114.565 43.6859C114.348 42.6437 115.022 41.6905 116.07 41.5568C117.401 41.387 118.745 41.2483 120.102 41.1415C121.398 41.0395 122.692 40.9677 123.983 40.9255C125.047 40.8906 126.004 41.7137 126.121 42.7639C126.238 43.814 125.471 44.6936 124.407 44.7284C123.175 44.7687 121.94 44.8373 120.703 44.9346ZM129.891 42.8133C129.874 41.7645 130.727 40.9655 131.797 41.0287C134.427 41.1841 137.038 41.4601 139.623 41.8516C140.69 42.0132 141.487 42.9859 141.404 44.0241C141.32 45.0623 140.388 45.773 139.321 45.6114C136.857 45.2382 134.368 44.975 131.86 44.8268C130.79 44.7636 129.908 43.8621 129.891 42.8133ZM110.561 44.3977C110.879 45.4219 110.309 46.4424 109.287 46.6772C106.779 47.2532 104.332 47.9489 101.95 48.7575C100.964 49.092 99.8271 48.5557 99.41 47.5596C98.993 46.5635 99.4538 45.4849 100.439 45.1504C102.938 44.3022 105.506 43.5725 108.135 42.9683C109.157 42.7336 110.243 43.3735 110.561 44.3977ZM145.149 44.7664C145.333 43.7481 146.337 43.1324 147.391 43.3912C149.975 44.0255 152.524 44.7752 155.032 45.6345C156.064 45.9882 156.672 47.0771 156.39 48.0665C156.107 49.0559 155.042 49.5712 154.009 49.2175C151.619 48.3983 149.188 47.6836 146.726 47.079C145.671 46.8201 144.966 45.7848 145.149 44.7664ZM95.6875 49.0403C96.2 49.9985 95.8537 51.1248 94.9142 51.5561C92.6167 52.6107 90.3928 53.7765 88.2484 55.0463C87.364 55.57 86.1586 55.2561 85.556 54.3451C84.9534 53.4342 85.1818 52.2712 86.0662 51.7475C88.3156 50.4156 90.6484 49.1927 93.0586 48.0863C93.9981 47.655 95.1751 48.0822 95.6875 49.0403ZM159.982 49.4779C160.36 48.5261 161.478 48.1154 162.479 48.5605C164.926 49.6488 167.324 50.8438 169.665 52.1397C170.626 52.6719 171.024 53.8378 170.554 54.7438C170.084 55.6497 168.924 55.9526 167.962 55.4204C165.73 54.1845 163.444 53.0449 161.11 52.0072C160.109 51.5621 159.603 50.4296 159.982 49.4779ZM82.2587 56.5388C82.9453 57.3938 82.8364 58.582 82.0156 59.1927C80.0127 60.6827 78.0969 62.2718 76.2742 63.9526C75.5245 64.644 74.2976 64.5631 73.534 63.7719C72.7704 62.9807 72.7592 61.7788 73.5089 61.0874C75.42 59.3251 77.4288 57.6587 79.5292 56.0962C80.3501 55.4856 81.5722 55.6837 82.2587 56.5388ZM173.865 56.769C174.422 55.9166 175.615 55.7238 176.528 56.3382C178.757 57.8376 180.921 59.4329 183.012 61.1184C183.869 61.8095 184.045 63.0113 183.405 63.8028C182.764 64.5942 181.55 64.6755 180.693 63.9844C178.698 62.3767 176.634 60.855 174.509 59.4248C173.595 58.8104 173.307 57.6213 173.865 56.769ZM70.7854 66.5888C71.6185 67.3088 71.7494 68.5129 71.0777 69.2781C69.4416 71.1422 67.9053 73.091 66.4747 75.117C65.8874 75.9488 64.686 76.1027 63.7915 75.4606C62.8969 74.8186 62.6478 73.6239 63.2351 72.7921C64.7349 70.6681 66.3455 68.625 68.0608 66.6708C68.7324 65.9055 69.9523 65.8688 70.7854 66.5888ZM186.321 66.3688C187.039 65.6451 188.264 65.6761 189.058 66.4379C190.993 68.294 192.848 70.234 194.616 72.2521C195.339 73.0781 195.287 74.2742 194.498 74.9236C193.71 75.5729 192.484 75.4297 191.761 74.6037C190.075 72.679 188.305 70.8288 186.46 69.0584C185.666 68.2966 185.604 67.0924 186.321 66.3688ZM61.694 78.7909C62.6416 79.3487 63.0067 80.5227 62.5094 81.4132C61.3005 83.5779 60.2025 85.8117 59.2213 88.1071C58.8192 89.0478 57.6892 89.4311 56.6975 88.9631C55.7058 88.4951 55.2278 87.353 55.63 86.4123C56.659 84.0052 57.8103 81.6628 59.0778 79.3932C59.5751 78.5027 60.7464 78.2331 61.694 78.7909ZM196.918 77.9418C197.771 77.3727 198.986 77.6274 199.633 78.5106C201.205 80.6584 202.685 82.8772 204.065 85.1612C204.628 86.0941 204.347 87.2423 203.438 87.7258C202.528 88.2093 201.333 87.845 200.77 86.9122C199.455 84.7348 198.044 82.6194 196.545 80.5716C195.898 79.6883 196.065 78.511 196.918 77.9418ZM55.3342 92.6813C56.3606 93.0546 56.9473 94.1534 56.6445 95.1356C55.9104 97.5173 55.296 99.9518 54.8068 102.432C54.6068 103.446 53.5924 104.046 52.5411 103.771C51.4898 103.497 50.7997 102.452 50.9997 101.438C51.5129 98.8358 52.1574 96.282 52.9275 93.7838C53.2302 92.8016 54.3077 92.308 55.3342 92.6813ZM51.9703 107.737C53.0362 107.91 53.8231 108.89 53.728 109.926C53.4979 112.432 53.3928 114.974 53.418 117.547C53.4283 118.595 52.5691 119.388 51.499 119.318C50.4289 119.248 49.5531 118.341 49.5428 117.293C49.5163 114.595 49.6266 111.928 49.8679 109.3C49.9631 108.263 50.9044 107.564 51.9703 107.737ZM51.7415 123.377C52.8055 123.345 53.761 124.17 53.8756 125.22C54.0146 126.493 54.1854 127.771 54.3886 129.054C54.5919 130.337 54.8252 131.611 55.0879 132.874C55.3046 133.916 54.6308 134.869 53.5828 135.003C52.5348 135.137 51.5096 134.4 51.2928 133.358C51.0175 132.034 50.773 130.7 50.5601 129.355C50.3472 128.011 50.1682 126.672 50.0226 125.338C49.9079 124.287 50.6775 123.41 51.7415 123.377ZM54.6163 139C55.6381 138.765 56.7242 139.405 57.0422 140.429C57.8225 142.942 58.7205 145.406 59.7287 147.813C60.1458 148.81 59.685 149.888 58.6994 150.223C57.7139 150.557 56.5768 150.021 56.1598 149.025C55.1021 146.499 54.1602 143.915 53.3419 141.279C53.0239 140.255 53.5945 139.235 54.6163 139ZM60.4968 154.002C61.4363 153.57 62.6133 153.997 63.1257 154.956C64.3788 157.299 65.7398 159.578 67.201 161.787C67.8036 162.698 67.5752 163.861 66.6908 164.384C65.8064 164.908 64.601 164.594 63.9984 163.683C62.4658 161.366 61.0381 158.975 59.7235 156.517C59.2111 155.559 59.5573 154.433 60.4968 154.002ZM212.698 146.193C213.736 146.523 214.37 147.599 214.112 148.597C213.481 151.039 212.732 153.433 211.87 155.773C211.516 156.735 210.41 157.172 209.4 156.749C208.39 156.327 207.859 155.204 208.213 154.242C209.035 152.012 209.749 149.729 210.35 147.401C210.608 146.404 211.659 145.863 212.698 146.193ZM69.1839 167.799C70.0048 167.188 71.2268 167.387 71.9134 168.242C73.5886 170.328 75.3585 172.336 77.2149 174.259C77.9785 175.051 77.9897 176.253 77.24 176.944C76.4902 177.635 75.2634 177.554 74.4998 176.763C72.5533 174.747 70.6975 172.641 68.9407 170.453C68.2541 169.598 68.363 168.41 69.1839 167.799ZM207.984 160.07C208.956 160.58 209.382 161.739 208.934 162.657C207.841 164.9 206.639 167.081 205.333 169.192C204.797 170.059 203.611 170.279 202.685 169.685C201.759 169.091 201.443 167.906 201.979 167.04C203.225 165.026 204.372 162.947 205.414 160.807C205.861 159.889 207.012 159.559 207.984 160.07ZM80.3277 179.866C80.9994 179.101 82.2193 179.064 83.0524 179.784C85.0816 181.538 87.1898 183.2 89.3688 184.764C90.2634 185.406 90.5125 186.6 89.9252 187.432C89.3378 188.264 88.1365 188.418 87.2419 187.776C84.9575 186.136 82.7474 184.394 80.6199 182.555C79.7868 181.835 79.656 180.631 80.3277 179.866ZM200.643 172.641C201.515 173.314 201.72 174.513 201.099 175.321C199.587 177.29 197.976 179.182 196.271 180.991C195.573 181.732 194.349 181.73 193.539 180.985C192.728 180.24 192.637 179.036 193.336 178.294C194.962 176.569 196.499 174.764 197.941 172.886C198.561 172.078 199.771 171.969 200.643 172.641ZM93.4874 189.752C93.9847 188.862 95.156 188.592 96.1036 189.15C98.4073 190.506 100.773 191.758 103.193 192.9C104.184 193.368 104.662 194.51 104.26 195.451C103.858 196.392 102.728 196.775 101.736 196.307C99.1989 195.11 96.7182 193.797 94.3028 192.375C93.3552 191.817 92.9901 190.643 93.4874 189.752ZM190.943 183.475C191.685 184.286 191.662 185.485 190.89 186.153C189.013 187.781 187.048 189.319 185.001 190.761C184.164 191.351 182.945 191.124 182.278 190.255C181.612 189.385 181.75 188.202 182.587 187.612C184.539 186.237 186.413 184.77 188.203 183.218C188.975 182.549 190.201 182.664 190.943 183.475ZM108.163 197.078C108.465 196.096 109.543 195.602 110.569 195.976C113.058 196.881 115.592 197.672 118.163 198.344C119.214 198.618 119.904 199.663 119.704 200.677C119.504 201.691 118.49 202.291 117.439 202.016C114.742 201.312 112.084 200.482 109.473 199.532C108.447 199.159 107.86 198.06 108.163 197.078ZM179.217 192.19C179.801 193.111 179.549 194.268 178.653 194.773C176.476 196.001 174.224 197.129 171.902 198.149C170.955 198.565 169.783 198.121 169.285 197.156C168.788 196.192 169.152 195.072 170.099 194.656C172.312 193.683 174.459 192.608 176.535 191.437C177.431 190.932 178.632 191.269 179.217 192.19ZM123.799 201.543C123.894 200.506 124.835 199.806 125.901 199.979C128.478 200.398 131.082 200.696 133.708 200.868C134.779 200.938 135.654 201.845 135.665 202.893C135.675 203.941 134.816 204.735 133.746 204.664C130.992 204.484 128.259 204.171 125.556 203.733C124.49 203.56 123.703 202.579 123.799 201.543ZM165.865 198.463C166.271 199.462 165.797 200.535 164.807 200.858C162.408 201.642 159.948 202.317 157.432 202.878C156.408 203.106 155.325 202.459 155.014 201.433C154.703 200.408 155.28 199.391 156.304 199.163C158.704 198.629 161.05 197.985 163.336 197.238C164.326 196.915 165.458 197.463 165.865 198.463ZM139.792 202.965C139.678 201.915 140.447 201.037 141.511 201.004C142.801 200.965 144.093 200.895 145.389 200.793C146.626 200.695 147.852 200.57 149.066 200.418C150.114 200.287 151.138 201.025 151.352 202.068C151.567 203.11 150.891 204.062 149.842 204.193C148.57 204.353 147.285 204.484 145.989 204.586C144.632 204.693 143.278 204.766 141.926 204.808C140.862 204.84 139.907 204.015 139.792 202.965Z"
              fill="url(#paint9_linear_3122_5674)"
            />
            <path
              d="M138.563 192.019L137.715 186.67C111 186.69 86.2695 170.534 74.7004 147.013L68.6488 147.489M149.782 191.136L148.921 185.699C167.446 182.456 182.333 171.356 190.595 156.187L184.379 152.434M62.3557 115.135L67.9331 114.696C69.4929 85.4342 91.8472 61.8004 122.717 59.3709C144.692 57.6415 165.819 67.0635 180.022 82.8451L175.742 87.1454"
              stroke="url(#paint10_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M158.797 64.7575C159.724 65.2197 160.119 66.3161 159.692 67.1798C159.266 68.0434 158.18 68.3472 157.253 67.8864C155.831 67.1793 154.384 66.5204 152.915 65.912C151.962 65.517 151.425 64.475 151.728 63.5551C152.031 62.6352 153.058 62.1859 154.012 62.5794C155.634 63.2483 157.23 63.9752 158.797 64.7575ZM141.939 58.7998C142.937 59.0174 143.603 59.9964 143.429 60.9568C143.256 61.9173 142.31 62.4953 141.311 62.2792C139.784 61.9489 138.242 61.6718 136.688 61.4497C135.681 61.3058 134.896 60.4171 134.937 59.4329C134.978 58.4486 135.828 57.7417 136.835 57.884C138.551 58.1265 140.253 58.4326 141.939 58.7998Z"
              fill="url(#paint11_linear_3122_5674)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M179.611 139.676C179.944 138.768 179.41 137.721 178.448 137.349C177.486 136.977 176.461 137.421 176.127 138.329C175.615 139.721 175.048 141.094 174.427 142.442C174.024 143.318 174.414 144.412 175.327 144.901C176.241 145.39 177.332 145.089 177.736 144.214C178.423 142.727 179.049 141.213 179.611 139.676Z"
              fill="url(#paint12_linear_3122_5674)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M105.559 54.6221C106.579 54.3013 107.723 54.9084 108.101 55.9465C108.478 56.9847 107.947 58.0605 106.927 58.3829C105.36 58.8781 103.826 59.4291 102.324 60.0335C101.337 60.4308 100.136 59.9762 99.6256 58.9856C99.1156 57.9949 99.4897 56.8435 100.476 56.4446C102.133 55.7746 103.828 55.1661 105.559 54.6221ZM88.9635 62.4723C89.8432 61.8944 91.086 62.1992 91.7194 63.1253C92.3527 64.0514 92.1368 65.2478 91.258 65.8272C89.9122 66.7146 88.6064 67.6513 87.3428 68.6345C86.5146 69.279 85.2582 69.1381 84.513 68.2922C83.7677 67.4463 83.816 66.2159 84.6431 65.5701C86.0354 64.4829 87.4764 63.4493 88.9635 62.4723Z"
              fill="url(#paint13_linear_3122_5674)"
            />
            <path
              d="M111.713 141.935L105.669 147.725C99.988 141.756 96.1952 134.334 94.8263 126.478C93.4575 118.622 94.5831 110.736 98.0343 103.906L105.867 108.388C103.271 113.628 102.434 119.656 103.48 125.662C104.526 131.667 107.404 137.345 111.713 141.935Z"
              stroke="url(#paint14_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <path
              d="M160.64 138.084L168.346 142.792C172.02 136.086 173.398 128.257 172.275 120.382C171.152 112.507 167.587 104.99 162.084 98.8645L155.846 104.454C160.017 109.162 162.721 114.911 163.579 120.932C164.437 126.952 163.407 132.937 160.64 138.084Z"
              stroke="url(#paint15_linear_3122_5674)"
              strokeWidth="1.93932"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3122_5674"
                x1="-23.4782"
                y1="-11.2277"
                x2="238.294"
                y2="175.91"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D55FFF" />
                <stop offset="1" stopColor="#4230B1" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_3122_5674"
                x1="202.278"
                y1="50.615"
                x2="88.2751"
                y2="244.971"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#995C08" />
                <stop offset="1" stopColor="#683811" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_3122_5674"
                x1="-99.3042"
                y1="105.845"
                x2="328.748"
                y2="96.7126"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F2450" />
                <stop offset="1" stopColor="#1E1024" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_3122_5674"
                x1="183.535"
                y1="118.224"
                x2="249.73"
                y2="122.6"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#DC9327" />
                <stop offset="0.04" stopColor="#E8B744" />
                <stop offset="0.08" stopColor="#F2D35B" />
                <stop offset="0.12" stopColor="#F9E76B" />
                <stop offset="0.16" stopColor="#FEF375" />
                <stop offset="0.2" stopColor="#FFF778" />
                <stop offset="0.28" stopColor="#EAC34A" />
                <stop offset="0.34" stopColor="#D99A26" />
                <stop offset="0.36" stopColor="#CB8E24" />
                <stop offset="0.4" stopColor="#B77E21" />
                <stop offset="0.43" stopColor="#AB741F" />
                <stop offset="0.47" stopColor="#A7711E" />
                <stop offset="0.51" stopColor="#AB7622" />
                <stop offset="0.56" stopColor="#B8852E" />
                <stop offset="0.61" stopColor="#CD9E42" />
                <stop offset="0.66" stopColor="#EBC15E" />
                <stop offset="0.68" stopColor="#F6CE69" />
                <stop offset="0.72" stopColor="#F3C962" />
                <stop offset="0.78" stopColor="#EBBA4F" />
                <stop offset="0.85" stopColor="#DEA231" />
                <stop offset="0.87" stopColor="#D99A26" />
                <stop offset="1" stopColor="#F6CE69" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_3122_5674"
                x1="157.32"
                y1="-10.0624"
                x2="280.836"
                y2="150.017"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_3122_5674"
                x1="183.924"
                y1="95.5419"
                x2="216.339"
                y2="103.939"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_3122_5674"
                x1="83.695"
                y1="-4.25764"
                x2="216.449"
                y2="119.868"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_3122_5674"
                x1="119.305"
                y1="-35.9252"
                x2="234.976"
                y2="207.746"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_3122_5674"
                x1="110.641"
                y1="-60.533"
                x2="250.26"
                y2="216.386"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint9_linear_3122_5674"
                x1="108.351"
                y1="-62.8821"
                x2="251.782"
                y2="215.916"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint10_linear_3122_5674"
                x1="107.697"
                y1="-24.3634"
                x2="227.682"
                y2="197.05"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint11_linear_3122_5674"
                x1="121.426"
                y1="48.8497"
                x2="189.133"
                y2="83.377"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint12_linear_3122_5674"
                x1="176.618"
                y1="158.831"
                x2="179.641"
                y2="126.211"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.161458" stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint13_linear_3122_5674"
                x1="67.4953"
                y1="46.5124"
                x2="176.96"
                y2="52.114"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint14_linear_3122_5674"
                x1="94.5765"
                y1="72.915"
                x2="148.105"
                y2="110.454"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint15_linear_3122_5674"
                x1="155.76"
                y1="68.0994"
                x2="116.1"
                y2="113.736"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </symbol>

          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 169 156"
            id="circle4"
          >
            <g opacity="0.5" filter="url(#filter0_f_3122_5856)">
              <path
                d="M35.1153 123.305C13.8109 96.2806 20.2398 55.6896 49.4748 32.6426C78.7098 9.59564 119.68 12.8201 140.984 39.8446C162.289 66.8691 155.86 107.46 126.625 130.507C97.39 153.554 56.4197 150.33 35.1153 123.305Z"
                fill="#291D40"
              />
              <path
                d="M31.2305 119.129C9.99146 92.1878 16.4007 51.7214 45.5459 28.7452C74.6911 5.76899 115.536 8.98352 136.775 35.9251C158.014 62.8666 151.604 103.333 122.459 126.309C93.3139 149.285 52.4695 146.071 31.2305 119.129Z"
                fill="url(#paint0_linear_3122_5856)"
              />
              <path
                d="M45.5487 28.7486C16.4057 51.7232 9.99691 92.1865 31.2344 119.126C52.4718 146.066 93.3133 149.28 122.456 126.305C151.599 103.331 158.008 62.8675 136.771 35.928C115.533 8.98839 74.6918 5.7741 45.5487 28.7486Z"
                stroke="#F8E4FF"
                strokeWidth="0.408144"
              />
              <path
                d="M24.6384 85.5929C22.6036 53.6539 47.5278 24.1565 80.3081 19.7086C113.088 15.2607 141.312 37.5467 143.346 69.4857C145.381 101.425 120.457 130.922 87.6767 135.37C54.8964 139.818 26.6732 117.532 24.6384 85.5929Z"
                fill="url(#paint1_linear_3122_5856)"
              />
              <path
                d="M99.5024 63.862L91.0486 63.1967L92.1324 56.3542M102.764 74.3275L89.4516 73.2798L88.5322 79.0845M91.1021 63.1428L89.3726 64.3944C90.2729 65.4636 90.7092 66.8219 90.482 68.2565C90.2548 69.6911 89.4042 70.9481 88.1916 71.851L89.4869 73.3407"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M73.9532 61.8513L82.407 62.5167L83.4907 55.6741M67.4979 71.5521L80.81 72.5998L79.8906 78.4044M82.3717 62.4558L83.6671 63.9454C82.4544 64.8484 81.6038 66.1054 81.3766 67.54C81.1494 68.9746 81.5857 70.3329 82.486 71.4021L80.7565 72.6536"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M90.4867 56.3857L89.5902 62.0462C87.9831 63.1971 85.7743 63.0232 84.5669 61.6508L85.4634 55.9904"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M86.6205 80.7959L87.517 75.1355C86.3096 73.7631 84.1008 73.5892 82.4938 74.7401L81.5972 80.4006"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M100.172 75.3306L90.6552 74.5816L89.9683 78.9184"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M69.712 72.9336L79.2287 73.6826L78.5419 78.0194"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M89.2111 57.2046L88.6271 60.8916C87.7239 61.6526 86.5105 61.5571 85.8676 60.6744L86.4516 56.9874"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M85.6324 79.7993L86.2164 76.1123C85.5735 75.2297 84.3602 75.1342 83.457 75.8951L82.873 79.5821"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M98.3949 65.5557L92.1626 65.0652C92.8182 65.9959 93.1189 67.1855 92.9188 68.4488C92.7187 69.7121 92.0533 70.8256 91.1226 71.6315L98.9368 72.2465"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M74.5038 63.6753L80.736 64.1658C79.8054 64.9717 79.1399 66.0852 78.9398 67.3485C78.7397 68.6118 79.0404 69.8013 79.696 70.7321L71.8818 70.1171"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M101.844 62.6567L92.6585 61.9338L93.2067 58.4729"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M72.0461 60.312L81.2319 61.035L81.7801 57.574"
                stroke="#F7CE69"
                strokeWidth="0.612216"
              />
              <path
                d="M24.3727 85.6321C22.3304 53.5736 47.3478 23.9658 80.2507 19.5013C113.154 15.0367 141.482 37.4061 143.525 69.4646C145.567 101.523 120.55 131.131 87.6469 135.595C54.7439 140.06 26.4151 117.691 24.3727 85.6321Z"
                fill="url(#paint2_linear_3122_5856)"
              />
              <path
                d="M34.8468 77.0913L34.8481 77.083L34.3279 77.0421L34.8468 77.0913Z"
                fill="url(#paint3_linear_3122_5856)"
              />
              <path
                d="M48.6198 32.6448C21.8042 53.7846 15.9072 91.0165 35.4486 115.805C54.99 140.593 92.5699 143.55 119.386 122.411C146.201 101.271 152.098 64.0389 132.557 39.2508C113.015 14.4626 75.4355 11.505 48.6198 32.6448Z"
                stroke="#1B1229"
                strokeWidth="1.22443"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M90.4299 54.5211L84.992 54.0932L84.2727 58.635C78.7679 59.4573 74.072 63.8565 73.1817 69.4775C72.1416 76.0444 76.6893 81.792 83.3391 82.3154C89.989 82.8387 96.2229 77.9396 97.263 71.3728C98.1603 65.707 94.8982 60.651 89.7151 59.0341L90.4299 54.5211ZM78.3885 69.8873C77.7981 73.6145 80.3793 76.8766 84.1535 77.1736C87.9277 77.4707 91.4659 74.6901 92.0562 70.963C92.6465 67.2359 90.0654 63.9737 86.2912 63.6767C82.517 63.3796 78.9788 66.1602 78.3885 69.8873ZM76.9126 89.3254C78.058 90.773 79.7803 91.6711 81.7005 91.8223C83.6207 91.9734 85.5815 91.3652 87.1516 90.1312C88.7218 88.8972 89.7726 87.1387 90.0729 85.2425L94.8996 85.6224C94.3991 88.7827 92.6477 91.7136 90.0308 93.7702C88.1876 95.2186 86.0214 96.1499 83.7833 96.4859L83.0586 101.061L77.6208 100.633L78.3406 96.0889C76.2084 95.4235 74.3385 94.162 72.9658 92.4271C71.0569 90.0143 70.2656 86.8833 70.7662 83.7231L75.5929 84.1029C75.2925 85.999 75.7672 87.8777 76.9126 89.3254Z"
                fill="#F6DEFF"
              />
              <path
                d="M34.5867 78.7563L54.5371 80.3264C54.766 93.0127 63.5723 103.566 76.231 105.992L75.0679 113.335C59.6541 110.743 48.5961 98.7255 47.198 83.7389L33.7635 82.6816M36.1559 68.8491L56.0873 70.4178C60.2518 58.0095 72.1971 49.0282 85.3593 48.6484L86.5222 41.3062C85.0866 41.3163 83.6616 41.4075 82.2526 41.5756C68.0447 43.2709 55.4593 52.7903 49.9784 65.9679L36.8626 64.9356"
                stroke="url(#paint4_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M43.832 65.4843C43.9378 64.8163 43.4771 64.2319 42.8029 64.1788L40.8744 64.0271C40.2002 63.974 39.568 64.4724 39.4622 65.1403C39.3564 65.8083 39.8172 66.3927 40.4913 66.4458L42.4198 66.5975C43.094 66.6506 43.7262 66.1522 43.832 65.4843Z"
                fill="url(#paint5_linear_3122_5856)"
              />
              <path
                d="M92.9523 41.8159C111.333 44.9062 123.494 61.5608 120.503 80.4474C117.511 99.334 100.439 113.688 81.5441 113.844L82.7071 106.501C97.5168 106.051 110.775 94.7145 113.127 79.8669C115.479 65.0193 106.093 51.9006 91.7892 49.1592L92.9523 41.8159Z"
                stroke="url(#paint6_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                d="M33.3777 86.6077L39.5417 87.0928C42.24 105.53 57.0644 119.953 77.0492 121.526C100.123 123.342 121.846 107.381 127.508 85.2403L119.503 84.6102M36.8301 61.0259L43.5317 61.5533C51.8899 43.894 70.9207 32.0483 90.9711 33.6263C114.074 35.4445 130.28 54.4351 128.83 76.9478L121.48 76.3694"
                stroke="url(#paint7_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                d="M76.0438 127.873C104.082 130.08 130.378 109.35 134.777 81.5716C139.177 53.7932 120.014 29.4856 91.9764 27.279C68.4409 25.4267 46.1314 39.7364 36.972 60.8113L32.885 86.6153C35.2252 108.595 52.5083 126.021 76.0438 127.873Z"
                stroke="url(#paint8_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M91.8113 28.3743C92.6291 28.4386 93.4391 28.5222 94.2409 28.6245C94.9026 28.7089 95.5499 28.2439 95.6867 27.5858C95.8236 26.9278 95.3981 26.326 94.7365 26.2416C93.8961 26.1344 93.0474 26.0468 92.1906 25.9794C91.3723 25.915 90.5554 25.8696 89.7403 25.843C89.0687 25.821 88.4644 26.3407 88.3905 27.0037C88.3167 27.6668 88.8013 28.2221 89.4729 28.244C90.2506 28.2695 91.0302 28.3128 91.8113 28.3743ZM86.0103 27.0349C86.0212 26.3727 85.4824 25.8682 84.8068 25.9082C83.1462 26.0063 81.4978 26.1805 79.8657 26.4277C79.1921 26.5297 78.6887 27.1439 78.7414 27.7994C78.7941 28.4549 79.3828 28.9036 80.0564 28.8015C81.6122 28.5659 83.1838 28.3997 84.7672 28.3062C85.4428 28.2663 85.9993 27.6971 86.0103 27.0349ZM98.2145 28.0352C98.0137 28.6819 98.374 29.3262 99.0191 29.4745C100.602 29.8382 102.148 30.2774 103.652 30.7879C104.274 30.9991 104.992 30.6605 105.255 30.0316C105.519 29.4027 105.228 28.7217 104.605 28.5105C103.027 27.9749 101.407 27.5142 99.7462 27.1328C99.101 26.9846 98.4153 27.3886 98.2145 28.0352ZM76.3766 28.268C76.2606 27.6251 75.627 27.2363 74.9614 27.3998C73.3301 27.8003 71.7205 28.2736 70.1371 28.8162C69.4854 29.0395 69.1016 29.7269 69.2798 30.3516C69.458 30.9763 70.1309 31.3017 70.7826 31.0783C72.2921 30.5611 73.8264 30.1099 75.3814 29.7281C76.0471 29.5647 76.4926 28.911 76.3766 28.268ZM107.605 30.9665C107.282 31.5714 107.501 32.2826 108.094 32.5549C109.544 33.2207 110.948 33.9568 112.302 34.7585C112.861 35.0891 113.622 34.8909 114.002 34.3158C114.383 33.7406 114.238 33.0064 113.68 32.6757C112.26 31.8348 110.787 31.0627 109.265 30.3641C108.672 30.0918 107.929 30.3615 107.605 30.9665ZM67.012 31.2427C66.7733 30.6418 66.0673 30.3825 65.4352 30.6635C63.8899 31.3507 62.376 32.1051 60.8982 32.9233C60.2913 33.2594 60.0398 33.9955 60.3367 34.5675C60.6335 35.1395 61.3662 35.3307 61.9731 34.9947C63.3825 34.2144 64.8261 33.4949 66.2997 32.8397C66.9318 32.5586 67.2507 31.8437 67.012 31.2427ZM116.084 35.7008C115.651 36.2407 115.719 36.9909 116.238 37.3764C117.502 38.3171 118.712 39.3205 119.863 40.3817C120.336 40.8182 121.11 40.7671 121.593 40.2676C122.075 39.7681 122.082 39.0092 121.608 38.5727C120.402 37.46 119.134 36.4079 117.807 35.4214C117.289 35.0358 116.518 35.1609 116.084 35.7008ZM58.2465 35.8461C57.8943 35.308 57.1414 35.1862 56.5647 35.5742C55.1576 36.5208 53.7916 37.5281 52.4714 38.5922C51.93 39.0286 51.8189 39.7874 52.2232 40.2871C52.6275 40.7868 53.3941 40.8381 53.9355 40.4018C55.1948 39.3867 56.4978 38.4259 57.84 37.523C58.4166 37.135 58.5986 36.3843 58.2465 35.8461ZM123.328 42.0461C122.802 42.5007 122.719 43.2609 123.143 43.7441C124.176 44.921 125.146 46.1514 126.05 47.4306C126.42 47.9558 127.179 48.0529 127.744 47.6476C128.309 47.2422 128.466 46.4879 128.095 45.9627C127.148 44.6217 126.131 43.3317 125.048 42.0979C124.624 41.6147 123.854 41.5915 123.328 42.0461ZM50.3817 41.9072C49.9287 41.4503 49.1551 41.4699 48.6537 41.9509C47.4323 43.1227 46.2611 44.3476 45.1449 45.6218C44.688 46.1433 44.7212 46.8985 45.2189 47.3085C45.7167 47.7185 46.4906 47.628 46.9475 47.1065C48.012 45.8913 49.129 44.7231 50.294 43.6054C50.7954 43.1244 50.8346 42.3641 50.3817 41.9072ZM129.068 49.7502C128.47 50.1024 128.239 50.8436 128.553 51.4058C129.316 52.7726 130.01 54.1829 130.629 55.6322C130.883 56.2261 131.597 56.4681 132.223 56.1726C132.849 55.8771 133.151 55.1561 132.897 54.5621C132.247 53.0423 131.52 51.5635 130.72 50.1304C130.406 49.5682 129.666 49.398 129.068 49.7502ZM43.6911 49.2141C43.1527 48.8548 42.3853 49.0156 41.9771 49.5732C40.9844 50.9293 40.0502 52.3301 39.1791 53.7722C38.8233 54.3612 39.0006 55.0862 39.575 55.3915C40.1494 55.6967 40.9035 55.4667 41.2592 54.8777C42.0897 53.503 42.9803 52.1674 43.9268 50.8745C44.335 50.3168 44.2295 49.5734 43.6911 49.2141ZM133.083 58.5202C132.435 58.7559 132.065 59.4497 132.256 60.0698C132.72 61.5735 133.108 63.1106 133.416 64.6766C133.543 65.3169 134.183 65.6955 134.847 65.5222C135.511 65.3488 135.946 64.6892 135.82 64.0488C135.496 62.406 135.089 60.7936 134.603 59.2163C134.412 58.5962 133.732 58.2845 133.083 58.5202ZM135.207 68.0258C134.534 68.135 134.038 68.754 134.098 69.4084C134.243 70.9901 134.309 72.5952 134.293 74.2195C134.287 74.8815 134.829 75.3822 135.505 75.3379C136.181 75.2936 136.734 74.7212 136.74 74.0592C136.757 72.3557 136.687 70.672 136.535 69.0127C136.475 68.3584 135.88 67.9165 135.207 68.0258ZM135.352 77.9008C134.68 77.8802 134.077 78.4011 134.004 79.0642C133.917 79.8677 133.809 80.6748 133.68 81.485C133.552 82.2953 133.405 83.0993 133.239 83.8966C133.102 84.5546 133.528 85.1565 134.189 85.2409C134.851 85.3253 135.498 84.8603 135.635 84.2023C135.809 83.3666 135.963 82.5241 136.098 81.6753C136.232 80.8265 136.345 79.9807 136.437 79.1386C136.509 78.4755 136.024 77.9213 135.352 77.9008ZM133.537 87.7644C132.892 87.6162 132.206 88.0203 132.005 88.6669C131.512 90.2537 130.945 91.809 130.309 93.3292C130.046 93.9581 130.337 94.6391 130.959 94.8503C131.581 95.0615 132.299 94.7229 132.562 94.094C133.23 92.4992 133.825 90.8678 134.341 89.2037C134.542 88.557 134.182 87.9127 133.537 87.7644ZM129.824 97.2362C129.231 96.9639 128.488 97.2336 128.164 97.8386C127.373 99.3179 126.514 100.757 125.591 102.152C125.211 102.727 125.355 103.461 125.913 103.792C126.472 104.122 127.233 103.924 127.613 103.349C128.581 101.886 129.482 100.377 130.312 98.8246C130.636 98.2196 130.417 97.5085 129.824 97.2362ZM33.7283 92.3059C33.0725 92.5144 32.6728 93.1939 32.8356 93.8237C33.234 95.3658 33.7069 96.8774 34.2509 98.3543C34.4746 98.9617 35.1728 99.2379 35.8104 98.9711C36.448 98.7043 36.7834 97.9956 36.5597 97.3882C36.0411 95.98 35.5902 94.5388 35.2104 93.0688C35.0476 92.439 34.3841 92.0975 33.7283 92.3059ZM124.339 105.948C123.821 105.562 123.049 105.687 122.616 106.227C121.558 107.544 120.441 108.812 119.269 110.026C118.786 110.526 118.779 111.285 119.253 111.721C119.726 112.158 120.501 112.107 120.983 111.607C122.212 110.334 123.383 109.005 124.493 107.623C124.926 107.083 124.857 106.333 124.339 105.948ZM36.7044 101.067C36.0906 101.39 35.822 102.121 36.1044 102.701C36.7945 104.117 37.5536 105.494 38.3784 106.827C38.7169 107.374 39.4653 107.513 40.0501 107.138C40.6348 106.763 40.8344 106.015 40.4959 105.468C39.7093 104.197 38.9853 102.884 38.3272 101.533C38.0447 100.953 37.3182 100.745 36.7044 101.067ZM117.303 113.566C116.879 113.083 116.109 113.06 115.583 113.515C114.302 114.622 112.971 115.671 111.595 116.659C111.03 117.064 110.873 117.818 111.244 118.343C111.614 118.869 112.373 118.966 112.938 118.56C114.38 117.525 115.776 116.425 117.119 115.264C117.645 114.81 117.727 114.05 117.303 113.566ZM41.3394 109.005C40.7887 109.429 40.6597 110.187 41.0512 110.696C42.0059 111.94 43.0232 113.134 44.0995 114.277C44.5406 114.745 45.3131 114.743 45.8249 114.273C46.3367 113.803 46.3941 113.042 45.953 112.574C44.9264 111.485 43.9561 110.345 43.0454 109.159C42.6539 108.649 41.8901 108.58 41.3394 109.005ZM108.995 119.808C108.681 119.246 107.941 119.076 107.343 119.428C105.888 120.284 104.395 121.075 102.867 121.796C102.241 122.091 101.939 122.812 102.193 123.406C102.447 124 103.16 124.242 103.786 123.947C105.388 123.191 106.955 122.362 108.48 121.464C109.078 121.112 109.309 120.371 108.995 119.808ZM47.4636 115.845C46.9951 116.357 47.01 117.114 47.4969 117.536C48.6823 118.564 49.9229 119.535 51.2152 120.445C51.7438 120.818 52.5135 120.675 52.9343 120.126C53.3552 119.577 53.2678 118.83 52.7392 118.457C51.5069 117.589 50.3239 116.663 49.1934 115.683C48.7065 115.26 47.9321 115.333 47.4636 115.845ZM99.729 124.434C99.5378 123.813 98.8575 123.502 98.2095 123.737C96.638 124.309 95.0382 124.809 93.415 125.233C92.7512 125.406 92.3155 126.066 92.4418 126.706C92.5681 127.346 93.2086 127.725 93.8723 127.551C95.5752 127.107 97.2533 126.583 98.9017 125.983C99.5497 125.747 99.9201 125.054 99.729 124.434ZM54.8675 121.347C54.4982 121.929 54.6575 122.659 55.2233 122.978C56.598 123.754 58.0198 124.465 59.4856 125.11C60.0837 125.373 60.8234 125.092 61.1377 124.483C61.452 123.874 61.2219 123.167 60.6238 122.904C59.2266 122.29 57.8712 121.611 56.5607 120.872C55.9949 120.553 55.2368 120.766 54.8675 121.347ZM89.8569 127.252C89.7968 126.598 89.2025 126.156 88.5295 126.265C86.9027 126.529 85.2581 126.718 83.6001 126.826C82.9245 126.871 82.3715 127.443 82.365 128.105C82.3585 128.767 82.901 129.268 83.5766 129.223C85.3154 129.109 87.0406 128.912 88.7471 128.635C89.4201 128.526 89.917 127.907 89.8569 127.252ZM63.2976 125.308C63.0411 125.939 63.34 126.616 63.9651 126.82C65.4797 127.315 67.033 127.741 68.622 128.095C69.2684 128.239 69.9518 127.831 70.1483 127.183C70.3448 126.536 69.9801 125.894 69.3336 125.75C67.8185 125.413 66.3376 125.006 64.8938 124.535C64.2687 124.33 63.5541 124.676 63.2976 125.308ZM79.7589 128.15C79.8313 127.487 79.3454 126.933 78.6736 126.913C77.8595 126.888 77.0433 126.843 76.2256 126.779C75.4445 126.717 74.6705 126.638 73.904 126.542C73.242 126.459 72.5956 126.926 72.4602 127.584C72.3248 128.242 72.7516 128.843 73.4136 128.926C74.217 129.027 75.028 129.109 75.8462 129.174C76.703 129.241 77.5582 129.288 78.4114 129.314C79.0832 129.334 79.6865 128.813 79.7589 128.15Z"
                fill="url(#paint9_linear_3122_5856)"
              />
              <path
                d="M80.5353 121.239L81.0702 117.862C97.9373 117.875 113.552 107.674 120.856 92.8237L124.677 93.1244M73.4515 120.682L73.9952 117.249C62.2989 115.202 52.8997 108.193 47.6835 98.6159L51.6084 96.2467M128.65 72.6969L125.129 72.4198C124.144 53.9445 110.03 39.0228 90.54 37.4889C76.6657 36.3969 63.3261 42.3457 54.3591 52.3098L57.0616 55.0249"
                stroke="url(#paint10_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M67.7596 40.8901C67.1749 41.1819 66.9255 41.8741 67.1947 42.4194C67.4639 42.9647 68.1497 43.1565 68.7348 42.8656C69.6327 42.4191 70.5462 42.0032 71.4735 41.619C72.0756 41.3696 72.4141 40.7117 72.2229 40.1309C72.0318 39.5501 71.3834 39.2664 70.781 39.5149C69.7572 39.9372 68.7494 40.3962 67.7596 40.8901ZM78.4039 37.1285C77.7733 37.2659 77.3533 37.8841 77.4627 38.4904C77.5721 39.0968 78.1695 39.4618 78.8002 39.3254C79.7644 39.1168 80.7378 38.9418 81.719 38.8016C82.3547 38.7108 82.8502 38.1497 82.8246 37.5283C82.7989 36.9068 82.2618 36.4605 81.626 36.5503C80.5426 36.7035 79.4679 36.8967 78.4039 37.1285Z"
                fill="url(#paint11_linear_3122_5856)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M54.6184 88.1911C54.4085 87.6177 54.7456 86.9566 55.3528 86.7218C55.96 86.487 56.6073 86.7676 56.8181 87.3405C57.1415 88.2197 57.4993 89.0861 57.8912 89.9377C58.1457 90.4906 57.8998 91.1813 57.3231 91.4901C56.7465 91.7988 56.0576 91.6087 55.8023 91.0563C55.3683 90.1174 54.9735 89.1616 54.6184 88.1911Z"
                fill="url(#paint12_linear_3122_5856)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M101.373 34.4908C100.729 34.2882 100.007 34.6716 99.7683 35.327C99.5299 35.9824 99.8653 36.6617 100.509 36.8653C101.498 37.1779 102.467 37.5258 103.416 37.9074C104.039 38.1583 104.797 37.8712 105.119 37.2458C105.441 36.6203 105.205 35.8933 104.582 35.6414C103.536 35.2184 102.466 34.8343 101.373 34.4908ZM111.851 39.4472C111.295 39.0823 110.511 39.2748 110.111 39.8595C109.711 40.4442 109.847 41.1996 110.402 41.5654C111.252 42.1257 112.076 42.717 112.874 43.3379C113.397 43.7447 114.19 43.6558 114.661 43.1217C115.131 42.5876 115.101 41.8108 114.579 41.4031C113.7 40.7166 112.79 40.064 111.851 39.4472Z"
                fill="url(#paint13_linear_3122_5856)"
              />
              <path
                d="M97.4877 89.6173L101.303 93.2731C104.89 89.5043 107.285 84.8182 108.149 79.8581C109.013 74.898 108.303 69.9191 106.124 65.6067L101.178 68.4365C102.817 71.7452 103.346 75.5512 102.686 79.343C102.025 83.1348 100.208 86.7196 97.4877 89.6173Z"
                stroke="url(#paint14_linear_3122_5856)"
                strokeWidth="1.22443"
              />
              <path
                d="M66.596 87.1862L61.7306 90.1588C59.411 85.9252 58.5414 80.9821 59.2504 76.0098C59.9593 71.0375 62.2102 66.2917 65.6847 62.4242L69.6232 65.9532C66.9893 68.9256 65.2826 72.5557 64.7407 76.3568C64.1988 80.1579 64.8492 83.9369 66.596 87.1862Z"
                stroke="url(#paint15_linear_3122_5856)"
                strokeWidth="1.22443"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_3122_5856"
                x="-4.87801"
                y="-4.87416"
                width="177.776"
                height="164.9"
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
                  stdDeviation="2.43903"
                  result="effect1_foregroundBlur_3122_5856"
                />
              </filter>
              <linearGradient
                id="paint0_linear_3122_5856"
                x1="182.843"
                y1="-7.08512"
                x2="17.5676"
                y2="111.069"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D55FFF" />
                <stop offset="1" stopColor="#4230B1" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_3122_5856"
                x1="40.3071"
                y1="31.9607"
                x2="112.285"
                y2="154.672"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#995C08" />
                <stop offset="1" stopColor="#683811" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_3122_5856"
                x1="230.718"
                y1="66.8312"
                x2="-39.5428"
                y2="61.0654"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2F2450" />
                <stop offset="1" stopColor="#1E1024" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_3122_5856"
                x1="52.1409"
                y1="74.6469"
                x2="10.3472"
                y2="77.4103"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#DC9327" />
                <stop offset="0.04" stopColor="#E8B744" />
                <stop offset="0.08" stopColor="#F2D35B" />
                <stop offset="0.12" stopColor="#F9E76B" />
                <stop offset="0.16" stopColor="#FEF375" />
                <stop offset="0.2" stopColor="#FFF778" />
                <stop offset="0.28" stopColor="#EAC34A" />
                <stop offset="0.34" stopColor="#D99A26" />
                <stop offset="0.36" stopColor="#CB8E24" />
                <stop offset="0.4" stopColor="#B77E21" />
                <stop offset="0.43" stopColor="#AB741F" />
                <stop offset="0.47" stopColor="#A7711E" />
                <stop offset="0.51" stopColor="#AB7622" />
                <stop offset="0.56" stopColor="#B8852E" />
                <stop offset="0.61" stopColor="#CD9E42" />
                <stop offset="0.66" stopColor="#EBC15E" />
                <stop offset="0.68" stopColor="#F6CE69" />
                <stop offset="0.72" stopColor="#F3C962" />
                <stop offset="0.78" stopColor="#EBBA4F" />
                <stop offset="0.85" stopColor="#DEA231" />
                <stop offset="0.87" stopColor="#D99A26" />
                <stop offset="1" stopColor="#F6CE69" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_3122_5856"
                x1="68.6924"
                y1="-6.34951"
                x2="-9.29252"
                y2="94.7205"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_3122_5856"
                x1="51.8953"
                y1="60.3263"
                x2="31.4297"
                y2="65.6278"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_3122_5856"
                x1="115.177"
                y1="-2.68485"
                x2="31.3599"
                y2="75.6846"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_3122_5856"
                x1="92.6944"
                y1="-22.6787"
                x2="19.6628"
                y2="131.169"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_3122_5856"
                x1="98.1646"
                y1="-38.2149"
                x2="10.0128"
                y2="136.624"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint9_linear_3122_5856"
                x1="99.6099"
                y1="-39.6983"
                x2="9.05163"
                y2="136.327"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint10_linear_3122_5856"
                x1="100.023"
                y1="-15.3787"
                x2="24.2676"
                y2="124.416"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint11_linear_3122_5856"
                x1="91.355"
                y1="30.8463"
                x2="48.6064"
                y2="52.6459"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint12_linear_3122_5856"
                x1="56.508"
                y1="100.285"
                x2="54.5994"
                y2="79.6894"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.161458" stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint13_linear_3122_5856"
                x1="125.405"
                y1="29.3706"
                x2="56.2922"
                y2="32.9072"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint14_linear_3122_5856"
                x1="108.307"
                y1="46.0401"
                x2="74.5103"
                y2="69.741"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <linearGradient
                id="paint15_linear_3122_5856"
                x1="69.6771"
                y1="43"
                x2="94.7178"
                y2="71.8134"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#A55FFF" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 72 72"
            id="circle5"
          >
            <g filter="url(#filter0_i_3088_7409)">
              <circle
                r="32"
                transform="matrix(-1 0 0 1 32 32.0039)"
                fill="#2E3148"
              />
            </g>
            <defs>
              <filter
                id="filter0_i_3088_7409"
                x="-1.91045"
                y="-1.90654"
                width="65.9104"
                height="65.9104"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-1.91045" dy="-1.91045" />
                <feGaussianBlur stdDeviation="2.38806" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.320208 0 0 0 0 0.334223 0 0 0 0 0.441667 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_3088_7409"
                />
              </filter>
            </defs>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 110 110"
            id="circle7"
          >
            <defs>
              <filter
                id="filter6_iif"
                x="-17.21"
                y=".474"
                width="126.737"
                height="109.053"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                ></feBlend>
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dx="-30.21" dy="-5.158"></feOffset>
                <feGaussianBlur stdDeviation="18.421"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend in2="shape" result="effect1_innerShadow"></feBlend>
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dx="2.947" dy=".737"></feOffset>
                <feGaussianBlur stdDeviation="3.684"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 0.418889 0 0 0 0 0.868067 0 0 0 0 0.966667 0 0 0 1 0"></feColorMatrix>
                <feBlend
                  in2="effect1_innerShadow"
                  result="effect2_innerShadow"
                ></feBlend>
                <feGaussianBlur
                  stdDeviation="6.263"
                  result="effect3_foregroundBlur"
                ></feGaussianBlur>
              </filter>
            </defs>
            <g opacity=".3" filter="url(#filter6_iif)">
              <circle cx="55" cy="55" r="42" fill="#213A5F"></circle>
            </g>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 148 148"
            id="circle6"
          >
            <defs>
              <filter
                id="filter7_iif"
                x="-24"
                y="0"
                width="172"
                height="148"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                ></feBlend>
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dx="-41" dy="-7"></feOffset>
                <feGaussianBlur stdDeviation="25"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend in2="shape" result="effect1_innerShadow"></feBlend>
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dx="4" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 0.418889 0 0 0 0 0.868067 0 0 0 0 0.966667 0 0 0 1 0"></feColorMatrix>
                <feBlend
                  in2="effect1_innerShadow"
                  result="effect2_innerShadow"
                ></feBlend>
                <feGaussianBlur
                  stdDeviation="8.5"
                  result="effect3_foregroundBlur"
                ></feGaussianBlur>
              </filter>
            </defs>
            <g opacity=".3" filter="url(#filter7_iif)">
              <circle cx="74" cy="74" r="57" fill="#5778AA"></circle>
            </g>
          </symbol>
        </svg>
        <svg
          width={1600}
          height={610}
          viewBox="0 0 1600 610"
          className={styles.circleSectionEllipse}
        >
          <defs>
            <filter
              id="filter0_i_3088_7405"
              x="-148.084"
              y="127.906"
              width="1896.17"
              height="657.59"
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
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="40" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.533333 0 0 0 0 0.231373 0 0 0 0 0.901961 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_3088_7405"
              />
            </filter>
            <linearGradient
              id="paint0_linear_3088_7405"
              x1="800"
              y1="481.098"
              x2="800"
              y2="180.118"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C4C4C4" />
              <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <mask
            id="mask0_3088_7405"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1600"
            height="610"
          >
            <rect
              width="1600"
              height="609"
              transform="matrix(1 0 0 -1 0 609.004)"
              fill="url(#paint0_linear_3088_7405)"
            />
          </mask>
          <g mask="url(#mask0_3088_7405)">
            <g filter="url(#filter0_i_3088_7405)">
              <path
                d="M-148.084 781.495C-148.084 608.153 -48.197 441.91 129.603 319.338C307.404 196.766 548.553 127.906 800.001 127.906C1051.45 127.906 1292.6 196.766 1470.4 319.338C1648.2 441.909 1748.09 608.152 1748.09 781.495L800.001 781.495L-148.084 781.495Z"
                fill="#19072F"
              />
            </g>
          </g>
        </svg>
        <svg
          width="453"
          height="1024"
          viewBox="0 0 453 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={mobile ? "hidden" : "pointer-events-none absolute right-0"}
        >
          <g filter="url(#filter0_f_3091_9106)">
            <path
              d="M713.733 733.855C506.304 591.999 408.448 736.284 317.918 645.754C227.389 555.225 227.389 408.448 317.918 317.918C408.448 227.389 555.225 227.389 645.754 317.918C736.284 408.448 936.121 918.806 713.733 733.855Z"
              fill="url(#paint0_radial_3091_9106)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3091_9106"
              x="0.0209351"
              y="0.0209961"
              width="1065.04"
              height="1023.9"
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
                stdDeviation="125"
                result="effect1_foregroundBlur_3091_9106"
              />
            </filter>
            <radialGradient
              id="paint0_radial_3091_9106"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(481.836 481.836) rotate(135) scale(231.815 231.815)"
            >
              <stop offset="0.442708" stopColor="#992D81" />
              <stop offset="1" stopColor="#6029DB" />
            </radialGradient>
          </defs>
        </svg>
        <div className={styles.row}>
          <h3 className={classnames([styles.h3, styles.hlHorizontal])}>
            Built on {mobile ? <br /> : ""} Cosmos with ❤️
          </h3>
          <div className={classnames([styles.b16, styles.circleSectionDesc])}>
            Gitopia is an application specific blockchain built using Cosmos SDK
            framework. The use of Cosmos SDK has enabled us to leverage the
            Tendermint BFT consensus engine and build the blockchain that is
            optimized for Gitopia’s use case. Along with the high throughput and
            fast finality, Cosmos IBC also enables other IBC compatible chains
            to integrate directly with Gitopia.
          </div>
          <div className={styles.platformCirclesWrapper}>
            {pCircles.map((circle) => {
              return (
                <svg
                  key={circle.url}
                  width={circle.r}
                  height={circle.r}
                  className={classnames([
                    styles.platformCircles,
                    "platformCircles",
                  ])}
                >
                  <use href={circle.url}></use>
                </svg>
              );
            })}
          </div>
          <div className={styles.circleSectionLink}>
            Learn more about why Gitopia is Building on Cosmos SDK{" "}
            <a
              href="https://blog.gitopia.com/post/2021/05/why-gitopia-is-building-with-cosmos-sdk/"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </div>
        </div>
      </section>
      <section
        className={classnames([
          styles.section,
          styles.collaborationBenefitsSection,
        ])}
      >
        <div className="sm:flex">
          <div className={styles.collaborationsBenefitsCard1}>
            <div className="">
              <div className={" " + styles.collaborationsBenefitsCard1Title}>
                Lightning collaborations on blockchain
              </div>
              <div className={" " + styles.collaborationsBenefitsCard1Body}>
                Gitopia provides developers with a community-governed
                decentralized platform where they can host their git
                repositories permanently and collaborate with others on code
                without worrying about censorship or losing access to their
                code.
              </div>
              {!mobile ? (
                <>
                  <div
                    className={classnames(
                      "mb-3 ",
                      styles.collaborationsBenefitsCard1Button
                    )}
                  >
                    <a
                      href="/home"
                      target="_blank"
                      className="h-12 py-3 w-72 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      Create your Gitopia Profile
                    </a>
                  </div>
                  <div className="flex mb-4">
                    <div className="ml-20 sm:ml-2 mt-2">🚀</div>
                    <div className="ml-4 leading-5">
                      Reserve your username
                      <br /> before others take it! 👆
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="">
            <div className="grid grid-rows-2 grid-cols-2 lg:gap-x-8 lg:gap-y-10">
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/Issue.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Issue
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Helps keep track of tasks, enhancements, and bugs for your
                  opensource and web3 projects
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/pullRequest.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Pull-Request
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Helps you submit changes to a decentralized repository hosted
                  on Gitopia
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/fork.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Fork
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Helps you create a copy of the repository hosted on Gitopia to
                  experiment with changes or use as a basis.
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/on chain profile.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Gitopia Profile
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Users can now set usernames for their wallet addresses on
                  Gitopia.
                </div>
              </div>
            </div>
          </div>
          {mobile ? (
            <div className="flex flex-col items-center">
              <div
                className={classnames(
                  "mb-3 ",
                  styles.collaborationsBenefitsCard1Button
                )}
              >
                <a
                  href="/home"
                  target="_blank"
                  className="h-12 py-3 w-full rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  Create your Gitopia Profile
                </a>
              </div>
              <div className="flex mb-4">
                <div className="sm:ml-2 mt-2">🚀</div>
                <div className="ml-4 leading-5">
                  Reserve your username
                  <br /> before others take it! 👆
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
      <section
        className={classnames([
          styles.section,
          styles.storageSection,
          " relative",
        ])}
      >
        <div className={styles.row}>
          <h3 className={styles.h3 + " mb-5"}>Permanent Storage</h3>
          <div className={styles.b16}>
            A global, permanent, and unalterable record of every single revision
            ever made.
          </div>
        </div>
        <div className={styles.storageAnim} id="storageAnimSource">
          <div className={styles.storageAnimSource}>
            <div className={styles.storageAnimSourceLane}></div>
            <div className={styles.storageAnimSourceLane}></div>
            <div className={styles.storageAnimSourceLane}></div>
            <div className={styles.storageAnimSourceLane}></div>
          </div>
          <div className={styles.storageAnimBarrier}>
            <div className={styles.storageAnimBarrierCircle}></div>
          </div>
          <div className={styles.storageAnimSink}>
            <div
              className={styles.storageAnimSinkFlash}
              id="storageAnimSinkFlash"
            ></div>
          </div>
        </div>
        <div className={styles.storageSectionDecentralization}>
          Decentralization
        </div>
        <div className="">
          <div className="grid gird-rows-1 grid-cols-3 gap-1 sm:gap-4 mt-12">
            <div
              className={"flex items-center sm:px-5 " + styles.storagePlatforms}
            >
              <img src="/filecoin.svg" className={styles.storagePlatformsImg} />
            </div>
            <div
              className={
                "flex items-center px-3 sm:px-12 " + styles.storagePlatforms
              }
            >
              <img
                src="/ipfs.svg"
                className={"flex " + styles.storagePlatformsImage}
              />
              <div>IPFS</div>
            </div>
            <div
              className={
                "flex items-center px-3 sm:px-8 " + styles.storagePlatforms
              }
            >
              <img src="/arweave.svg" className={styles.storagePlatformsImg} />
            </div>
          </div>
          <div
            className={styles.storageSectionDecentralization + " text-center"}
          >
            gitopia storage platforms
          </div>
        </div>
        <img
          src="./wave-2.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none left-0 " +
            (mobile ? "top-1/3" : "bottom-0")
          }
          width={mobile ? 177 : "30%"}
          height={mobile ? 277 : "30%"}
        />
        <img
          src="./wave-3.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none right-0 " +
            (mobile ? "top-1/3" : "bottom-0")
          }
          width={mobile ? 177 : "30%"}
          height={mobile ? 277 : "30%"}
        />
      </section>

      <section className={classnames([styles.section])}>
        <div className={styles.transitionRow}>
          <div className={classnames([styles.hlVertical, styles.mr100])}>
            <span>
              <div className={styles.b18}>Linus Torvalds</div>
              <div className={styles.l12}>Inventor of GIT</div>
            </span>
          </div>
          <div className={classnames([styles.b18, styles.rowQuote])}>
            “In real open source, you have the right to control your own
            destiny.”
          </div>
          <div className={styles.midLogo}></div>
        </div>
      </section>
      {/* <div
        className={
          mobile
            ? "hidden"
            : "flex flex-col items-center text-center w-full " +
              styles.storageSectionMessage
        }
      >
        <div className="mt-4">
          Decentrlization is the only plausible future, get in early.
        </div>
      </div> */}
      <section
        className={classnames([styles.section, styles.decentralizedSection])}
      >
        <div className={styles.rowLeftAligned}>
          <div className={styles.smallRow}>
            <div className={styles.topHeading}>Secure Platform</div>
            <h3 className={classnames([styles.h3, styles.mb72])}>
              No single point of failure
            </h3>
            <div
              className={classnames([
                mobile ? "" : styles.hlVertical,
                styles.mb36,
              ])}
            >
              <span>
                <div className={styles.b18 + " text-center sm:text-left"}>
                  Decentralized Network of Gitopia provides high availability
                  and stable network.
                </div>
              </span>
            </div>
            <div
              className={classnames([styles.decentralizedDesc, styles.mb36])}
            >
              Application will be served by a decentralized network of Gitopia
              nodes that are incentivised for high availability and good
              behaviour.
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (window) {
                    window.open("/new");
                  }
                }}
                className="ml-4 px-16 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Create a Repository
              </button>
            </div>
          </div>
          <img
            className={styles.decentralizedImage}
            src="/landing-decentralized.svg"
            loading="lazy"
          ></img>
        </div>
      </section>

      <section className={classnames([styles.section])}>
        <div className="grid sm:grid-cols-2 sm:grid-row-1 grid-cols-1 grid-row-2 sm:gap-6 gap-2">
          <div className={styles.openSource + " relative"}>
            <div>
              <img src="/opensource.svg"></img>
            </div>
            <div className="absolute bottom-5 sm:bottom-10">
              <div className={styles.openSourceTitle}>
                Open Source and community governed
              </div>
              <div className={styles.openSourceDescription}>
                Gitopia source code is open-source on Gitopia and open for
                contributors to build. Users will be stakeholders of Gitopia and
                all decisions related to Gitopia would be community-centric and
                driven by the community.
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (window) {
                      window.open(
                        "/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS
                      );
                    }
                  }}
                  className="px-4 py-4 w-52 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  View Source Code
                </button>
              </div>
            </div>
          </div>
          <div className={styles.openSource + " relative"}>
            <div>
              <img src="/incentivization.svg"></img>
            </div>
            <div className="absolute bottom-5 sm:bottom-10">
              <div className={styles.openSourceTitle}>
                Incentivization for contributions using LORE token
              </div>
              <div className={styles.openSourceDescription}>
                Incentivizing open source and Web3 contributions will be
                integrated into the Gitopia workflows. It will be designed to
                motivate open-source developers to contribute to open-source
                projects and Web3 actively.
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (window) {
                      window.open(
                        "https://blog.gitopia.com/post/2022/04/game-of-lore/"
                      );
                    }
                  }}
                  className="px-10 py-4 w-52 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  Read Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section + " relative mb-32 sm:mb-64"}>
        <div className={classnames([styles.topHeading], [styles.getStarted])}>
          Get Started
        </div>
        <div className={classnames([styles.h3], [styles.getStartedDes])}>
          Contribute to open-source with Gitopia, see how 👇
        </div>
        <YoutubeEmbed
          embedId="ewK_0BkF5P8"
          height={mobile ? "200px" : "472px"}
          width={mobile ? "350px" : "840px"}
        />
        <img
          src="./gitopia-coin-mobile.svg"
          className={!mobile ? "hidden" : " absolute right-0 top-96 pt-20"}
        />
        <img
          src="./gitopia-coin.svg"
          className={
            "absolute -z-10 " + (mobile ? " hidden" : " right-3/4 bottom-1/2")
          }
        />
        <img
          src="./gitopia-coin-1.svg"
          className={mobile ? "hidden" : "absolute -z-10 left-1/2 top-1/3"}
        />
        <svg
          width="726"
          height="522"
          viewBox="0 0 726 522"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10 opacity-100 pointer-events-none top-2/3 left-1/2"
          }
        >
          <g filter="url(#filter0_f_3238_11391)">
            <rect
              x="161.238"
              y="161.876"
              width="403.296"
              height="198.851"
              rx="24"
              fill="url(#paint0_linear_3238_11391)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3238_11391"
              x="0.238037"
              y="0.876465"
              width="725.296"
              height="520.851"
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
                stdDeviation="80.5"
                result="effect1_foregroundBlur_3238_11391"
              />
            </filter>
            <linearGradient
              id="paint0_linear_3238_11391"
              x1="412.823"
              y1="161.876"
              x2="562.532"
              y2="223.152"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6D2882" />
              <stop offset="1" stopColor="#2C4DFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          width="726"
          height="522"
          viewBox="0 0 726 522"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10 opacity-100 pointer-events-none left-0"
          }
        >
          <g filter="url(#filter0_f_3238_11392)">
            <rect
              width="403.296"
              height="198.851"
              rx="24"
              transform="matrix(1 0 0 -1 161.188 360.116)"
              fill="url(#paint0_linear_3238_11392)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3238_11392"
              x="0.187988"
              y="0.264404"
              width="725.296"
              height="520.851"
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
                stdDeviation="80.5"
                result="effect1_foregroundBlur_3238_11392"
              />
            </filter>
            <linearGradient
              id="paint0_linear_3238_11392"
              x1="251.585"
              y1="-1.089e-05"
              x2="401.293"
              y2="61.2758"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#352882" />
              <stop offset="1" stopColor="#2C4DFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <img
          src="./wave.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none " +
            (mobile ? " hidden" : " left-0 -top-24 w-full")
          }
        />
        <img
          src="./mobile-wave.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none " +
            (mobile ? " top-1/3 pt-10" : " hidden")
          }
        />
        <img
          src="./getStartedCoin-1.svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10 opacity-100 pointer-events-none left-0 top-2/3"
          }
        />
        <img
          src="./getStartedCoin-2.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none" +
            (mobile ? " left-1/4 -bottom-5" : " left-16 bottom-0")
          }
        />
        <img
          src="./getStartedCoin-3.svg"
          className={
            "absolute -z-10 opacity-100 pointer-events-none" +
            (mobile ? " bottom-1/3 pb-2 right-10" : " right-3/4 pr-32 top-3/4")
          }
          width={mobile ? "43" : ""}
          height={mobile ? "43" : ""}
        />
        <img
          src="./getStartedCoin-4.svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10 opacity-100 pointer-events-none right-16 pr-32 top-3/4"
          }
        />
        <img
          src="./getStartedCoin-5.svg"
          className={
            "absolute opacity-100 pointer-events-none " +
            (mobile
              ? "-left-3 pt-5 top-1/2 z-10"
              : "right-16 pt-16 top-1/3 -z-10 ")
          }
          width={mobile ? "56" : "88"}
          height={mobile ? "56" : "88"}
        />
        <img
          src="./getStartedCoin-6.svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10  opacity-100 pointer-events-none right-5 top-2/3"
          }
        />
        <img
          src="./getStartedCoin-7.svg"
          className={
            mobile
              ? "hidden"
              : "absolute -z-10  opacity-100 pointer-events-none right-0 bottom-0"
          }
        />
        {mobile ? (
          <svg
            width="273"
            height="315"
            viewBox="0 0 273 315"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -z-10 opacity-100 pointer-events-none top-2/3 right-0"
          >
            <g filter="url(#filter0_f_3325_6939)">
              <rect
                x="97"
                y="97.5908"
                width="242.704"
                height="119.669"
                rx="14.4433"
                fill="url(#paint0_linear_3325_6939)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_3325_6939"
                x="0.109695"
                y="0.700516"
                width="436.485"
                height="313.45"
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
                  stdDeviation="48.4452"
                  result="effect1_foregroundBlur_3325_6939"
                />
              </filter>
              <linearGradient
                id="paint0_linear_3325_6939"
                x1="248.405"
                y1="97.5908"
                x2="338.5"
                y2="134.467"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6D2882" />
                <stop offset="1" stopColor="#2C4DFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          ""
        )}
      </section>

      <section className={"relative " + styles.section}>
        <div className={styles.topHeading}>Blockchain Technology</div>
        <div className={styles.h3 + " text-center"}>
          Embrace the future of <br /> collaboration
        </div>
        <div className="lg:flex">
          <div className={styles.censorship}>
            <div className={styles.censorshipResistant}>
              Censorship Resistant and Unstoppable
            </div>
            <div className={styles.censorshipDescription}>
              There is no central authority that can take down any repository on
              Gitopia and decentralized network ensures high availability of
              services
            </div>
          </div>
          <div className={styles.line}></div>
          <img src="/embrace.svg" className={styles.embrace} />
          <div className={styles.secure}>
            <div className={styles.secureLogin}>Secure login with wallets</div>
            <div className={styles.secureDescription}>
              Gitopia provides users option to login with secure wallets such as
              Ledger, Keplr and local web wallet{" "}
            </div>
          </div>
        </div>
        <svg
          width="581"
          height="559"
          viewBox="0 0 581 559"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile
              ? "absolute -z-10 pointer-events-none top-16"
              : "absolute -z-10 pointer-events-none left-1/4 top-1/3"
          }
        >
          <g filter="url(#filter0_f_3098_5709)">
            <path
              d="M191.618 400.542C304.644 323.247 357.964 401.866 407.293 352.537C456.621 303.209 456.621 223.232 407.293 173.903C357.964 124.575 277.987 124.575 228.659 173.903C179.331 223.232 70.4417 501.32 191.618 400.542Z"
              fill="url(#paint0_radial_3098_5709)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3098_5709"
              x="0.181477"
              y="0.685272"
              width="580.329"
              height="557.907"
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
                stdDeviation="68.1109"
                result="effect1_foregroundBlur_3098_5709"
              />
            </filter>
            <radialGradient
              id="paint0_radial_3098_5709"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(317.976 263.22) rotate(45) scale(126.313 126.313)"
            >
              <stop offset="0.442708" stopColor="#992D81" />
              <stop offset="1" stopColor="#6029DB" />
            </radialGradient>
          </defs>
        </svg>
        <svg
          width="418"
          height="1024"
          viewBox="0 0 418 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile
              ? "absolute -z-10 pointer-events-none top-3/4 pb-60"
              : "absolute z-1 pointer-events-none left-0 top-1/4"
          }
        >
          <g filter="url(#filter0_f_3091_9128)">
            <path
              d="M-295.954 733.855C-88.5255 591.999 9.33113 736.284 99.8606 645.754C190.39 555.225 190.39 408.448 99.8606 317.918C9.33109 227.389 -137.446 227.389 -227.976 317.918C-318.505 408.448 -518.343 918.806 -295.954 733.855Z"
              fill="url(#paint0_radial_3091_9128)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3091_9128"
              x="-647.287"
              y="0.0209961"
              width="1065.04"
              height="1023.89"
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
                stdDeviation="125"
                result="effect1_foregroundBlur_3091_9128"
              />
            </filter>
            <radialGradient
              id="paint0_radial_3091_9128"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-64.0576 481.836) rotate(45) scale(231.815 231.815)"
            >
              <stop offset="0.442708" stopColor="#992D81" />
              <stop offset="1" stopColor="#6029DB" />
            </radialGradient>
          </defs>
        </svg>
      </section>

      <section
        className={classnames([
          styles.section,
          styles.collaborationBenefitsSection,
        ])}
      >
        <div className="sm:flex">
          <div className={styles.collaborationsBenefitsCard1}>
            <div className="">
              <div className={" " + styles.benefitsCard1Title}>
                Discover the incredible benefits of Web3 specific Workflows
              </div>
              <div className={" " + styles.collaborationsBenefitsCard1Body}>
                Gitopia is a decentralized and community-controlled alternative
                to code collaboration platforms like GitHub, GitLab, and
                Bitbucket. Gitopia offers Open Source and Web3 with wide variety
                of tailor-made workflows for better development of projects and
                engaging with the contributors.
              </div>
              {!mobile ? (
                <div
                  className={classnames(
                    "mb-3",
                    styles.collaborationsBenefitsCard1Button
                  )}
                >
                  <a
                    href="/account/daos/new"
                    target="_blank"
                    className="h-12 py-3 w-72 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Create DAO
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="">
            <div className="grid grid-rows-2 grid-cols-2 lg:gap-x-8 lg:gap-y-10">
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/Proposal.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Proposals
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Community can raise or vote on proposals to help shape the
                  future of Gitopia.
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/DAO icon.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  DAOs
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  DAOs at Gitopia would provide a decentralized code management
                  tool for people and institutions that do not know nor trust
                  each other.
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/Bounty.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Bounties
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  Create bounties for the issues you wish to get built with
                  community and reward contributors on their code submissions.
                </div>
              </div>
              <div className="items-left text-left">
                <figure className={styles.collaborationsBenefitsCard2Image}>
                  <img src="/Governance.svg" />
                </figure>
                <div className={styles.collaborationsBenefitsCard2Title}>
                  Governance
                </div>
                <div className={styles.collaborationsBenefitsCard2Body}>
                  At Gitopia, all the platform-related decisions will be taken
                  with the community's involvement transparently to help shape
                  future of Gitopia
                </div>
              </div>
            </div>
          </div>
          {mobile ? (
            <div className="flex flex-col items-center">
              <div
                className={classnames(
                  "mb-3",
                  styles.collaborationsBenefitsCard1Button
                )}
              >
                <a
                  href="/account/daos/new"
                  target="_blank"
                  className="h-12 py-3 w-full rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                  Create DAO
                </a>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <svg
          width="808"
          height="982"
          viewBox="0 0 808 982"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile ? "hidden" : "absolute z-1 pointer-events-none left-0"
          }
        >
          <mask
            id="mask0_3110_5715"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="17"
            width="808"
            height="965"
          >
            <rect
              y="17"
              width="808"
              height="965"
              fill="url(#paint0_linear_3110_5715)"
            />
          </mask>
          <g mask="url(#mask0_3110_5715)">
            <g opacity="0.2">
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1161.12 691.634C1137.51 634.644 1125.36 573.562 1125.36 511.877L1125.39 511.877C1125.37 468.75 1116.86 426.048 1100.36 386.204C1083.83 346.31 1059.61 310.063 1029.08 279.53C998.547 248.997 962.299 224.777 922.406 208.253C882.513 191.728 839.756 183.224 796.576 183.224C753.397 183.224 710.641 191.729 670.749 208.253C630.856 224.777 594.608 248.997 564.075 279.53C533.542 310.063 509.322 346.31 492.798 386.204C476.274 426.097 467.769 468.854 467.769 512.034L467.729 512.034C467.729 573.719 455.579 634.801 431.973 691.791C408.367 748.781 373.767 800.564 330.149 844.182C286.53 887.801 234.748 922.401 177.757 946.007C120.767 969.613 59.6856 981.763 -2.00004 981.763L-2.00003 840.844C41.1799 840.844 83.9371 832.339 123.83 815.815C163.723 799.291 199.971 775.071 230.504 744.538C261.037 714.005 285.257 677.757 301.781 637.864C318.305 597.971 326.81 555.214 326.81 512.034L326.85 512.034C326.85 450.348 339 389.266 362.606 332.276C386.212 275.286 420.812 223.504 464.431 179.885C508.049 136.267 559.831 101.667 616.822 78.0608C673.812 54.4547 734.893 42.3048 796.579 42.3048L796.576 42.3048L1230.55 332.276C1254.16 389.266 1266.3 450.348 1266.3 512.034L1266.28 512.034C1266.3 555.16 1274.81 597.862 1291.31 637.707C1307.83 677.6 1332.05 713.848 1362.59 744.381C1393.12 774.913 1429.37 799.133 1469.26 815.658C1509.15 832.182 1551.91 840.687 1595.09 840.687L1595.09 981.606C1533.41 981.606 1472.32 969.456 1415.33 945.85C1358.34 922.243 1306.56 887.643 1262.94 844.025C1219.32 800.407 1184.72 748.624 1161.12 691.634ZM1230.55 332.276C1206.94 275.286 1172.34 223.504 1128.72 179.885C1085.11 136.267 1033.32 101.667 976.334 78.0608C919.344 54.4551 858.264 42.3052 796.579 42.3048L1230.55 332.276Z"
                fill="url(#paint1_linear_3110_5715)"
              />
              <mask
                id="mask1_3110_5715"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="-2"
                y="42"
                width="1598"
                height="940"
              >
                <path
                  opacity="0.3"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1161.12 691.634C1137.51 634.644 1125.36 573.562 1125.36 511.877L1125.39 511.877C1125.37 468.75 1116.86 426.048 1100.36 386.204C1083.83 346.31 1059.61 310.063 1029.08 279.53C998.547 248.997 962.299 224.777 922.406 208.253C882.513 191.728 839.756 183.224 796.576 183.224C753.397 183.224 710.641 191.729 670.749 208.253C630.856 224.777 594.608 248.997 564.075 279.53C533.542 310.063 509.322 346.31 492.798 386.204C476.274 426.097 467.769 468.854 467.769 512.034L467.729 512.034C467.729 573.719 455.579 634.801 431.973 691.791C408.367 748.781 373.767 800.564 330.149 844.182C286.53 887.801 234.748 922.401 177.757 946.007C120.767 969.613 59.6856 981.763 -2.00004 981.763L-2.00003 840.844C41.1799 840.844 83.9371 832.339 123.83 815.815C163.723 799.291 199.971 775.071 230.504 744.538C261.037 714.005 285.257 677.757 301.781 637.864C318.305 597.971 326.81 555.214 326.81 512.034L326.85 512.034C326.85 450.348 339 389.266 362.606 332.276C386.212 275.286 420.812 223.504 464.431 179.885C508.049 136.267 559.831 101.667 616.822 78.0608C673.812 54.4547 734.893 42.3048 796.579 42.3048L796.576 42.3048L1230.55 332.276C1254.16 389.266 1266.3 450.348 1266.3 512.034L1266.28 512.034C1266.3 555.16 1274.81 597.862 1291.31 637.707C1307.83 677.6 1332.05 713.848 1362.59 744.381C1393.12 774.913 1429.37 799.133 1469.26 815.658C1509.15 832.182 1551.91 840.687 1595.09 840.687L1595.09 981.606C1533.41 981.606 1472.32 969.456 1415.33 945.85C1358.34 922.243 1306.56 887.643 1262.94 844.025C1219.32 800.407 1184.72 748.624 1161.12 691.634ZM1230.55 332.276C1206.94 275.286 1172.34 223.504 1128.72 179.885C1085.11 136.267 1033.32 101.667 976.334 78.0608C919.344 54.4551 858.264 42.3052 796.579 42.3048L1230.55 332.276Z"
                  fill="url(#paint2_linear_3110_5715)"
                />
              </mask>
              <g mask="url(#mask1_3110_5715)">
                <g filter="url(#filter0_f_3110_5715)">
                  <circle
                    cx="1107.59"
                    cy="337.726"
                    r="193.34"
                    transform="rotate(90 1107.59 337.726)"
                    fill="#2EDDE9"
                  />
                </g>
              </g>
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1161.12 691.634C1137.51 634.644 1125.36 573.562 1125.36 511.877L1125.39 511.877C1125.37 468.75 1116.86 426.048 1100.36 386.204C1083.83 346.31 1059.61 310.063 1029.08 279.53C998.547 248.997 962.299 224.777 922.406 208.253C882.513 191.728 839.756 183.224 796.576 183.224C753.397 183.224 710.641 191.729 670.749 208.253C630.856 224.777 594.608 248.997 564.075 279.53C533.542 310.063 509.322 346.31 492.798 386.204C476.274 426.097 467.769 468.854 467.769 512.034L467.729 512.034C467.729 573.719 455.579 634.801 431.973 691.791C408.367 748.781 373.767 800.564 330.149 844.182C286.53 887.801 234.748 922.401 177.757 946.007C120.767 969.613 59.6856 981.763 -2.00004 981.763L-2.00003 840.844C41.1799 840.844 83.9371 832.339 123.83 815.815C163.723 799.291 199.971 775.071 230.504 744.538C261.037 714.005 285.257 677.757 301.781 637.864C318.305 597.971 326.81 555.214 326.81 512.034L326.85 512.034C326.85 450.348 339 389.266 362.606 332.276C386.212 275.286 420.812 223.504 464.431 179.885C508.049 136.267 559.831 101.667 616.822 78.0608C673.812 54.4547 734.893 42.3048 796.579 42.3048L796.576 42.3048L1230.55 332.276C1254.16 389.266 1266.3 450.348 1266.3 512.034L1266.28 512.034C1266.3 555.16 1274.81 597.862 1291.31 637.707C1307.83 677.6 1332.05 713.848 1362.59 744.381C1393.12 774.913 1429.37 799.133 1469.26 815.658C1509.15 832.182 1551.91 840.687 1595.09 840.687L1595.09 981.606C1533.41 981.606 1472.32 969.456 1415.33 945.85C1358.34 922.243 1306.56 887.643 1262.94 844.025C1219.32 800.407 1184.72 748.624 1161.12 691.634ZM1230.55 332.276C1206.94 275.286 1172.34 223.504 1128.72 179.885C1085.11 136.267 1033.32 101.667 976.334 78.0608C919.344 54.4551 858.264 42.3052 796.579 42.3048L1230.55 332.276Z"
                fill="url(#paint3_linear_3110_5715)"
              />
              <mask
                id="mask2_3110_5715"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="-2"
                y="42"
                width="1598"
                height="940"
              >
                <path
                  opacity="0.3"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1161.12 691.634C1137.51 634.644 1125.36 573.562 1125.36 511.877L1125.39 511.877C1125.37 468.75 1116.86 426.048 1100.36 386.204C1083.83 346.31 1059.61 310.063 1029.08 279.53C998.547 248.997 962.299 224.777 922.406 208.253C882.513 191.728 839.756 183.224 796.576 183.224C753.397 183.224 710.641 191.729 670.749 208.253C630.856 224.777 594.608 248.997 564.075 279.53C533.542 310.063 509.322 346.31 492.798 386.204C476.274 426.097 467.769 468.854 467.769 512.034L467.729 512.034C467.729 573.719 455.579 634.801 431.973 691.791C408.367 748.781 373.767 800.564 330.149 844.182C286.53 887.801 234.748 922.401 177.757 946.007C120.767 969.613 59.6856 981.763 -2.00004 981.763L-2.00003 840.844C41.1799 840.844 83.9371 832.339 123.83 815.815C163.723 799.291 199.971 775.071 230.504 744.538C261.037 714.005 285.257 677.757 301.781 637.864C318.305 597.971 326.81 555.214 326.81 512.034L326.85 512.034C326.85 450.348 339 389.266 362.606 332.276C386.212 275.286 420.812 223.504 464.431 179.885C508.049 136.267 559.831 101.667 616.822 78.0608C673.812 54.4547 734.893 42.3048 796.579 42.3048L796.576 42.3048L1230.55 332.276C1254.16 389.266 1266.3 450.348 1266.3 512.034L1266.28 512.034C1266.3 555.16 1274.81 597.862 1291.31 637.707C1307.83 677.6 1332.05 713.848 1362.59 744.381C1393.12 774.913 1429.37 799.133 1469.26 815.658C1509.15 832.182 1551.91 840.687 1595.09 840.687L1595.09 981.606C1533.41 981.606 1472.32 969.456 1415.33 945.85C1358.34 922.243 1306.56 887.643 1262.94 844.025C1219.32 800.407 1184.72 748.624 1161.12 691.634ZM1230.55 332.276C1206.94 275.286 1172.34 223.504 1128.72 179.885C1085.11 136.267 1033.32 101.667 976.334 78.0608C919.344 54.4551 858.264 42.3052 796.579 42.3048L1230.55 332.276Z"
                  fill="url(#paint4_linear_3110_5715)"
                />
              </mask>
              <g mask="url(#mask2_3110_5715)">
                <g filter="url(#filter1_f_3110_5715)">
                  <circle
                    cx="318.593"
                    cy="727.59"
                    r="193.34"
                    transform="rotate(90 318.593 727.59)"
                    fill="#49B4E1"
                  />
                </g>
              </g>
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1161.12 332.43C1137.51 389.421 1125.36 450.502 1125.36 512.188L1125.39 512.188C1125.37 555.315 1116.86 598.017 1100.36 637.862C1083.83 677.755 1059.61 714.003 1029.08 744.536C998.547 775.069 962.299 799.289 922.406 815.813C882.514 832.337 839.758 840.842 796.579 840.842C753.399 840.842 710.642 832.337 670.749 815.813C630.856 799.288 594.608 775.068 564.075 744.536C533.542 714.003 509.322 677.755 492.798 637.862C476.274 597.969 467.769 555.212 467.769 512.032L467.729 512.032C467.729 450.346 455.579 389.264 431.973 332.274C408.367 275.284 373.767 223.501 330.149 179.883C286.53 136.265 234.748 101.665 177.757 78.0586C120.767 54.4525 59.6857 42.3026 -1.99996 42.3026L-1.99997 183.221C41.18 183.221 83.9372 191.726 123.83 208.251C163.723 224.775 199.971 248.995 230.504 279.528C261.037 310.06 285.257 346.308 301.781 386.201C318.305 426.094 326.81 468.852 326.81 512.032L326.85 512.032C326.85 573.717 339 634.799 362.606 691.789C386.212 748.779 420.812 800.562 464.431 844.18C508.049 887.799 559.831 922.399 616.822 946.005C673.811 969.61 734.891 981.76 796.576 981.761L1230.55 691.789C1254.16 634.799 1266.31 573.717 1266.31 512.032L1266.28 512.032C1266.3 468.905 1274.81 426.203 1291.31 386.358C1307.83 346.465 1332.05 310.217 1362.59 279.684C1393.12 249.151 1429.37 224.931 1469.26 208.407C1509.15 191.883 1551.91 183.378 1595.09 183.378L1595.09 42.4589C1533.41 42.4589 1472.32 54.6088 1415.33 78.2149C1358.34 101.821 1306.56 136.421 1262.94 180.039C1219.32 223.658 1184.72 275.44 1161.12 332.43Z"
                fill="url(#paint5_linear_3110_5715)"
              />
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M431.976 290.129C455.582 347.119 467.732 408.201 467.732 469.886L467.706 469.886C467.727 513.013 476.231 555.715 492.736 595.559C509.26 635.452 533.48 671.7 564.013 702.233C594.545 732.766 630.793 756.986 670.686 773.51C710.579 790.034 753.337 798.539 796.517 798.539C839.694 798.538 882.449 790.034 922.34 773.51C962.233 756.986 998.481 732.766 1029.01 702.233C1059.55 671.7 1083.77 635.453 1100.29 595.559C1116.82 555.666 1125.32 512.909 1125.32 469.729L1266.24 469.729C1266.24 531.415 1254.09 592.497 1230.48 649.487C1206.88 706.477 1172.28 758.259 1128.66 801.878C1085.04 845.496 1033.26 880.096 976.267 903.702C919.277 927.308 858.195 939.458 796.51 939.458L796.51 939.458C734.826 939.457 673.747 927.307 616.759 903.702C559.769 880.096 507.986 845.496 464.368 801.878C420.75 758.259 386.15 706.477 362.544 649.487C338.938 592.496 326.788 531.415 326.788 469.729L326.814 469.729C326.793 426.603 318.289 383.901 301.784 344.056C285.26 304.163 261.04 267.915 230.507 237.382C199.975 206.85 163.727 182.63 123.834 166.105C83.9405 149.581 41.1834 141.076 -1.99661 141.076L-1.9966 0.15741C59.6891 0.157412 120.771 12.3073 177.761 35.9134C234.751 59.5195 286.534 94.1195 330.152 137.738C373.77 181.356 408.37 233.139 431.976 290.129ZM1125.36 469.729C1125.36 408.043 1137.51 346.962 1161.12 289.972C1184.72 232.981 1219.32 181.199 1262.94 137.581C1306.56 93.9622 1358.34 59.3622 1415.33 35.7561C1472.32 12.15 1533.41 0.00012815 1595.09 0.000130846L1595.09 140.919C1551.91 140.919 1509.15 149.424 1469.26 165.948C1429.37 182.472 1393.12 206.692 1362.59 237.225C1332.05 267.758 1307.83 304.006 1291.31 343.899C1274.79 383.792 1266.28 426.549 1266.28 469.729L1125.36 469.729Z"
                fill="url(#paint6_linear_3110_5715)"
              />
              <path
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M431.976 290.129C455.582 347.119 467.732 408.201 467.732 469.886L467.706 469.886C467.727 513.013 476.231 555.715 492.736 595.559C509.26 635.452 533.48 671.7 564.013 702.233C594.545 732.766 630.793 756.986 670.686 773.51C710.579 790.034 753.337 798.539 796.517 798.539C839.694 798.538 882.449 790.034 922.34 773.51C962.233 756.986 998.481 732.766 1029.01 702.233C1059.55 671.7 1083.77 635.453 1100.29 595.559C1116.82 555.666 1125.32 512.909 1125.32 469.729L1266.24 469.729C1266.24 531.415 1254.09 592.497 1230.48 649.487C1206.88 706.477 1172.28 758.259 1128.66 801.878C1085.04 845.496 1033.26 880.096 976.267 903.702C919.277 927.308 858.195 939.458 796.51 939.458L796.51 939.458C734.826 939.457 673.747 927.307 616.759 903.702C559.769 880.096 507.986 845.496 464.368 801.878C420.75 758.259 386.15 706.477 362.544 649.487C338.938 592.496 326.788 531.415 326.788 469.729L326.814 469.729C326.793 426.603 318.289 383.901 301.784 344.056C285.26 304.163 261.04 267.915 230.507 237.382C199.975 206.85 163.727 182.63 123.834 166.105C83.9405 149.581 41.1834 141.076 -1.99661 141.076L-1.9966 0.15741C59.6891 0.157412 120.771 12.3073 177.761 35.9134C234.751 59.5195 286.534 94.1195 330.152 137.738C373.77 181.356 408.37 233.139 431.976 290.129ZM1125.36 469.729C1125.36 408.043 1137.51 346.962 1161.12 289.972C1184.72 232.981 1219.32 181.199 1262.94 137.581C1306.56 93.9622 1358.34 59.3622 1415.33 35.7561C1472.32 12.15 1533.41 0.00012815 1595.09 0.000130846L1595.09 140.919C1551.91 140.919 1509.15 149.424 1469.26 165.948C1429.37 182.472 1393.12 206.692 1362.59 237.225C1332.05 267.758 1307.83 304.006 1291.31 343.899C1274.79 383.792 1266.28 426.549 1266.28 469.729L1125.36 469.729Z"
                fill="url(#paint7_linear_3110_5715)"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_f_3110_5715"
              x="746.845"
              y="-23.0147"
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
                result="effect1_foregroundBlur_3110_5715"
              />
            </filter>
            <filter
              id="filter1_f_3110_5715"
              x="-42.1473"
              y="366.85"
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
                result="effect1_foregroundBlur_3110_5715"
              />
            </filter>
            <linearGradient
              id="paint0_linear_3110_5715"
              x1="-3.79886e-06"
              y1="461.5"
              x2="808"
              y2="461.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.635417" stopColor="#D9D9D9" />
              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_3110_5715"
              x1="1643.99"
              y1="912.524"
              x2="796.547"
              y2="411.015"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_3110_5715"
              x1="1643.99"
              y1="912.524"
              x2="796.547"
              y2="411.015"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_3110_5715"
              x1="-2.00011"
              y1="1088.71"
              x2="714.47"
              y2="248.39"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_3110_5715"
              x1="-2.00011"
              y1="1088.71"
              x2="714.47"
              y2="248.39"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_3110_5715"
              x1="68.0883"
              y1="96.3848"
              x2="359.217"
              y2="260.787"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_3110_5715"
              x1="1427.19"
              y1="-59.616"
              x2="1223.22"
              y2="311.835"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint7_linear_3110_5715"
              x1="440.399"
              y1="723.466"
              x2="1146.76"
              y2="702.301"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.489583" stopColor="white" />
              <stop offset="0.96875" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      <section className={styles.section}>
        <div className={styles.h3 + " mb-6 sm:mb-0"}>Our Backers</div>
        {mobile ? (
          <div className="flex text-center mb-12">
            This wouldn’t have been possible without our incredible investors on
            the team.
          </div>
        ) : (
          ""
        )}
        <div className="grid sm:grid-cols-4 sm:grid-rows-1 grid-rows-2 grid-cols-2 gap-2 sm:gap-6">
          <div
            className={
              styles.backers + " flex flex-col justify-center items-center"
            }
          >
            <svg
              width="151"
              height="41"
              viewBox="0 0 151 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.backersImg}
            >
              <g clipPath="url(#clip0_3291_6313)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M37.0196 5.63323C37.2876 5.99093 37.377 6.34862 37.377 6.79568C37.377 8.76292 37.2876 10.7302 37.0196 12.6974C37.0196 12.8762 36.9302 13.1445 36.8407 13.4127L18.5992 8.22641L0.447094 13.4127C0.447094 13.1445 0.357676 12.9656 0.357676 12.6974C0.0894192 10.7302 0 8.76292 0 6.79568C0 6.34862 0.0894192 5.99093 0.357676 5.63323C0.625933 5.27558 0.983611 5.09673 1.4307 4.91788C3.39792 4.38138 18.5992 -0.000152588 18.6886 -0.000152588C18.778 -0.000152588 34.0687 4.38138 35.9465 4.91788C36.3935 5.00733 36.7513 5.18614 37.0196 5.63323ZM0.894192 15.9164C1.4307 18.5096 2.23548 21.0133 3.30851 23.5171L18.6886 19.1355L34.0687 23.5171C35.1417 21.0133 35.9465 18.5096 36.483 15.9164L18.6886 10.8196L0.894192 15.9164ZM4.47094 25.842C4.56038 26.0208 4.56038 26.1102 4.64979 26.1996C5.81223 28.3457 7.15353 30.4023 8.76307 32.2801C9.12076 32.7272 9.12076 32.7272 9.12076 32.7272L18.778 30.0446L28.4353 32.7272C28.4353 32.7272 28.4353 32.7272 28.7929 32.2801C30.313 30.4023 31.7438 28.3457 32.9062 26.1996C32.9956 26.1102 32.9956 25.9314 33.085 25.842L18.8674 21.7287L4.47094 25.842ZM132.966 19.2249H123.309V14.6646H131.804V11.982H123.309V7.60047H132.877V4.91788H120.358V21.8181H132.966V19.2249ZM139.404 21.9075H136.454V5.00733H143.965C147.81 5.00733 150.224 7.06397 150.224 10.3725C150.224 13.1445 148.525 14.8434 146.2 15.4693L150.761 21.8181H147.273L143.16 15.9164H139.494V21.9075H139.404ZM139.404 13.4127H143.697C145.842 13.4127 147.184 12.3397 147.184 10.5513C147.184 8.67351 145.842 7.68988 143.697 7.68988H139.404V13.4127ZM86.7366 21.9075H83.6964L91.1182 4.91788H93.8901L101.312 21.9075H98.1822L96.4832 17.7942H88.5247L86.7366 21.9075ZM89.598 15.2011H95.4103L92.4594 8.40522L89.598 15.2011ZM10.9091 34.7839C10.9986 34.9627 11.088 35.0521 11.1774 35.1415C11.4457 35.4098 11.6245 35.5886 11.8928 35.8569C13.6811 37.5558 15.6483 39.0759 17.7944 40.4171C18.0626 40.596 18.4203 40.6855 18.6886 40.6855C18.9568 40.6855 19.3145 40.596 19.5828 40.4171C21.7288 39.0759 23.6961 37.6452 25.4845 35.8569C25.7527 35.5886 25.9315 35.4098 26.1998 35.1415C26.2892 35.0521 26.3786 34.9627 26.4681 34.7839C26.4681 34.7839 18.8674 32.6378 18.6886 32.6378C18.5097 32.5484 10.9091 34.7839 10.9091 34.7839ZM55.2609 21.9075H49.0015V5.00733H55.2609C60.5369 5.00733 64.2029 8.67351 64.2029 13.4127C64.2029 18.1519 60.5369 21.9075 55.2609 21.9075ZM51.8629 19.2249H55.1715C58.7484 19.2249 60.9837 16.8106 60.9837 13.5021C60.9837 10.1936 58.659 7.77932 55.1715 7.77932H51.8629V19.2249ZM116.066 28.2563L121.163 39.4337H119.822L118.48 36.4828H112.4L111.059 39.4337H109.807L114.903 28.2563H116.066ZM118.033 35.4098L115.529 29.687L113.026 35.4098H118.033ZM106.319 39.4337H107.571V28.3457H106.319V39.4337ZM121.163 29.5081H124.918V39.5231H126.17V29.5081H129.926V28.3457H121.163V29.5081ZM53.6513 28.2563L58.7484 39.4337H57.4072L56.0659 36.4828H49.9853L48.6441 39.4337H47.3923L52.489 28.2563H53.6513ZM55.5293 35.4098L53.0256 29.687L50.5216 35.4098H55.5293ZM107.214 21.9075H104.263V5.00733H110.88C114.814 5.00733 117.318 7.24278 117.318 10.6407C117.318 14.4857 114.278 16.4529 110.611 16.4529H107.303V21.9075H107.214ZM107.214 13.7704H110.701C112.936 13.7704 114.367 12.5185 114.367 10.7302C114.367 8.76292 112.936 7.68988 110.701 7.68988H107.214V13.7704ZM133.503 34.4262H139.583V33.2637H133.503V29.4187H140.299V28.2563H132.251V39.4337H140.388V38.2713H133.503V34.4262ZM146.915 33.2637C144.501 32.7272 143.875 32.1907 143.875 31.1177C143.875 30.1341 144.77 29.3293 146.29 29.3293C147.452 29.3293 148.436 29.687 149.509 30.5812L150.224 29.5975C149.062 28.7034 147.899 28.2563 146.29 28.2563C144.143 28.2563 142.623 29.5081 142.623 31.2965C142.623 33.1743 143.786 33.9791 146.379 34.5156C148.704 35.0521 149.24 35.5886 149.24 36.6617C149.24 37.8241 148.257 38.5396 146.737 38.5396C145.217 38.5396 144.054 38.003 142.892 36.93L142.087 37.8241C143.428 38.9865 144.859 39.6125 146.647 39.6125C148.883 39.6125 150.492 38.3607 150.492 36.4828C150.492 34.7839 149.419 33.8003 146.915 33.2637ZM74.665 33.2637C72.2508 32.7272 71.6247 32.1907 71.6247 31.1177C71.6247 30.1341 72.5187 29.3293 74.0389 29.3293C75.2016 29.3293 76.1851 29.687 77.258 30.5812L77.9736 29.5975C76.8108 28.7034 75.6485 28.2563 74.0389 28.2563C71.893 28.2563 70.3729 29.5081 70.3729 31.2965C70.3729 33.1743 71.5352 33.9791 74.1283 34.5156C76.4534 35.0521 76.9897 35.5886 76.9897 36.6617C76.9897 37.8241 76.0062 38.5396 74.4861 38.5396C72.9659 38.5396 71.8036 38.003 70.6412 36.93L69.8362 37.8241C71.1775 38.9865 72.6082 39.6125 74.3966 39.6125C76.6323 39.6125 78.2415 38.3607 78.2415 36.4828C78.331 34.7839 77.1686 33.8003 74.665 33.2637ZM99.5235 38.5396C97.1093 38.5396 95.2314 36.4828 95.2314 33.8897C95.2314 31.2965 97.1093 29.3293 99.5235 29.3293C101.044 29.3293 102.117 29.9552 103.011 30.8494L103.905 29.9552C102.832 28.8822 101.58 28.1668 99.5235 28.1668C96.2149 28.1668 93.8901 30.76 93.8901 33.9791C93.8901 37.1984 96.3043 39.702 99.434 39.702C101.491 39.702 102.743 38.897 103.905 37.7346L103.1 36.93C102.117 37.9135 101.044 38.5396 99.5235 38.5396ZM64.6501 33.2637C62.2355 32.7272 61.6098 32.1907 61.6098 31.1177C61.6098 30.1341 62.5039 29.3293 64.024 29.3293C65.1864 29.3293 66.1702 29.687 67.2432 30.5812L67.9583 29.5975C66.796 28.7034 65.6336 28.2563 64.024 28.2563C61.8781 28.2563 60.358 29.5081 60.358 31.2965C60.358 33.1743 61.5204 33.9791 64.1134 34.5156C66.4385 35.0521 66.9748 35.5886 66.9748 36.6617C66.9748 37.8241 65.9913 38.5396 64.4712 38.5396C62.9511 38.5396 61.7887 38.003 60.6259 36.93L59.8213 37.8241C61.1626 38.9865 62.5933 39.6125 64.3818 39.6125C66.6171 39.6125 68.2266 38.3607 68.2266 36.4828C68.3161 34.7839 67.1537 33.8003 64.6501 33.2637ZM91.7439 33.8897C91.7439 37.0195 89.4192 39.702 86.0211 39.702C82.6231 39.702 80.3878 37.0195 80.3878 33.9791C80.3878 30.8494 82.7125 28.1668 86.1105 28.1668C89.5086 28.1668 91.7439 30.76 91.7439 33.8897ZM90.4921 33.8897C90.4921 31.3859 88.6142 29.2399 86.1105 29.2399C83.6069 29.2399 81.729 31.2965 81.729 33.8897C81.729 36.4828 83.6069 38.5396 86.1105 38.5396C88.6142 38.5396 90.4921 36.4828 90.4921 33.8897ZM82.0868 21.9075H78.5993L74.4861 16.0058H70.8201V21.9075H67.8692V5.00733H75.3801C79.2254 5.00733 81.6396 7.06397 81.6396 10.3725C81.6396 13.1445 79.9406 14.8434 77.6158 15.4693L82.0868 21.9075ZM75.1122 13.4127C77.258 13.4127 78.5993 12.3397 78.5993 10.5513C78.5993 8.67351 77.258 7.68988 75.1122 7.68988H70.8201V13.3233H75.1122V13.4127Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_3291_6313">
                  <rect width="151" height="40.9185" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <div className={styles.backersTitle}>Draper Associates</div>
          </div>
          <div
            className={
              styles.backers + " flex flex-col justify-center items-center"
            }
          >
            <img src="/boostVC.svg" />
            <div className={styles.backersTitle + " text-center"}>Boost VC</div>
          </div>
          <div
            className={
              styles.backers + " flex flex-col justify-center items-center"
            }
          >
            <img src="/maven11.svg" />
            <div className={styles.backersTitle + " text-center"}>
              Maven 11 Capital
            </div>
          </div>
          <div
            className={
              styles.backers + " flex flex-col justify-center items-center"
            }
          >
            <img src="/arcanum.svg" />
            <div className={styles.backersTitle + " text-center"}>
              Arcanum Capital
            </div>
          </div>
        </div>
        <div
          className={
            "grid sm:grid-cols-3 sm:grid-rows-1 sm:gap-6 grid-rows-2 grid-cols-2 gap-2 " +
            styles.backers2Section
          }
        >
          <div className={styles.backers2 + " flex"}>
            <img src="./sandeep.svg" className="mr-2" />

            <div>
              <div className={styles.backers2Name}>Sandeep Nailwal</div>
              <div className={styles.backers2Title}>Co-founder polygon</div>
            </div>
          </div>
          <div className={styles.backers2 + " flex"}>
            <img src="./tanmay.svg" className="mr-2" />
            <div>
              <div className={styles.backers2Name}>Tanmay Bhat</div>
              <div className={styles.backers2Title}>
                Comedian, Investor, YouTube influencer
              </div>
            </div>
          </div>

          <div className={styles.backers2 + " flex"}>
            <img src="./tushar.svg" className="mr-2" />
            <div>
              <div className={styles.backers2Name}>Tushar Aggarwal</div>
              <div className={styles.backers2Title}>
                Founder and CEO, Persistence
              </div>
            </div>
          </div>
          {mobile ? (
            <div className={styles.backers2 + " flex"}>
              <img src="./zhi.svg" className="mr-2" />
              <div>
                <div className={styles.backers2Name}>Zhi Hao Loy</div>
                <div className={styles.backers2Title}>
                  General Counsel, Persistence
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className={classnames(
            "grid grid-cols-2 grid-rows-1 sm:gap-6 gap-2 ",
            [styles.backers2Section],
            [styles.backersSectionEnd]
          )}
        >
          <div className={styles.backers2 + " flex"}>
            <img src="./akshay.svg" className="mr-2" />
            <div>
              <div className={styles.backers2Name}>Akshay BD</div>
              <div className={styles.backers2Title}>
                Investor and Co-creator Superteam DAO
              </div>
            </div>
          </div>
          {mobile ? (
            ""
          ) : (
            <div className={styles.backers2 + " flex"}>
              <img src="./zhi.svg" className="mr-2" />
              <div>
                <div className={styles.backers2Name}>Zhi Hao Loy</div>
                <div className={styles.backers2Title}>
                  General Counsel, Persistence
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section + " relative"}>
        <h3 className={styles.h3}>Meet the Team</h3>
        <div
          className={
            "grid sm:grid-rows-4 sm:grid-cols-3 grid-cols-2 grid-rows-5 sm:gap-2 sm:justify-center " +
            styles.teamWrapper
          }
        >
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/parth.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/faza.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Faza Mahamood</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/snehil.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Snehil Buxy</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/janani.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Janani Anbarasan</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/stian.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Stian Sandsgaard</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/hariom.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Hariom Verma</div>
              </div>
            </div>
          </div>

          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/kushagra.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Kushagra Singh</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/abhiti.svg"
              loading="lazy"
              height={mobile ? 160 : 470}
              width={mobile ? 160 : 470}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Abhiti Darbar</div>
              </div>
            </div>
          </div>
          <div className={"sm:row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/ejaaz.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Ejaaz Mahamood</div>
              </div>
            </div>
          </div>
          {mobile ? (
            <div className={"relative " + styles.teamCard}>
              <img
                className={" top-16 absolute"}
                src="/avatar.svg"
                loading="lazy"
                height={170}
                width={170}
              />
              <div className={styles.teamLabelContainer + " "}>
                <div
                  className={classnames([styles.teamName], [styles.joining])}
                >
                  Interested in joining?
                </div>
              </div>
              <div className={classnames("mt-0 ml-10 absolute")}>
                <button
                  className={
                    "btn btn-sm w-full h-5 py-0.5 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 "
                  }
                  onClick={() => {
                    if (window) {
                      window.open("https://angel.co/company/gitopia");
                    }
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {!mobile ? (
          <div className={"sm:ml-16  " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/avatar.svg"
              loading="lazy"
              height={mobile ? 180 : 540}
              width={mobile ? 180 : 540}
            />
            <div className={styles.teamLabelContainer}>
              <div className={classnames([styles.teamName], [styles.joining])}>
                Interested in joining?
              </div>
            </div>
            <div className={classnames("sm:mb-3 ml-12 lg:ml-20 sm:mt-3")}>
              <button
                className={
                  "btn w-60 h-12 py-3 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 "
                }
                onClick={() => {
                  if (window) {
                    window.open("https://angel.co/company/gitopia");
                  }
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <svg
          width="418"
          height="1024"
          viewBox="0 0 418 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile ? "hidden" : "absolute z-1 pointer-events-none left-0 top-0"
          }
        >
          <g filter="url(#filter0_f_3129_8187)">
            <path
              d="M-295.954 733.855C-88.5255 591.999 9.33113 736.284 99.8606 645.754C190.39 555.225 190.39 408.448 99.8606 317.918C9.33109 227.389 -137.446 227.389 -227.976 317.918C-318.505 408.448 -518.343 918.806 -295.954 733.855Z"
              fill="url(#paint0_radial_3129_8187)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3129_8187"
              x="-647.287"
              y="0.021019"
              width="1065.04"
              height="1023.89"
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
                stdDeviation="125"
                result="effect1_foregroundBlur_3129_8187"
              />
            </filter>
            <radialGradient
              id="paint0_radial_3129_8187"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-64.0576 481.836) rotate(45) scale(231.815 231.815)"
            >
              <stop offset="0.442708" stopColor="#992D81" />
              <stop offset="1" stopColor="#6029DB" />
            </radialGradient>
          </defs>
        </svg>
        <svg
          width="431"
          height="1652"
          viewBox="0 0 431 1652"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            mobile ? "hidden" : "absolute z-1 pointer-events-none right-0"
          }
        >
          <g filter="url(#filter0_f_3129_8188)">
            <path
              d="M471.459 1232.8C505.102 792.263 199.39 770.103 257.649 552.68C315.907 335.257 539.391 206.228 756.814 264.487C974.238 322.745 1103.27 546.229 1045.01 763.652C986.749 981.075 385.347 1733.99 471.459 1232.8Z"
              fill="url(#paint0_radial_3129_8188)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3129_8188"
              x="0.244629"
              y="0.497864"
              width="1308.75"
              height="1651.19"
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
                stdDeviation="125"
                result="effect1_foregroundBlur_3129_8188"
              />
            </filter>
            <radialGradient
              id="paint0_radial_3129_8188"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(651.328 658.166) rotate(-165) scale(407.567 407.567)"
            >
              <stop offset="0.442708" stopColor="#992D81" />
              <stop offset="1" stopColor="#6029DB" />
            </radialGradient>
          </defs>
        </svg>
      </section>

      <footer
        className={styles.footerContainer + " flex flex-col items-center"}
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
          <div className={styles.footerSection + (mobile ? " pr-14" : "")}>
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
                    window.open("https://gitopia.com/season-of-blockchains");
                  }
                }}
                target="_blank"
                className={styles.footerLinks + " cursor-pointer"}
              >
                {mobile ? "GSoB" : "Season of Blockchains"}
              </div>
            </div>
          </div>
          <div className={styles.footerSection + " pr-20 sm:pr-5 lg:pr-0"}>
            <div className={styles.footerTitle}>Socials</div>
            <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-3">
              <svg
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
                viewBox="0 0 40 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  if (window) {
                    window.open("https://discord.gg/95SQmmWC");
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
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
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
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
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
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
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
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
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
                  width={mobile ? "70" : "40"}
                  height={mobile ? "71" : "41"}
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute"
                >
                  <rect width="40" height="40" rx="20" fill="#222933" />
                </svg>
                <svg
                  width={mobile ? "31" : "19"}
                  height={mobile ? "25" : "17"}
                  viewBox="0 0 19 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute mt-6 ml-5 sm:mt-3 sm:ml-3"
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
                width={mobile ? "70" : "40"}
                height={mobile ? "71" : "41"}
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
          <div className="">Copyright © 2021 Gitopia | All Rights Reserved</div>
          <div className="flex ">
            <div className="mr-4">Privacy policy</div>
            <div className="mr-4">Terms of services</div>
            <div className="">Blockchain Disclaimer</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
