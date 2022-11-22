import styles from "../../styles/landing.module.css";
import Head from "next/head";
import Link from "next/link";
import classnames from "classnames";
import { useState, useEffect } from "react";
export default function Rewards() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const CLIENT_ID = "b4ca5c703ee899b26505";

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

  function githubLogin() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }
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
                <a className="h-8 px-7 py-1.5 w-24 rounded-md text-white text-sm font-bold bg-green active:bg-green hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
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
                  className="px-12 sm:px-3 py-4 md:py-2 flex items-center text-3xl lg:text-sm text-white font-bold transition-all hover:text-primary"
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
              <div className={menuOpen ? "" : "mr-4 ml-4 " + styles.vl}></div>
              <li className={menuOpen ? "hidden" : "mr-4 ml-4 mt-1"}>
                <div className="flex flex-col justify-center items-center">
                  <Link href="/login">
                    <a className="h-8 px-4 py-1.5 w-24 rounded-md text-white text-sm font-bold bg-green active:bg-green hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
                      Login
                    </a>
                  </Link>
                </div>
              </li>
            </ul>
            {menuOpen ? (
              <div className="absolute bottom-0 ">
                <div className={classnames("mb-2 px-6", styles.primaryCTA)}>
                  <a
                    href="/home"
                    target="_blank"
                    className="h-14 px-8 py-4 w-80 rounded text-white text-sm font-bold bg-green active:bg-green hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    Get Started
                  </a>
                </div>
                <div className={classnames("mb-4 px-6", styles.primaryCTA)}>
                  <a
                    href="/login"
                    target="_blank"
                    className="h-14 px-8 py-4 w-80 rounded text-white text-sm font-bold bg-tranparent btn btn-outline btn-grey active:bg-green hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
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
      <section className={"flex flex-col items-center mt-40"}>
        <div className="flex flex-col ml-10">
          <div className=" text-6xl font-bold w-1/2 tracking-tight leading-[4rem]">
            Check if you’re eligble to join the Airdrop.
          </div>
          <div className="flex">
            <div>
              <div className="w-80 mt-10 tracking-tight">
                You can join the airdrop at any time as long as there are still
                tokens available. All you need to do is to create a Gitopia
                account, and connect your Github account.
              </div>
              <Link href="/home">
                <div className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md mt-10">
                  Read How to Join
                </div>
              </Link>
            </div>
            <div className="self-center ml-auto mr-10">
              <div className="opacity-50 font-bold">Total Token Available</div>
              <div className="text-4xl">184,500 tLore</div>
            </div>
          </div>
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-32">
          <div className="my-3 ml-4">Create a Gitopia Account</div>
          <Link href="/login">
            <div className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md">
              Create Account
            </div>
          </Link>
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className="my-3 ml-4">Connect your Github Account</div>
          <div
            className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md"
            onClick={() => {
              githubLogin();
            }}
          >
            Connect Github
          </div>
        </div>
        <div className="flex flex-col items-center mt-12">
          <Link href="/login">
            <div className="ml-auto btn btn-tertiary bg-[#404957] h-14 py-3 w-80 rounded-md">
              Check Eligibility
            </div>
          </Link>
          <div className="text-xs opacity-50 text-white mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
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
                    window.open("/season-of-blockchains");
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
