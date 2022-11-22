import { useState, useEffect } from "react";
import styles from "../styles/landing.module.css";
import classnames from "classnames";
import Link from "next/link";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
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
                className={"absolute pointer-events-none z-1 -right-10 top-1/2"}
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
  );
}
