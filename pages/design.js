import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/design.module.css";

function Design(props) {
  /**
   * @param {number} currentPosition Current Scroll position
   * @param {Array} sectionPositionArray Array of positions of all sections
   * @param {number} startIndex Start index of array
   * @param {number} endIndex End index of array
   * @return {number} Current Active index
   */

  const logoRulesRef = useRef();
  const typographyRef = useRef();
  const colorRef = useRef();
  const illustrationsRef = useRef();

  const navHeader = [
    {
      headerTitle: "Logo Rules",
      headerRef: logoRulesRef,
      headerID: "logo-rules",
    },
    {
      headerTitle: "Typography",
      headerRef: typographyRef,
      headerID: "typography",
    },
    {
      headerTitle: "Color",
      headerRef: colorRef,
      headerID: "color",
    },
    {
      headerTitle: "Illustrations",
      headerRef: illustrationsRef,
      headerID: "illustrations",
    },
  ];

  const nearestIndex = (
    currentPosition,
    sectionPositionArray,
    startIndex,
    endIndex
  ) => {
    if (startIndex === endIndex) return startIndex;
    else if (startIndex === endIndex - 1) {
      if (
        Math.abs(
          sectionPositionArray[startIndex].headerRef.current.offsetTop -
            currentPosition
        ) <
        Math.abs(
          sectionPositionArray[endIndex].headerRef.current.offsetTop -
            currentPosition
        )
      )
        return startIndex;
      else return endIndex;
    } else {
      var nextNearest = ~~((startIndex + endIndex) / 2);
      var a = Math.abs(
        sectionPositionArray[nextNearest].headerRef.current.offsetTop -
          currentPosition
      );
      var b = Math.abs(
        sectionPositionArray[nextNearest + 1].headerRef.current.offsetTop -
          currentPosition
      );
      if (a < b) {
        return nearestIndex(
          currentPosition,
          sectionPositionArray,
          startIndex,
          nextNearest
        );
      } else {
        return nearestIndex(
          currentPosition,
          sectionPositionArray,
          nextNearest,
          endIndex
        );
      }
    }
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("header").style.fontSize = "30px";
      document.getElementById("header").style.paddingTop = "30px";
      document.getElementById("header").style.paddingBottom = "30px";
    } else {
      document.getElementById("header").style.fontSize = "90px";
      document.getElementById("header").style.paddingTop = "20%";
      document.getElementById("header").style.paddingBottom = "30px";
    }
  }

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const handleScroll = (e) => {
      window.onscroll = function () {
        scrollFunction();
      };
      var index = nearestIndex(
        window.scrollY,
        navHeader,
        0,
        navHeader.length - 1
      );
      setActiveIndex(index);
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const router = useRouter();
  console.log(router.asPath);
  return (
    <div class="relative" style={{ backgroundColor: "#19072f" }}>
      <Head>
        <title>Gitopia - BrandBook</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div
        class="relative md:fixed w-full md:w-1/4 min-h-screen inset-0"
        id="mainNav"
      >
        <div class="ml-28 mt-60 mr-28 text-lg group">
          {navHeader.map((header, index) => (
            <div class="py-3 pl-8" key={"nav" + index}>
              <a
                className={styles.a}
                key={index + header.headerID}
                style={{ color: activeIndex === index ? "white" : "grey" }}
                href={`#${header.headerID}`}
              >
                {header.headerTitle}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div class="w-full md:w-3/4 ml-auto">
        <div id="header" className={styles.header}>
          <h1>The Digital BrandBook</h1>
        </div>
        <div class="h-screen flex justify-center items-center flex-col p-10"></div>
        <div class="h-screen flex justify-center items-center flex-col p-10">
          <img src="/design/1.jpg" />
        </div>
        <div class="h-screen flex justify-center items-center flex-col p-10">
          <img src="/design/2.jpg" />
        </div>
        <div class="h-screen flex justify-center items-center flex-col p-10">
          <img src="/design/3.jpg" />
        </div>
        <section ref={logoRulesRef} id="logo-rules">
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/4.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/5.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/6.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/7.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/8.jpg" />
          </div>
        </section>
        <section ref={typographyRef} id="typography">
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/9.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/10.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/11.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/12.jpg" />
          </div>
        </section>
        <section ref={colorRef} id="color">
          <div class="h-screen flex justify-center items-center flex-col">
            <div className={styles.boxed}>
              <h6 class="text-black ml-20 pt-16 font-medium">
                DIGITAL COLOR PALETTE
              </h6>
              <div className={styles.container}>
                <div className={styles.box}>
                  <div className={styles.boxed1}>
                    <div className={styles.textName}>
                      <h6>GROWTH</h6>
                    </div>
                    <div className={styles.textId}>
                      <h6>#883BE6</h6>
                    </div>
                  </div>
                  <div className={styles.boxed1a}>
                    <h6></h6>
                  </div>
                </div>
                <div className={styles.box}>
                  <div className={styles.boxed2}>
                    <h6 className={styles.textName}>TENSION</h6>
                    <h6 className={styles.textId}>#E83D99</h6>
                  </div>
                  <div className={styles.boxed2a}>
                    <h6></h6>
                  </div>
                </div>
                <div className={styles.box}>
                  <div className={styles.boxed3}>
                    <h6 className={styles.textName}>SUCCESS</h6>
                    <h6 className={styles.textId}>#63D761</h6>
                  </div>
                  <div className={styles.boxed3a}>
                    <h6></h6>
                  </div>
                </div>
              </div>
              <div className={styles.box1}>
                <div className={styles.container}>
                  <div className={styles.container}>
                    <div>
                      <div className={styles.boxed4}>
                        <h6 className={styles.textName}>CARBON DARK</h6>
                        <h6 className={styles.textId2}>#041B2D</h6>
                      </div>
                      <div className={styles.boxed4a}>
                        <h6></h6>
                      </div>
                    </div>
                    <div>
                      <div className={styles.boxed5}>
                        <h6></h6>
                      </div>
                      <div className={styles.boxed5a}>
                        <h6></h6>
                      </div>
                    </div>
                  </div>
                  <div className={styles.box2}>
                    <div className={styles.boxed6}>
                      <h6></h6>
                    </div>
                    <div className={styles.container}>
                      <div className={styles.boxed6a}>
                        <h6></h6>
                      </div>
                      <div className={styles.box3}>
                        <h6 className={styles.h6}>#992E82</h6>
                        <div className={styles.dashBorder}></div>
                        <h6 className={styles.h62}>#612ADB</h6>
                      </div>
                      <div className={styles.boxed6b}>
                        <h6></h6>
                      </div>
                    </div>
                    <div className={styles.boxed7}>
                      <h6></h6>
                    </div>
                    <div className={styles.container}>
                      <div class="border border-gray-300 rounded-full">
                        <div className={styles.boxed7a}>
                          <h6></h6>
                        </div>
                      </div>
                      <div className={styles.box3}>
                        <h6 className={styles.h6}>#FFFFFF</h6>
                        <div className={styles.dashBorder1}></div>
                        <h6 className={styles.h62}>#D0D0D0</h6>
                      </div>
                      <div className={styles.boxed7b}>
                        <h6></h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section ref={illustrationsRef} id="illustrations">
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/14.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/15.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/16.jpg" />
          </div>
          <div class="h-screen flex justify-center items-center flex-col p-10">
            <img src="/design/17.jpg" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Design;
