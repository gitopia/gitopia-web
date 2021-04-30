import { Button, Grid, Row, Col, Icon, IconButton, Dropdown } from "rsuite";
import { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "../styles/landing.module.css";
import { update } from "lodash";

const pCircles = [
  { url: "circle1.svg", x: -470, y: -520, z: 10, mx: -100 },
  { url: "circle2.svg", x: 330, y: -250, z: 12, mx: 440 },
  { url: "circle3.svg", x: -530, y: -30, z: 14, mx: -150 },
  { url: "circle4.svg", x: 250, y: 70, z: 16, mx: 500 },
  { url: "circle5.svg", x: 500, y: 180, z: 16, mx: 850 },
  { url: "circle6.svg", x: -100, y: 190, z: 18, mx: -100 },
  { url: "circle7.svg", x: 70, y: -120, z: 20, mx: 70 },
];

export default function Landing() {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function updateCircles() {
      if (window.innerWidth > 960) {
        setOffset(window.pageYOffset);
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    }
    if (window) {
      window.addEventListener("scroll", updateCircles);
    }

    return () => {
      if (window) {
        window.removeEventListener("scroll", updateCircles);
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
          <div className={styles.platformCircles}>
            {pCircles.map((circle) => {
              return (
                <img
                  key={circle.url}
                  src={circle.url}
                  style={{
                    position: "absolute",
                    willChange: "transform",
                    transition: "transfrom 0.1s linear",
                    transform:
                      "translateX(" +
                      (isMobile ? circle.mx : circle.x) +
                      "px) translateY(" +
                      (circle.y - offset / circle.z) +
                      "px)",
                  }}
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

      <img className={styles.blob1} src="/blob1.svg" />
      <img className={styles.blob2} src="/blob2.svg" />

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
