import { useState, useEffect} from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import classnames from "classnames";

function Design(props) {
  const router = useRouter();
	console.log(router.asPath);
  return (
		<div class="relative"
		style = {
          {
            backgroundColor: '#19072f'   
          }
      }
		>
			<div class="relative md:fixed w-full md:w-1/4 min-h-screen inset-0" id="mainNav">
          <div className="ml-28 mt-60 mr-28 text-lg group">
              <div class="py-3 pl-8"><a href="#logo-rules" className={router.asPath == "/design#logo-rules" ? "font-bold" : ""} > Logo Rules</a></div>
              <div class="py-3 pl-8"><a href="#typography" className={router.asPath == "/design#typography" ? "font-bold" : ""} >Typography </a> </div>
              <div class="py-3 pl-8"><a  href="#color">Color</a> </div>
              <div class="py-3 pl-8"><a  href="#illustrations"> Illustrations</a></div>
          </div>
			</div>

			<div class="w-full md:w-3/4 ml-auto">
				<div class="h-screen flex justify-center items-center flex-col p-10">
					<h1 class="absolute top-50 right-30 p-20 text-white text-8xl">The Digital<br />BrandBook</h1>
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
				<section id="logo-rules">
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
				<section id="typography">
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
				<section id="color">
					<div class="h-screen flex justify-center items-center flex-col p-10">
						<img
							src="/13.jpg"
						/>
					</div>
				</section>
				<section id="illustrations">
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
