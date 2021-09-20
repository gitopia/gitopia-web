import Head from "next/head";
import { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "../styles/landing.module.css";

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
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="The new age decentralized code collaboration platform"
        />
        <meta
          name="keywords"
          content="code, collaboration, decentralized, git"
        />
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
                  href="/home"
                  target="_blank"
                >
                  Try Testnet
                </a>
              </li>
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
              {/* <li className="border-b-2 lg:border-r-2 lg:border-b-0 border-white border-opacity-10 w-full h-2 mb-4 lg:h-6 lg:w-1 lg:mr-4 lg:mb-0 mt-2"></li> */}
            </ul>
          </div>
        </div>
        <div className={styles.headerLine}></div>
      </header>

      <section className={classnames([styles.section, styles.heroSection])}>
        <div className={styles.row}>
          <h1 className={classnames([styles.h1, styles.wings])}>
            Code Collaboration for Web3
          </h1>
          <div className={styles.byline}>
            A new age decentralized code collaboration platform for developers
            to collaborate, BUIDL, and get rewarded.
          </div>
          <div className={styles.primaryCTA}>
            <button
              onClick={() => {
                if (window) {
                  window.open("https://discord.gg/mVpQVW3vKE");
                }
              }}
              type="button"
              className="flex inline-flex items-center justify-center h-14 px-8 py-4 w-full md:w-auto mr-4 mb-8 md:mb-0 rounded text-white text-sm font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <svg
                width="42"
                height="30"
                viewBox="0 0 42 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-4"
              >
                <path
                  d="M35.6668 4.00016C35.6668 4.00016 31.463 0.709329 26.5002 0.333496L26.0528 1.22908C30.539 2.32816 32.5978 3.89933 34.7502 5.8335C31.0404 3.93966 27.3802 2.16683 21.0002 2.16683C14.6202 2.16683 10.9599 3.93966 7.25016 5.8335C9.4025 3.89933 11.8518 2.15216 15.9475 1.22908L15.5002 0.333496C10.2935 0.823913 6.3335 4.00016 6.3335 4.00016C6.3335 4.00016 1.63925 10.8073 0.833496 24.1668C5.5635 29.6237 12.7502 29.6668 12.7502 29.6668L14.2535 27.6648C11.7015 26.7775 8.82316 25.1944 6.3335 22.3335C9.30166 24.5793 13.7814 26.9168 21.0002 26.9168C28.2189 26.9168 32.6987 24.5793 35.6668 22.3335C33.1781 25.1944 30.2997 26.7775 27.7468 27.6648L29.2502 29.6668C29.2502 29.6668 36.4368 29.6237 41.1668 24.1668C40.3611 10.8073 35.6668 4.00016 35.6668 4.00016ZM15.0418 20.5002C13.269 20.5002 11.8335 18.8593 11.8335 16.8335C11.8335 14.8077 13.269 13.1668 15.0418 13.1668C16.8147 13.1668 18.2502 14.8077 18.2502 16.8335C18.2502 18.8593 16.8147 20.5002 15.0418 20.5002ZM26.9585 20.5002C25.1857 20.5002 23.7502 18.8593 23.7502 16.8335C23.7502 14.8077 25.1857 13.1668 26.9585 13.1668C28.7313 13.1668 30.1668 14.8077 30.1668 16.8335C30.1668 18.8593 28.7313 20.5002 26.9585 20.5002Z"
                  fill="white"
                />
              </svg>
              <span>Join Our Discord</span>
            </button>
            <button
              onClick={() => {
                if (window) {
                  window.open("https://t.me/Gitopia");
                }
              }}
              type="button"
              className="flex inline-flex items-center justify-center h-14 px-8 py-4 w-full md:w-auto rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <svg
                width="30"
                height="27"
                viewBox="0 0 30 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-4"
              >
                <path
                  d="M27.3288 0.495365C26.9677 0.52164 26.6132 0.606367 26.2792 0.74624H26.2747C25.9541 0.873365 24.4297 1.51461 22.1122 2.48661L13.8074 5.98424C7.84832 8.49299 1.99045 10.9635 1.99045 10.9635L2.0602 10.9365C2.0602 10.9365 1.65632 11.0692 1.23445 11.3584C0.973816 11.5242 0.749543 11.7412 0.575197 11.9962C0.368197 12.3 0.201698 12.7646 0.263573 13.245C0.364823 14.0572 0.891322 14.5444 1.26932 14.8132C1.65182 15.0855 2.01632 15.2126 2.01632 15.2126H2.02532L7.5187 17.0632C7.76507 17.8541 9.1927 22.5476 9.53582 23.6287C9.73832 24.2745 9.9352 24.6784 10.1816 24.9866C10.3008 25.1441 10.4403 25.2757 10.6079 25.3815C10.6951 25.4322 10.788 25.4722 10.8847 25.5007L10.8284 25.4872C10.8453 25.4917 10.8588 25.5052 10.8712 25.5097C10.9162 25.5221 10.9466 25.5266 11.0039 25.5356C11.8736 25.7989 12.5722 25.2589 12.5722 25.2589L12.6116 25.2274L15.8549 22.2742L21.2909 26.4446L21.4147 26.4975C22.5476 26.9947 23.6951 26.718 24.3014 26.2297C24.9123 25.7381 25.1497 25.1092 25.1497 25.1092L25.1891 25.008L29.3898 3.48787C29.5091 2.95687 29.5394 2.45962 29.4078 1.97699C29.2721 1.48854 28.9587 1.06845 28.5292 0.799115C28.1685 0.579869 27.7503 0.474045 27.3288 0.495365ZM27.2152 2.80162C27.2107 2.87249 27.2242 2.86462 27.1927 3.00074V3.01312L23.0313 24.3094C23.0133 24.3397 22.9829 24.4061 22.8997 24.4725C22.8119 24.5422 22.7422 24.5861 22.3766 24.441L15.7278 19.3436L11.7116 23.0044L12.5553 17.6156L23.4183 7.49061C23.8661 7.07436 23.7164 6.98662 23.7164 6.98662C23.7479 6.47586 23.0403 6.83699 23.0403 6.83699L9.34232 15.3229L9.33782 15.3004L2.77232 13.0897V13.0852L2.75545 13.0819C2.76696 13.078 2.77823 13.0735 2.7892 13.0684L2.8252 13.0504L2.86007 13.038C2.86007 13.038 8.72245 10.5675 14.6816 8.05874C17.6651 6.80211 20.6711 5.53649 22.9829 4.55999C25.2948 3.58912 27.0037 2.87699 27.1004 2.83874C27.1927 2.80274 27.1488 2.80274 27.2152 2.80274V2.80162Z"
                  fill="white"
                />
              </svg>
              <span>Join Our Telegram</span>
            </button>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.circleSection])}>
        <svg width="0" height="0">
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220 220"
            id="circle1"
          >
            <defs>
              <filter
                id="filter1_ii"
                x="-41"
                y="-7"
                width="265"
                height="228"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
              </filter>
            </defs>
            <g filter="url(#filter1_ii)">
              <circle cx="110" cy="110" r="110" fill="#5957AA"></circle>
            </g>
            <g opacity=".5" fill-rule="evenodd" clip-rule="evenodd" fill="#fff">
              <path d="M111.301 41.329c-.658-.606-.998-.617-1.055-.617-.057 0-.396.011-1.054.617-.676.621-1.483 1.694-2.353 3.349-1.737 3.303-3.399 8.296-4.832 14.739C99.154 72.25 97.361 90.135 97.361 110s1.793 37.75 4.646 50.583c1.433 6.443 3.095 11.436 4.832 14.739.87 1.655 1.677 2.728 2.353 3.349.658.606.997.617 1.054.617.057 0 .397-.011 1.055-.617.676-.621 1.483-1.694 2.353-3.349 1.737-3.303 3.399-8.296 4.831-14.739 2.854-12.833 4.647-30.718 4.647-50.583s-1.793-37.75-4.647-50.583c-1.432-6.443-3.094-11.436-4.831-14.739-.87-1.655-1.677-2.728-2.353-3.35zM126.374 110c0-40.058-7.221-72.53-16.128-72.53S94.119 69.941 94.119 110c0 40.057 7.22 72.53 16.127 72.53s16.128-32.473 16.128-72.53z"></path>
              <path d="M170.282 76.575c.196-.872.036-1.17.008-1.218-.028-.048-.207-.337-1.061-.603-.877-.275-2.211-.437-4.08-.363-3.732.149-8.89 1.207-15.19 3.188-12.547 3.947-28.943 11.339-46.157 21.27-17.215 9.933-31.817 20.428-41.511 29.314-4.867 4.461-8.363 8.396-10.357 11.551-1 1.581-1.525 2.816-1.726 3.711-.195.871-.035 1.17-.008 1.218.028.048.207.336 1.062.603.877.274 2.21.437 4.08.363 3.732-.149 8.89-1.207 15.19-3.189 12.547-3.947 28.943-11.338 46.157-21.27 17.214-9.932 31.817-20.427 41.511-29.313 4.867-4.461 8.362-8.397 10.357-11.551.999-1.58 1.524-2.816 1.725-3.71zm-122.889 69.69c4.454 7.709 36.204-2.278 70.916-22.307 34.712-20.028 59.242-42.514 54.789-50.223-4.454-7.709-36.204 2.278-70.917 22.307-34.712 20.028-59.241 42.514-54.788 50.223z"></path>
              <path d="M173.098 146.265c4.453-7.709-20.077-30.195-54.789-50.223-34.712-20.029-66.462-30.016-70.916-22.307-4.453 7.71 20.076 30.195 54.788 50.223 34.713 20.029 66.463 30.016 70.917 22.307zM50.2 75.357c.028-.049.208-.337 1.062-.603.877-.275 2.21-.437 4.08-.363 3.732.149 8.89 1.207 15.19 3.188 12.547 3.947 28.943 11.339 46.157 21.27 17.214 9.933 31.817 20.428 41.511 29.314 4.867 4.461 8.362 8.396 10.357 11.551.999 1.581 1.524 2.816 1.725 3.711.196.872.036 1.17.008 1.218-.028.048-.207.336-1.061.603-.877.274-2.211.437-4.08.363-3.732-.149-8.89-1.207-15.19-3.189-12.547-3.947-28.943-11.338-46.157-21.27-17.215-9.932-31.817-20.427-41.511-29.313-4.867-4.461-8.363-8.397-10.357-11.551-1-1.58-1.525-2.816-1.726-3.71-.195-.873-.035-1.171-.008-1.219z"></path>
              <path d="M63.887 89.688c2.817 0 5.1 2.285 5.1 5.103a5.102 5.102 0 11-10.2 0 5.102 5.102 0 015.1-5.103zm81.062-17.474a5.102 5.102 0 010 10.206 5.102 5.102 0 110-10.206zm-44.98 80.092a5.102 5.102 0 110 10.201 5.101 5.101 0 110-10.201zm9.993-50.983a8.64 8.64 0 11.001 17.279 8.64 8.64 0 01-.001-17.279z"></path>
            </g>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 166 166"
            id="circle2"
          >
            <defs>
              <filter
                id="filter2_ii"
                x="-41"
                y="-7"
                width="207"
                height="174"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
                <feOffset dx="-7" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 0.966667 0 0 0 0 0.747556 0 0 0 0 0.418889 0 0 0 1 0"></feColorMatrix>
                <feBlend
                  in2="effect1_innerShadow"
                  result="effect2_innerShadow"
                ></feBlend>
              </filter>
            </defs>
            <g filter="url(#filter2_ii)">
              <circle
                r="83"
                transform="matrix(-1 0 0 1 83 83)"
                fill="#AA7057"
              ></circle>
            </g>
            <path
              opacity=".5"
              d="M106.977 68.996c-.883-7.589-7.482-10.056-15.829-10.627l-.167-10.59-6.416.109.184 10.308c-1.693.04-3.428.09-5.153.184l-.195-10.352-6.416.108.199 10.535c-1.412.056-2.781.1-4.108.134l-.011-.043-8.885.17.137 6.87s4.743-.167 4.669-.101c2.61-.055 3.476 1.462 3.735 2.774l.192 12.055c.184-.003.41-.017.702.043a3.7 3.7 0 01-.69 0l.284 16.865c-.105.81-.58 2.134-2.37 2.154.067.074-4.668.1-4.668.1l-1.154 7.72 8.39-.13c1.564-.005 3.073-.041 4.594-.034l.19 10.675 6.416-.108-.167-10.589c1.747-.008 3.494-.016 5.144-.044l.199 10.535 6.415-.108-.19-10.675c10.826-.829 18.35-3.674 19.074-13.857.617-8.175-3.294-11.777-9.465-13.162 3.753-1.972 6.014-5.386 5.36-10.919zm-8.608 23.022c.156 7.968-13.554 7.314-17.91 7.377l-.249-14.158c4.357-.062 18.04-1.565 18.159 6.781zm-3.324-19.963c.112 7.29-11.3 6.619-14.923 6.669l-.216-12.832c3.623-.05 15.001-1.395 15.14 6.163z"
              fill="#fff"
            ></path>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160 160"
            id="circle3"
          >
            <defs>
              <filter
                id="filter3_ii"
                x="-41"
                y="-7"
                width="205"
                height="168"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
              </filter>
            </defs>
            <g filter="url(#filter3_ii)">
              <circle cx="80" cy="80" r="80" fill="#5778AA"></circle>
            </g>
            <g opacity=".5" fill="#fff">
              <path d="M79.493 46.152L58.411 81.137l21.082-9.582V46.152z"></path>
              <path d="M79.493 71.555L58.41 81.137l21.082 12.465V71.555zm21.086 9.582L79.493 46.152v25.403l21.086 9.582z"></path>
              <path d="M79.493 93.602l21.086-12.465-21.086-9.582v22.047zM58.41 85.137l21.083 29.711V97.594L58.41 85.137zm21.083 12.457v17.254l21.097-29.711-21.097 12.457z"></path>
            </g>
          </symbol>

          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 134 134"
            id="circle4"
          >
            <defs>
              <filter
                id="filter4_ii"
                x="-41"
                y="-7"
                width="175"
                height="141"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
                <feOffset dx="-4" dy="-4"></feOffset>
                <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 0.966667 0 0 0 0 0.747556 0 0 0 0 0.418889 0 0 0 1 0"></feColorMatrix>
                <feBlend
                  in2="effect1_innerShadow"
                  result="effect2_innerShadow"
                ></feBlend>
              </filter>
            </defs>
            <g filter="url(#filter4_ii)">
              <circle
                r="67"
                transform="matrix(-1 0 0 1 67 67)"
                fill="#AA7057"
              ></circle>
            </g>
          </symbol>
          <symbol
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 72 72"
            id="circle5"
          >
            <defs>
              <filter
                id="filter5_ii"
                x="-41"
                y="-7"
                width="113"
                height="79"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
                <feOffset dx="-3" dy="-1"></feOffset>
                <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                ></feComposite>
                <feColorMatrix values="0 0 0 0 0.889978 0 0 0 0 0.418889 0 0 0 0 0.966667 0 0 0 1 0"></feColorMatrix>
                <feBlend
                  in2="effect1_innerShadow"
                  result="effect2_innerShadow"
                ></feBlend>
              </filter>
            </defs>
            <g filter="url(#filter5_ii)">
              <circle
                r="36"
                transform="matrix(-1 0 0 1 36 36)"
                fill="#AA576B"
              ></circle>
            </g>
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
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
                <feFlood
                  flood-opacity="0"
                  result="BackgroundImageFix"
                ></feFlood>
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
              id="filter0_i"
              x="-148.084"
              y="127.923"
              width="1896.17"
              height="657.59"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
            </filter>
            <linearGradient
              id="paint0_linear"
              x1="800"
              y1="481.098"
              x2="800"
              y2="180.118"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#C4C4C4" />
              <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
            </linearGradient>
          </defs>
          <mask
            id="mask0"
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
              transform="matrix(1 0 0 -1 0 609.021)"
              fill="#paint0_linear"
            />
          </mask>
          <g mask="url(#mask0)">
            <g filter="url(#filter0_i)">
              <path
                d="M-148.084 781.512C-148.084 608.17 -48.197 441.927 129.603 319.355C307.404 196.783 548.553 127.923 800.001 127.923C1051.45 127.923 1292.6 196.783 1470.4 319.355C1648.2 441.926 1748.09 608.169 1748.09 781.512L800.001 781.512L-148.084 781.512Z"
                fill="#19072F"
              />
            </g>
          </g>
        </svg>
        <div className={styles.row}>
          <h3 className={classnames([styles.h3, styles.hlHorizontal])}>
            Built with Cosmos SDK
          </h3>
          <div className={classnames([styles.b16, styles.circleSectionDesc])}>
            Gitopia is developed using the Cosmos SDK framework. The use of
            Cosmos SDK has enabled us to leverage the Tendermint BFT consensus
            engine and build the blockchain that is optimized for Gitopia’s use
            case. Also, IBC enables other IBC compatible chains to integrate
            directly with Gitopia.
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
            Learn more about Gitopia{" "}
            <a href="https://gitopia.com/whitepaper.pdf" target="_blank">
              here
            </a>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.storageSection])}>
        <div className={styles.row}>
          <h3 className={styles.h3}>Permanent Storage</h3>
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
      </section>

      <section
        className={classnames([styles.section, styles.transitionSection])}
      >
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

      <section
        className={classnames([styles.section, styles.decentralizedSection])}
      >
        <div className={styles.rowLeftAligned}>
          <div className={styles.smallRow}>
            <h1 className={classnames([styles.h1, styles.mb72])}>
              No single point of failure
            </h1>
            <div className={classnames([styles.hlVertical, styles.mb36])}>
              <span>
                <div className={styles.b18}>
                  A Decentralized Network of Gitopia nodes provides high
                  availability and reliable service.
                </div>
              </span>
            </div>
            <div
              className={classnames([styles.decentralizedDesc, styles.mb36])}
            >
              The application is served by a decentralized network of Gitopia
              nodes, incentivised for high availability and good behaviour.
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (window) {
                    window.open("https://gitopia.com/whitepaper.pdf");
                  }
                }}
                className="ml-4 px-16 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Learn more
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

      <section
        className={classnames([styles.section, styles.censorshipSection])}
      >
        <div className={styles.cgRow}>
          <h3 className={classnames([styles.h3, styles.cgHeadline])}>
            Censorship Resistant
          </h3>
          <div className={styles.cgMidCol}></div>
          <div className={styles.cgEndCol}>
            <div className={classnames([styles.hlBorder, styles.mb36])}>
              <div>
                There is no central authority that can take down any repository
                on Gitopia. Instead, the community decides the content policies
                and is responsible for platform moderation.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window) {
                  window.open("https://gitopia.com/whitepaper.pdf");
                }
              }}
              className="ml-4 px-8 py-2 rounded text-white text-sm font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section
        className={classnames([styles.section, styles.governanceSection])}
      >
        <div className={styles.cgRow}>
          <h3 className={classnames([styles.h3, styles.cgHeadline])}>
            Governance System
          </h3>
          <div className={styles.cgMidCol}></div>
          <div className={styles.cgEndCol}>
            <div className={classnames([styles.hlBorder, styles.mb36])}>
              <div>
                In Gitopia, all the platform-related decisions are taken with
                the involvement of validators and delegators in a transparent
                manner. They create proposals as well as vote and help shape the
                future of Gitopia.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window) {
                  window.open("https://gitopia.com/whitepaper.pdf");
                }
              }}
              className="ml-4 px-8 py-2 rounded text-white text-sm font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.roadmapSection])}>
        <h3 className={styles.h3}>Our Roadmap</h3>
        <div className={styles.roadmapBase}>
          <div className={styles.roadmapQtrWrapper}>
            <span className={styles.roadmapYearStart}>2021</span>
            <img
              src="/roadmap.svg"
              className={styles.roadmapGraph}
              loading="lazy"
            ></img>
            <div
              className={classnames([
                styles.roadmapQtr,
                styles.roadmapQtrSize4,
              ])}
              style={{ marginTop: 118 }}
            >
              <span className={styles.roadmapQtrDisplay}>Q2</span>
              <span className={styles.roadmapVerticalSeperator}></span>
            </div>
            <div
              className={classnames([
                styles.roadmapQtr,
                styles.roadmapQtrSize5,
              ])}
            >
              <span className={styles.roadmapQtrDisplay}>Q3</span>
              <span className={styles.roadmapVerticalSeperator}></span>
            </div>
            <div
              className={classnames([
                styles.roadmapQtr,
                styles.roadmapQtrSize3,
              ])}
            >
              <span className={styles.roadmapQtrDisplay}>Q4</span>
              <span className={styles.roadmapVerticalSeperator}></span>
            </div>
            <div
              className={classnames([
                styles.roadmapQtr,
                styles.roadmapQtrSize4,
              ])}
            >
              <span className={styles.roadmapQtrDisplay}>Q1</span>
              <span className={styles.roadmapVerticalSeperator}></span>
            </div>
            <span className={styles.roadmapYearEnd}>2022</span>
          </div>
          <div className={styles.roadmapActions}>
            <span className={styles.roadmapActionItem}>MVP Implementation</span>
            <span className={styles.roadmapActionItem}>
              Start developing Gitopia blockchain built with Cosmos SDK
            </span>
            <span className={styles.roadmapActionItem}>
              Launch first version of Gitopia Webapp
            </span>
            <span className={styles.roadmapActionItem}>
              Release the git remote helper for Gitopia
            </span>
            <span className={styles.roadmapActionItem}>
              Release the GitHub Mirror Action for easy migration from GitHub
            </span>
            <span className={styles.roadmapActionItem}>
              Gitopia Web Wallet release
            </span>
            <span className={styles.roadmapActionItem}>
              Gitopia Explorer release
            </span>
            <span className={styles.roadmapActionItem}>
              Exchange listings of LORE token
            </span>
            <span className={styles.roadmapActionItem}>
              Ecosystem Partnerships
            </span>
            <span className={styles.roadmapActionItem}>
              Release Organization/Repository governance
            </span>
            <span className={styles.roadmapActionItem}>
              Release IBC Interface
            </span>
            <span className={styles.roadmapActionItem}>
              Launch Gitopia Desktop app
            </span>
            <span className={styles.roadmapActionItem}>
              Support CI/CD Integrations
            </span>
            <span className={styles.roadmapActionItem}>
              Release Static Code Analysis
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>Meet the Team</h3>
        <div
          className={"grid grid-rows-9 grid-cols-2 gap-2 " + styles.teamWrapper}
        >
          <div className={"row-span-4 " + styles.teamCard}>
            <img className={styles.teamImage} src="/parth.jpg" loading="lazy" />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Parth Oberoi</div>
            </div>
          </div>
          <div className={"block row-span-1 " + styles.bufferCard}></div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img className={styles.teamImage} src="/faza.jpg" loading="lazy" />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Faza Mahamood</div>
            </div>
          </div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/snehil.jpg"
              loading="lazy"
            />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Snehil Buxy</div>
            </div>
          </div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/kushagra.jpg"
              loading="lazy"
            />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Kushagra Singh</div>
            </div>
          </div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img className={styles.teamImage} src="/stian.jpg" loading="lazy" />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Stian Sandsgaard</div>
            </div>
          </div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img
              className={styles.teamImage}
              src="/hariom.jpg"
              loading="lazy"
            />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Hariom Verma</div>
            </div>
          </div>
          <div className={"row-span-4 " + styles.teamCard}>
            <img className={styles.teamImage} src="/ejaaz.jpg" loading="lazy" />
            <div className={styles.teamLabel}>
              <div className={styles.teamName}>Ejaaz Mahamood</div>
            </div>
          </div>
        </div>
      </section>

      <svg
        className={styles.blob1}
        width="874"
        height="871"
        viewBox="0 0 874 871"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="filter0_f"
            x="-861.58"
            y="-522.617"
            width="1734.73"
            height="1393.61"
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
              result="effect1_foregroundBlur"
            />
          </filter>
          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-164.453 173.863) rotate(74.6229) scale(447.014)"
          >
            <stop offset="0.442708" stopColor="#992D81" />
            <stop offset="1" stopColor="#6029DB" />
          </radialGradient>
        </defs>
        <g filter="url(#filter0_f)">
          <path
            d="M479.033 25.3481C43.5333 237.849 192.123 539.409 -45.9179 604.874C-283.959 670.339 -530 530.439 -595.465 292.398C-660.93 54.3567 -521.029 -191.684 -282.988 -257.149C-44.9472 -322.614 1001.03 -171.152 479.033 25.3481Z"
            fill="url(#paint0_radial)"
          />
        </g>
      </svg>
      <svg
        className={styles.blob2}
        width="726"
        height="1590"
        viewBox="-200 0 726 1590"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="filter1_f"
            x="-100"
            y="0"
            width="1343.33"
            height="1589.02"
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
              result="effect1_foregroundBlur"
            />
          </filter>
          <radialGradient
            id="paint1_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(665.999 738.02) rotate(90) scale(428 428)"
          >
            <stop stopColor="#992D81" />
            <stop offset="1" stopColor="#6029DB" />
          </radialGradient>
        </defs>
        <g filter="url(#filter1_f)">
          <path
            d="M1094 738.021C1094 974.399 932.377 1339.02 695.999 1339.02C459.621 1339.02 320.499 1094.02 259.499 720.021C198.499 346.021 466.499 159.021 659.999 293.521C853.499 428.021 1094 501.643 1094 738.021Z"
            fill="url(#paint1_radial)"
          />
        </g>
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
  );
}
