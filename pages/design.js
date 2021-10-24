import { useState, useEffect, useRef} from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import classnames from "classnames";
import styles from "../styles/design.module.css"

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
			headerID: "logo-rules"
		},
		{
			headerTitle: "Typography",
			headerRef: typographyRef,
			headerID: "typography"
		},
		{
			headerTitle: "Color",
			headerRef: colorRef,
			headerID: "color"
		},
		{
			headerTitle: "Illustrations",
			headerRef: illustrationsRef,
			headerID: "illustrations"
		}
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
			if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
				document.getElementById("header").style.fontSize = "30px";
				document.getElementById("header").style.paddingTop = "30px";
				document.getElementById("header").style.paddingBottom = "30px";
			} else {
				document.getElementById("header").style.fontSize = "90px";
				document.getElementById("header").style.paddingTop = "300px";
				document.getElementById("header").style.paddingBottom = "30px";
			}
		}

	const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const handleScroll = (e) => {
			window.onscroll = function() {scrollFunction()};
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
		<div class="relative"
		style = {{backgroundColor: '#19072f'}}
		>
			<Head>
        <title>Gitopia - BrandBook</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

			<div class="relative md:fixed w-full md:w-1/4 min-h-screen inset-0" id="mainNav">
        <div class="ml-28 mt-60 mr-28 text-lg group">
					{navHeader.map((header, index) => (
						<div class="py-3 pl-8">
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
				<div class="h-screen flex justify-center items-center flex-col p-10">
				</div>
				<div class="h-screen flex justify-center items-center flex-col p-10">
					<img
            src="/1.jpg"
          />
				</div>
				<div class="h-screen flex justify-center items-center flex-col p-10">
					<img
						src="/2.jpg"
					/>
				</div>
				<div class="h-screen flex justify-center items-center flex-col p-10">
					<img
            src="/3.jpg"
          />
				</div>
				<section ref={logoRulesRef} id="logo-rules">
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/4.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/5.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/6.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/7.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/8.jpg"
						/>
					</div>
				</section>
				<section ref={typographyRef} id="typography">
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/9.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/10.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/11.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/12.jpg"
						/>
					</div>
				</section>
				<section ref={colorRef} id="color">
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/13.jpg"
						/>
					</div>
				</section>
				<section ref={illustrationsRef} id="illustrations">
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/14.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/15.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/16.jpg"
						/>
					</div>
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/17.jpg"
						/>
					</div>
				</section>
			</div>

		</div>
  );
}

export default Design;
