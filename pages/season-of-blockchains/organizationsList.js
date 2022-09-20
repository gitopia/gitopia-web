import Head from "next/head";
import styles from "../../styles/season-of-blockchains/partnerships.module.css";
import Link from "next/link";
import { useState } from "react";
export default function Partnerships() {
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
                  href="https://airtable.com/shrQ4JO80anchv49Y"
                  target="_blank"
                  rel="noreferrer"
                >
                  Apply Now
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="https://gitopia.com/whitepaper.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="https://medium.com/gitopia"
                  target="_blank"
                  rel="noreferrer"
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
                  rel="noreferrer"
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
      <div
        className={"relative flex items-center justify-center " + styles.image}
      >
        <img src="/season-of-blockchains/org-1.png"></img>
      </div>
      <div className={"justify-center items-center " + styles.comingSoon}>
        <div className="flex justify-center ">
          <a className={"flex-none rounded " + styles.comingSoonButton}>
            COMING SOON
          </a>
        </div>
        <div className={"text-center " + styles.comingSoonTitle}>
          Become a partner
        </div>
        <div className="flex justify-center ">
          <div className={"mt-5 text-center " + styles.comingSoonBody}>
            Want to onboard fresh web 3.0 talent to your project and get
            exciting new contributions that matters?
          </div>
        </div>
        <div className="flex justify-center ">
          <a
            className={"flex-none btn " + styles.talkToUsButton}
            href={"https://airtable.com/shrtI4oMi7uPswr9I"}
            target="_blank"
            rel="noreferrer"
          >
            Talk to us
          </a>
        </div>
      </div>
      {/*
      <div className={" " + styles.title}>Partnerships</div>
      <div
        className={
          "grid grid-cols-1 grid-rows-9 sm:grid-cols-3 sm:grid-rows-3 gap-y-8 " +
          styles.orgCard
        }
      >
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"flex " + styles.cardBorder}>
        <div className={styles.cardImage}>
          <img src="/season-of-blockchains/partnerships.svg"></img>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>
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
                "lg:px-10 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 " +
                styles.cardButton
              }
            >
              Contact us
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          "grid grid-cols-1 grid-rows-9 sm:grid-cols-3 sm:grid-rows-3 gap-y-8 gap-x-10 " +
          styles.orgCard
        }
      >
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <svg
              width="140"
              height="139"
              viewBox="0 0 140 139"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="139.176" height="139" rx="8" fill="#2F3C4B" />
            </svg>
          </div>
          <div className="">
            <div className={styles.orgTitle}>Affonda</div>
            <div className={styles.orgBody}>Marketplace</div>
            <div
              className={"flex cursor-pointer " + styles.orgButton}
              onClick={() => {
                if (window) {
                  window.open("/season-of-blockchains/orgs");
                }
              }}
            >
              <div>LEARN MORE</div>
              <div className={styles.orgArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23535 6.85165H12.7059M12.7059 6.85165L7.35299 1.50549M12.7059 6.85165L7.35299 12.1978"
                    stroke="#898B8E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      <svg
        className={styles.blob1}
        width="409"
        height="1777"
        viewBox="0 0 409 1777"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_2177_3762)">
          <path
            d="M-110.04 464.017C-145.155 923.83 173.935 946.96 113.127 1173.9C52.3195 1400.84 -180.945 1535.51 -407.883 1474.7C-634.821 1413.9 -769.496 1180.63 -708.688 953.693C-647.88 726.755 -20.1594 -59.1126 -110.04 464.017Z"
            fill="url(#paint0_radial_2177_3762)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2177_3762"
            x="-1010.63"
            y="0.393463"
            width="1418.82"
            height="1776.25"
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
              stdDeviation="143.669"
              result="effect1_foregroundBlur_2177_3762"
            />
          </filter>
          <radialGradient
            id="paint0_radial_2177_3762"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-297.78 1063.8) rotate(15) scale(425.403)"
          >
            <stop offset="0.442708" stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
          </radialGradient>
        </defs>
      </svg>
      <svg
        className={styles.blob2}
        width="656"
        height="1490"
        viewBox="0 0 656 1490"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_2177_3763)">
          <path
            d="M396.143 1004.47C746.111 704.16 536.835 462.173 740.302 344.702C943.769 227.23 1203.94 296.943 1321.41 500.41C1438.89 703.877 1369.17 964.05 1165.71 1081.52C962.238 1198.99 -37.3205 1310.82 396.143 1004.47Z"
            fill="url(#paint0_radial_2177_3763)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2177_3763"
            x="0.949066"
            y="0.299347"
            width="1664.87"
            height="1489.23"
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
              stdDeviation="143.669"
              result="effect1_foregroundBlur_2177_3763"
            />
          </filter>
          <radialGradient
            id="paint0_radial_2177_3763"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(953.004 713.112) rotate(-120) scale(425.403)"
          >
            <stop offset="0.442708" stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
          </radialGradient>
        </defs>
      </svg>
       */}
      <svg
        width="409"
        height="1275"
        viewBox="0 0 409 1275"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.blob3}
      >
        <g filter="url(#filter0_f_2177_3762)">
          <path
            d="M-110.04 154.448C-145.155 614.261 173.935 637.391 113.127 864.329C52.3195 1091.27 -180.945 1225.94 -407.883 1165.13C-634.821 1104.33 -769.496 871.062 -708.688 644.124C-647.88 417.186 -20.1594 -368.682 -110.04 154.448Z"
            fill="url(#paint0_radial_2177_3762)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2177_3762"
            x="-1010.63"
            y="-309.176"
            width="1418.82"
            height="1776.25"
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
              stdDeviation="143.669"
              result="effect1_foregroundBlur_2177_3762"
            />
          </filter>
          <radialGradient
            id="paint0_radial_2177_3762"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-297.78 754.227) rotate(15) scale(425.403 425.403)"
          >
            <stop offset="0.442708" stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
          </radialGradient>
        </defs>
      </svg>
      <svg
        width="656"
        height="855"
        viewBox="0 0 656 855"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.blob4}
      >
        <g filter="url(#filter0_f_2177_3763)">
          <path
            d="M396.143 1004.47C746.111 704.16 536.835 462.173 740.302 344.702C943.769 227.23 1203.94 296.943 1321.41 500.41C1438.89 703.877 1369.17 964.05 1165.71 1081.52C962.238 1198.99 -37.3205 1310.82 396.143 1004.47Z"
            fill="url(#paint0_radial_2177_3763)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2177_3763"
            x="0.949066"
            y="0.299347"
            width="1664.87"
            height="1489.23"
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
              stdDeviation="143.669"
              result="effect1_foregroundBlur_2177_3763"
            />
          </filter>
          <radialGradient
            id="paint0_radial_2177_3763"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(953.004 713.112) rotate(-120) scale(425.403 425.403)"
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

          <a
            href="https://twitter.com/gitopiaOrg"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>

          <a href="https://t.me/Gitopia" target="_blank" rel="noreferrer">
            Telegram
          </a>

          <a href="https://medium.com/gitopia" target="_blank" rel="noreferrer">
            Medium
          </a>

          <a
            href="https://discord.gg/mVpQVW3vKE"
            target="_blank"
            rel="noreferrer"
          >
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
  );
}
