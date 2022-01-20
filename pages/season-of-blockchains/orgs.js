import Head from "next/head";
import styles from "../../styles/season-of-blockchains/orgView.module.css";
import Link from "next/link";
import { useState } from "react";
export default function SeasonOfBlockchains() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>orgName</title>
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
      <div
        className={"relative flex items-center justify-center " + styles.image}
      >
        <img src="/season-of-blockchains/org-1.png"></img>
      </div>
      <div className={" " + styles.title}>52°North GmbH</div>
      <div className={"mt-5 " + styles.content}>https://52north.org/</div>
      <div className={"mt-5 " + styles.content1}>
        52°North works on innovative ideas and
      </div>
      <div className={"mt-5 " + styles.content1}>
        technologies in geoinformatics
      </div>
      <div className={"mt-5 " + styles.content2}>
        52°North is an international research and development non-profit company
        with partners from academia, the public sector and industry. Our goal is
        to foster innovation in the field of geoinformatics through a
        collaborative software development process. Our focus is Spatial
        Information Research and addresses sensor web technologies, the web of
        things, linked open data, spatial data infrastructures, citizen science,
        earth observation, and standardization. Some of our software projects
        are enviroCar, 52°North SOS, 52°North JavaScript Sensor Web Client,
        ILWIS, and 52°North WPS.
      </div>
      <div className={"mt-5 " + styles.content2}>
        Check out our GitHub organization and our Open Hub page to learn more
        about the wide range of software we work on: from mobile apps to
        standardized web services, from cutting edge research to established
        products. 52°North open source projects are used in a broad range of
        domains (e.g. oceanology, air quality, hydrology, traffic planning) and
        operational as well as research projects (e.g. European Horizon 2020 or
        National projects: see our references page). All of the 52°North
        software is published under an OSI approved open source license.
        52°North GmbH, which is the legal body, acts as a non-profit
        organization. This means that the shareholders of 52°North do not
        receive profit shares or payments from company funds. Instead, the
        profits earned by 52°North are completely re-invested into the
        innovation, research and software development process.
      </div>
      <div className={"flex items-center justify-center mt-24 " + styles.cards}>
        <div className={"card lg:card-side " + styles.joinGitopia}>
          <div className={"mt-1 " + styles.cardLogo}>
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
            <div className="">Check out ideas that you can get started on</div>
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
                className={
                  "px-16 lg:px-20 lg:py-3 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 " +
                  styles.cardButton
                }
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
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
  );
}
