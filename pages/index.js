import Head from "next/head";
import { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "../styles/landing.module.css";

const pCircles = [
  {
    url: "landing-circles.svg#circle1",
    x: -70,
    y: -420,
    z: 7,
    mx: -120,
    my: -500,
    r: 220,
  },
  {
    url: "landing-circles.svg#circle2",
    x: 430,
    y: -200,
    z: 9,
    mx: 440,
    my: -280,
    r: 166,
  },
  {
    url: "landing-circles.svg#circle3",
    x: -480,
    y: -100,
    z: 13,
    mx: -600,
    my: -220,
    r: 160,
  },
  {
    url: "landing-circles.svg#circle4",
    x: 80,
    y: 70,
    z: 15,
    mx: 800,
    my: 0,
    r: 134,
  },
  {
    url: "landing-circles.svg#circle5",
    x: 130,
    y: 180,
    z: 16,
    mx: 450,
    my: 100,
    r: 72,
  },
  {
    url: "landing-circles.svg#circle6",
    x: -500,
    y: -150,
    z: 18,
    mx: -500,
    my: -400,
    r: 148,
  },
  {
    url: "landing-circles.svg#circle7",
    x: -700,
    y: 100,
    z: 20,
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
    if (currentLane.children.length < 3) {
      const glob = document.createElement("div"),
        globContent = document.createElement("span"),
        style = Math.floor(Math.random() * 3),
        overallTiming = Math.random() < 0.8 ? 3 : 6;
      let animTiming =
        overallTiming == 3
          ? 1.5 * (0.5 + Math.random() / 2)
          : 5.5 * (0.75 + Math.random() / 4);
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
        window.requestIdleCallback(addOrUpdateGlobs);
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
        <link rel="icon" href="/favicon.svg" />
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
              <li className={menuOpen ? "w-full" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="#"
                >
                  Exlpore
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="#"
                >
                  Blog
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="#"
                >
                  Open Source
                </a>
              </li>
              <li className={menuOpen ? "" : "mr-4"}>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="#"
                >
                  White Paper
                </a>
              </li>
              <li>
                <a
                  className="px-3 py-4 md:py-2 flex items-center text-sm text-white font-bold border-b-2 border-white border-opacity-0 transition-all hover:border-opacity-70"
                  href="#"
                >
                  Try the MVP
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.headerLine}></div>
      </header>

      <section className={classnames([styles.section, styles.heroSection])}>
        <div className={styles.row}>
          <h1 className={classnames([styles.h1, styles.wings])}>
            Decentralized Open Source Community
          </h1>
          <div className={styles.byline}>
            Join the new age decentralized code collaboration platform
          </div>
          <div className={styles.primaryCTA}>
            <button
              type="button"
              className="px-8 py-4 w-full rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.circleSection])}>
        <div className={styles.circleSectionEllipse}></div>
        <svg width={1600} height={610} className={styles.circleSectionEllipse}>
          <use xlinkHref="landing-circles.svg#ellipse"></use>
        </svg>
        <div className={styles.row}>
          <h3 className={classnames([styles.h3, styles.hlHorizontal])}>
            Built on Cosmos
          </h3>
          <div className={classnames([styles.b16, styles.circleSectionDesc])}>
            Gitopia is an application specific blockchain built on Cosmos. It is
            optimized for high throughput and fast finality. And IBC enables
            other IBC compatible chains to integrate directly with Gitopia.
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
                  <use xlinkHref={circle.url}></use>
                </svg>
              );
            })}
          </div>
          <div className={styles.circleSectionLink}>
            Learn more about our <a>integration here</a>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.storageSection])}>
        <div className={styles.row}>
          <h3 className={styles.h3}>Permanent Storage</h3>
          <div className={styles.b16}>
            Open source code and all the collaboration data should be preserved
            forever, therefore there is a need for a permanent store.
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

      <section className={styles.section}>
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
            <div className={styles.primaryCTA}>
              <button
                type="button"
                className="ml-4 px-8 py-4 w-full rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Get Started
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
                Source code once pushed cannot be taken down from the Gitopia
                blockchain. Community decides the content policies and are
                responsible for platform moderation.
              </div>
            </div>
            <button
              type="button"
              className="ml-4 px-8 py-2 rounded text-white text-sm font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Read Our Terms
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
                In Gitopia, all the platform-related decisions will be taken
                with the involvement of validators and delegators in a
                transparent manner. They can vote on proposals and help shape
                the future of Gitopia.
              </div>
            </div>
            <button
              type="button"
              className="ml-4 px-8 py-2 rounded text-white text-sm font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Read Our Terms
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
              Start developing Gitopia blockchain built with Cosmos-SDK
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
        <div className={styles.teamWrapper}>
          <div className={styles.teamColWrapper}>
            <div className={styles.teamCard}>
              <img
                className={styles.teamImage}
                src="/team1.jpg"
                loading="lazy"
              />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img
                className={styles.teamImage}
                src="/team1.jpg"
                loading="lazy"
              />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
          </div>
          <div className={styles.teamColWrapper}>
            <div className={styles.teamCard}>
              <img
                className={styles.teamImage}
                src="/team1.jpg"
                loading="lazy"
              />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img
                className={styles.teamImage}
                src="/team1.jpg"
                loading="lazy"
              />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
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
        <g filter="url(#filter0_f)">
          <path
            d="M479.033 25.3481C43.5333 237.849 192.123 539.409 -45.9179 604.874C-283.959 670.339 -530 530.439 -595.465 292.398C-660.93 54.3567 -521.029 -191.684 -282.988 -257.149C-44.9472 -322.614 1001.03 -171.152 479.033 25.3481Z"
            fill="url(#paint0_radial)"
          />
        </g>
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
      </svg>
      <svg
        className={styles.blob2}
        width="726"
        height="1590"
        viewBox="-200 0 726 1590"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter1_f)">
          <path
            d="M1094 738.021C1094 974.399 932.377 1339.02 695.999 1339.02C459.621 1339.02 320.499 1094.02 259.499 720.021C198.499 346.021 466.499 159.021 659.999 293.521C853.499 428.021 1094 501.643 1094 738.021Z"
            fill="url(#paint1_radial)"
          />
        </g>
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
              result="effect2_foregroundBlur"
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
      </svg>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}></div>
        <div className={styles.footerLinks}>
          <a href="#">About Us</a>

          <a href="#">White Paper</a>

          <a href="#">Deck</a>
        </div>
        <div>
          <button
            type="button"
            className="px-28 py-4 rounded text-white text-sm font-bold bg-green active:bg-green-900 hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Contact Us
          </button>
        </div>
      </footer>
    </div>
  );
}
