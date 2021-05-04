import { Button, Grid, Row, Col, Icon, IconButton, Dropdown } from "rsuite";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "../styles/landing.module.css";
import { update } from "lodash";

const pCircles = [
  { url: "circle1.svg", x: -70, y: -420, z: 7, mx: -100 },
  { url: "circle2.svg", x: 430, y: -200, z: 9, mx: 440 },
  { url: "circle3.svg", x: -480, y: -100, z: 13, mx: -150 },
  { url: "circle4.svg", x: 80, y: 70, z: 15, mx: 500 },
  { url: "circle5.svg", x: 130, y: 180, z: 16, mx: 850 },
  { url: "circle6.svg", x: -50, y: -150, z: 18, mx: -100 },
  { url: "circle7.svg", x: 70, y: -420, z: 20, mx: 70 },
];
let scrollOffset = 0,
  lastOffset = 0,
  isMobile = true,
  isAnimatingCircles = false;
let platformCircles;

function updateOffset() {
  if (window.innerWidth > 960) {
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
      (pCircles[i].y - scrollOffset / pCircles[i].z) +
      "px);";
    i++;
  }
}

export default function Landing() {
  useEffect(() => {
    if (window) {
      platformCircles = document.getElementsByClassName("platformCircles");
      window.addEventListener("scroll", updateOffset);
      window.addEventListener("resize", updateOffset);
      console.log(platformCircles && platformCircles[0]);
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
      <header className={styles.header}>
        <div className={styles.headerLogo}></div>
        <div className={styles.headerLine}>
          <div className={styles.headerLinks}>
            <a href="#">Explore</a>
            <a href="#">Blog</a>
            <a href="#">Open Source</a>
            <a href="#">White Paper</a>
            <span>|</span>
            <a href="#">Try the MVP</a>
          </div>
        </div>
        <div className={styles.headerMenu}>
          <Dropdown
            renderTitle={() => {
              return (
                <IconButton
                  circle
                  icon={<Icon icon="bars" />}
                  size="lg"
                  appearance="link"
                ></IconButton>
              );
            }}
            placement="leftStart"
          >
            <Dropdown.Item>
              <a href="#">Explore</a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a href="#">Blog</a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a href="#">Open Source</a>
            </Dropdown.Item>
            <Dropdown.Item>
              <a href="#">White Paper</a>
            </Dropdown.Item>
            <Dropdown.Item divider />
            <Dropdown.Item>
              <a href="#">Try the MVP</a>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </header>

      <section className={classnames([styles.section, styles.heroSection])}>
        <div className={styles.row}>
          <h1 className={classnames([styles.h1, styles.wings])}>
            Decentralized Open Source Community
          </h1>
          <div className={styles.byline}>
            Join the new age decentralized code collaboration platform
          </div>
          <Button className={classnames([styles.button, styles.primaryCTA])}>
            Get Started
          </Button>
        </div>
      </section>

      <section className={classnames([styles.section, styles.circleSection])}>
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
                <img
                  key={circle.url}
                  src={circle.url}
                  className={classnames([
                    styles.platformCircles,
                    "platformCircles",
                  ])}
                />
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
          <div className={styles.storageAnim}>
            <div className={styles.storageAnimSource}></div>
            <div className={styles.storageAnimBarrier}>
              <div className={styles.storageAnimBarrierLine}></div>
              <div className={styles.storageAnimBarrierCircle}></div>
            </div>
            <div className={styles.storageAnimSink}></div>
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
            <Button className={classnames([styles.ml16, styles.primaryCTA])}>
              Get Started
            </Button>
          </div>
          <div className={styles.decentralizedImage}></div>
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
            <Button className={classnames([styles.ml16, styles.secondaryCTA])}>
              Read Our Terms
            </Button>
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
            <Button className={classnames([styles.ml16, styles.secondaryCTA])}>
              Read Our Terms
            </Button>
          </div>
        </div>
      </section>

      <section className={classnames([styles.section, styles.roadmapSection])}>
        <h3 className={styles.h3}>Our Roadmap</h3>
        <div className={styles.roadmapBase}>
          <div className={styles.roadmapQtrWrapper}>
            <span className={styles.roadmapYearStart}>2021</span>
            <img src="/roadmap.svg" className={styles.roadmapGraph}></img>
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
            <span class={styles.roadmapActionItem}>MVP Implementation</span>
            <span class={styles.roadmapActionItem}>Gitopia Main chain</span>
            <span class={styles.roadmapActionItem}>Gitopia Webapp</span>
            <span class={styles.roadmapActionItem}>Git Remote Helper</span>
            <span class={styles.roadmapActionItem}>Github Mirror Action</span>
            <span class={styles.roadmapActionItem}>Web Wallet</span>
            <span class={styles.roadmapActionItem}>Explorer</span>
            <span class={styles.roadmapActionItem}>Exchange Listing</span>
            <span class={styles.roadmapActionItem}>Ecosystem Partnerships</span>
            <span class={styles.roadmapActionItem}>Governance workflows</span>
            <span class={styles.roadmapActionItem}>IBC Interface</span>
            <span class={styles.roadmapActionItem}>Desktop app</span>
            <span class={styles.roadmapActionItem}>C1/CD Integrations</span>
            <span class={styles.roadmapActionItem}>Static Code Analsys</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>Meet the Team</h3>
        <div className={styles.teamWrapper}>
          <div className={styles.teamColWrapper}>
            <div className={styles.teamCard}>
              <img className={styles.teamImage} src="/team1.jpg" />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img className={styles.teamImage} src="/team1.jpg" />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
          </div>
          <div className={styles.teamColWrapper}>
            <div className={styles.teamCard}>
              <img className={styles.teamImage} src="/team1.jpg" />
              <div className={styles.teamLabel}>
                <div className={styles.teamName}>Parth Oberoi</div>
                <div className={styles.teamDesig}>CEO & Founder</div>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img className={styles.teamImage} src="/team1.jpg" />
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
            <stop offset="0.442708" stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
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
            x="0.664062"
            y="0"
            width="1343.33"
            height="1589.02"
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
            <stop stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
          </radialGradient>
        </defs>
      </svg>

      <footer className={styles.footer}>
        <div className={styles.transitionRow} style={{ width: 960 }}>
          <div className={styles.footerLogo}></div>
          <div className={styles.footerLinks}>
            <a href="#">About Us</a>

            <a href="#">White Paper</a>

            <a href="#">Deck</a>
          </div>
          <div>
            <Button className={styles.primaryCTA}>Contact Us</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
