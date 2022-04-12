import Head from "next/head";
import styles from "../../styles/season-of-blockchains/participants.module.css";
import { useState } from "react";
export default function SeasonOfBlockchainsParticipants() {
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
      <div className={" " + styles.title}>Participants Registration</div>
      <div className={"mt-5 " + styles.content}>
        GSOB is the best gateway to enter web 3. To participate in
      </div>
      <div className={" " + styles.content}>
        GSoB you would need to do the following steps.
      </div>
      <div className={"flex items-center justify-center " + styles.section}>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-1.png"
            alt=""
          ></img>
        </div>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 1</div>
          <div className={styles.stepName1}>Discovery</div>
          <div className={styles.stepName2}>and Bonding</div>
          <div className={styles.stepMargin1}></div>
          <div className={styles.stepDetails}>
            In this step, you would get to know your blockchain projects
          </div>
          <div className={styles.stepDetails}>
            better their codebases, and other information. This is the
          </div>
          <div className={styles.stepDetails}>
            time you start writing your proposal and select the idea you
          </div>
          <div className={styles.stepDetails}>want to work on.</div>
        </div>
      </div>
      <div className={"flex items-center justify-center " + styles.section1}>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 2</div>
          <div className={styles.stepName1}>Your</div>
          <div className={styles.stepName2}>Proposal</div>
          <div className={styles.stepMargin1}></div>
          <div className={styles.stepDetails}>
            Write the best form of the proposal with all the necessary
          </div>
          <div className={styles.stepDetails}>
            details from the blog. The participants need to make a quality
          </div>
          <div className={styles.stepDetails}>
            proposal with all the necessary details mentioned in the doc.
          </div>
        </div>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-2.png"
            alt=""
          ></img>
        </div>
      </div>
      <div className={"flex items-center justify-center " + styles.section1}>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-3.png"
            alt=""
          ></img>
        </div>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 3</div>
          <div className={styles.stepName1}>Submission</div>
          <div className={styles.stepName2}>of proposal</div>
          <div className={styles.stepMargin2}></div>
          <div className={styles.stepDetails}>
            Submit your proposal to Orgs using the form.
          </div>
          <div className={styles.stepDetails}>
            There would be 2 submissions here:
          </div>
          <div className={"mt-4 " + styles.stepDetails}>
            1. Draft Proposal submission
          </div>
          <div className={styles.stepDetails}>2. Final proposal submission</div>
          <button
            onClick={() => {
              if (window) {
                window.open("https://airtable.com/shr5PEUTXvcCRF717");
              }
            }}
            type="button"
            className={
              "px-16 lg:px-10 lg:py-1 py-4 rounded text-white bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 " +
              styles.stepDetailsButton
            }
          >
            Click here to Submit
          </button>
        </div>
      </div>
      <div className={"flex items-center justify-center "}>
        <img
          className={styles.image}
          src="/season-of-blockchains/participants-center.svg"
          alt=""
        ></img>
      </div>
      <div className={"flex items-center justify-center " + styles.section1}>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-4.png"
            alt=""
          ></img>
        </div>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 4</div>
          <div className={styles.stepName1}>Get selected</div>
          <div className={styles.stepName2}>and start coding</div>
          <div className={styles.stepMargin1}></div>
          <div className={styles.stepDetails}>
            After the proposal is selected you would open a world to lots
          </div>
          <div className={styles.stepDetails}>
            of coding, cool stipend, will be part of the genesis season of
          </div>
          <div className={styles.stepDetails}>
            Gitopia, get LORE tokens on Genesis and Amazing Mentors
          </div>
          <div className={styles.stepDetails}>to help you build.</div>
        </div>
      </div>
      <div className={"flex items-center justify-center " + styles.section1}>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 5</div>
          <div className={styles.stepName1}>Don&apos;t forget to</div>
          <div className={styles.stepName2}>evaluations</div>
          <div className={styles.stepMargin1}></div>
          <div className={styles.stepDetails}>
            One of the most important part of the entire program is
          </div>
          <div className={styles.stepDetails}>
            learning and to ensure that you are getting the best out of the
          </div>
          <div className={styles.stepDetails}>
            Season of Blockchains timely submissions are very essential.
          </div>
        </div>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-5.png"
            alt=""
          ></img>
        </div>
      </div>
      <div className={"flex items-center justify-center " + styles.section1}>
        <div className={" " + styles.image2}>
          <img
            className={styles.images}
            src="/season-of-blockchains/participants-6.png"
            alt=""
          ></img>
        </div>
        <div className={styles.stepDetailsCard}>
          <div className={styles.step}>STEP 6</div>
          <div className={styles.stepName1}>Have fun</div>
          <div className={styles.stepName2}>Learning</div>
          <div className={styles.stepMargin1}></div>
          <div className={styles.stepDetails}>
            Have fun learning. Also, the partner Orgs will be paying you
          </div>
          <div className={styles.stepDetails}>
            $5000 at the end of the submission of the project and also get
          </div>
          <div className={styles.stepDetails}>
            the opportunity to get contribution points from Gitopia which
          </div>
          <div className={styles.stepDetails}>
            would make your place in the genesis supply of Gitopia.
          </div>
        </div>
      </div>
      <div className={"flex items-center justify-center mt-20 " + styles.cards}>
        <div className={"flex"}>
          <div className={"card lg:card-side " + styles.joinGitopia}>
            <div className={"mt-3 " + styles.cardLogo}>
              <figure>
                <img src="/logo-g.svg" alt="" />
              </figure>
            </div>
            <div className={"px-0 py-0 " + styles.cardDetails}>
              <div className=" ">Join the gitopia</div>
              <div className=" ">community</div>
            </div>
          </div>
        </div>
        <div className={"card lg:card-side ml-5 " + styles.endCardmargin}>
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
        width="1024"
        height="1020"
        viewBox="0 0 1024 1020"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_1123_1443)">
          <path
            d="M479.033 24.1979C43.5332 236.699 192.123 538.259 -45.918 603.724C-283.959 669.189 -530 529.289 -595.465 291.248C-660.93 53.2064 -521.03 -192.834 -282.988 -258.299C-44.9472 -323.764 1001.03 -172.302 479.033 24.1979Z"
            fill="url(#paint0_radial_1123_1443)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1123_1443"
            x="-1011.58"
            y="-673.767"
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
              result="effect1_foregroundBlur_1123_1443"
            />
          </filter>
          <radialGradient
            id="paint0_radial_1123_1443"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-164.453 172.712) rotate(74.6229) scale(447.014)"
          >
            <stop offset="0.442708" stopColor="#992D81" />
            <stop offset="1" stopColor="#6029DB" />
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
