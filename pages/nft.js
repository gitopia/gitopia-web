import Head from "next/head";
import styles from "../styles/nft.module.css";
import { useState } from "react";
export default function Nft() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia</title>
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
      <div className="relative flex items-center justify-center">
        <img src="nft/nft.svg"></img>
      </div>
      <div className={" " + styles.title}>
        There are 7 billion people on earth and
      </div>
      <div className={" " + styles.title2}>
        more than 105 billion people total have
      </div>
      <div className={" " + styles.title2}>ever lived on our planet.</div>

      <div className={"mt-7 " + styles.content1}>
        But there were only a few who were able to make the difference, from
        Aryabhatta to
      </div>
      <div className={" " + styles.content1}>
        Chanakya, Steve Jobs, Elon Musk and many more were the Nerds who made
        the efforts
      </div>
      <div className={" " + styles.content1}>
        to promote humanity one innovation at a time.
      </div>
      <div
        className={"relative flex items-center justify-center " + styles.wallet}
      >
        <div className="border-2 border-grey rounded-md overflow-hidden px-8 py-4 btn-ghost focus:outline-none">
          <div className="relative flex items-center justify-center">
            <img src="/new-wallet.svg" width="129px" height="111px" />
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="mt-3 px-2 py-2 h-10 w-52 uppercase rounded text-white text-xs font-bold bg-purple active:bg-purple-900 hover:bg-purple-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Connect my wallet
          </button>
        </div>
      </div>
      <hr className={styles.hr} />
      <div className={" " + styles.content2}>
        NERDS NFT’s are made to acknowledge the contributions of innovators in
        the space and also set up a stepping stone in the future development of
        Metaverse. <br />
        The NERD genesis NFT is a generative-style collection of unique NFTs
        that live on the Cosmos B blockchain. Total 10,000 NERD NFT would be
        minted at Genesis with the unique attributes accessories, backgrounds,
        and characters.
      </div>
      <div className={" " + styles.content2}>
        The initial minting would be done at XXXX(Dates) and only gas price
        would be needed to mint your NERD on an FCFS basis. The royalty from the
        secondary sales of the NERD NFT would be donated to a DAO at Gitopia
        which would be aimed to make an immersive coding experience in the
        Metaverse and make the unique NERD characters alive in the meta world.
      </div>
      <div className={" " + styles.content3}>Attribute Rarity</div>
      <div className={"flex items-center justify-center " + styles.assetCard}>
        <div className={"w-2/5 " + styles.tableTitle1}>Asset</div>
        <div className={"w-1/5 " + styles.tableTitle2}>Amount Minted</div>
        <div className={"w-1/5 " + styles.tableTitle3}>Availability</div>
        <div className={"w-1/5 " + styles.tableTitle4}>Rarity</div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/Hair.svg"></img>
          </div>
          <div className={styles.assetName}>White Hair</div>
        </div>
        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/base.svg"></img>
          </div>
          <div className={styles.assetName}>Man</div>
        </div>

        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/base1.svg"></img>
          </div>
          <div className={styles.assetName}>Pale White Man</div>
        </div>
        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/base2.svg"></img>
          </div>
          <div className={styles.assetName}>Glasses</div>
        </div>
        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/base3.svg"></img>
          </div>
          <div className={styles.assetName}>Tatoo Man</div>
        </div>
        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={" " + styles.assetCard}>
        <div className="flex w-2/5">
          <div className={styles.asset}>
            <img src="nft/base4.svg"></img>
          </div>
          <div className={styles.assetName}>Cigar Man</div>
        </div>

        <div className={"w-1/5 " + styles.assetAmountMinted}>323 Minted</div>
        <div className={"w-1/5 " + styles.assetAvailability}>124 Available</div>
        <div className={"flex w-1/5 " + styles.rarityCard}>
          <div className={styles.rarity}>RARITY</div>
          <div className="flex flex-col justify-center items-center">
            <hr className={styles.rarityVl} />
          </div>
          <div className={styles.rarity}>2.5%</div>
        </div>
      </div>
      <hr className={styles.hr1} />
      <div className={"flex items-center justify-center mt-20 " + styles.cards}>
        <div className={"flex"}>
          <div className={"card lg:card-side " + styles.joinGitopia}>
            <div className={"mt-3 " + styles.cardLogo}>
              <figure>
                <img src="/logo-g.svg" />
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
        <g filter="url(#filter0_f_1144_1574)">
          <path
            d="M479.033 24.1979C43.5332 236.699 192.123 538.259 -45.918 603.724C-283.959 669.189 -530 529.289 -595.465 291.248C-660.93 53.2064 -521.03 -192.834 -282.988 -258.299C-44.9472 -323.764 1001.03 -172.302 479.033 24.1979Z"
            fill="url(#paint0_radial_1144_1574)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1144_1574"
            x="-1011.58"
            y="-673.767"
            width="2034.73"
            height="1693.61"
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
              stdDeviation="200"
              result="effect1_foregroundBlur_1144_1574"
            />
          </filter>
          <radialGradient
            id="paint0_radial_1144_1574"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-164.453 172.712) rotate(74.6229) scale(447.014)"
          >
            <stop offset="0.442708" stop-color="#992D81" />
            <stop offset="1" stop-color="#6029DB" />
          </radialGradient>
        </defs>
      </svg>

      <svg
        className={" " + styles.blob2}
        width="1599"
        height="983"
        viewBox="0 0 1599 983"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.2">
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
            fill="url(#paint0_linear_1217_1539)"
          />
          <mask
            id="mask0_1217_1539"
            style={{ "mask-type": "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="42"
            width="1599"
            height="941"
          >
            <path
              opacity="0.3"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
              fill="url(#paint1_linear_1217_1539)"
            />
          </mask>
          <g mask="url(#mask0_1217_1539)">
            <g filter="url(#filter0_f_1217_1539)">
              <circle
                cx="1500.79"
                cy="885.888"
                r="193.34"
                transform="rotate(90 1500.79 885.888)"
                fill="#8C49E1"
              />
            </g>
            <g filter="url(#filter1_f_1217_1539)">
              <circle
                cx="1110.5"
                cy="337.971"
                r="193.34"
                transform="rotate(90 1110.5 337.971)"
                fill="#2EDDE9"
              />
            </g>
          </g>
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
            fill="url(#paint2_linear_1217_1539)"
          />
          <mask
            id="mask1_1217_1539"
            style={{ "mask-type": "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="42"
            width="1599"
            height="941"
          >
            <path
              opacity="0.3"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1164.03 691.88C1140.42 634.89 1128.27 573.808 1128.27 512.123L1128.3 512.123C1128.28 468.996 1119.77 426.294 1103.27 386.449C1086.74 346.556 1062.52 310.308 1031.99 279.776C1001.46 249.243 965.211 225.023 925.317 208.498C885.424 191.974 842.667 183.469 799.487 183.469C756.308 183.47 713.552 191.975 673.66 208.498C633.767 225.023 597.519 249.243 566.986 279.776C536.453 310.308 512.233 346.556 495.709 386.449C479.185 426.342 470.68 469.099 470.68 512.279L470.64 512.28C470.64 573.965 458.49 635.047 434.884 692.037C411.278 749.027 376.678 800.81 333.06 844.428C289.441 888.046 237.659 922.646 180.669 946.253C123.678 969.859 62.5968 982.009 0.911092 982.009L0.911098 841.09C44.091 841.09 86.8481 832.585 126.741 816.061C166.634 799.536 202.882 775.316 233.415 744.783C263.948 714.251 288.168 678.003 304.692 638.11C321.216 598.217 329.721 555.46 329.721 512.28L329.761 512.28C329.761 450.594 341.911 389.512 365.517 332.522C389.123 275.532 423.723 223.749 467.342 180.131C510.96 136.513 562.743 101.913 619.733 78.3065C676.723 54.7004 737.805 42.5505 799.49 42.5505L799.487 42.5506L1233.46 332.522C1257.07 389.512 1269.22 450.594 1269.22 512.28L1269.19 512.28C1269.21 555.406 1277.72 598.108 1294.22 637.953C1310.75 677.846 1334.97 714.094 1365.5 744.627C1396.03 775.16 1432.28 799.38 1472.17 815.904C1512.06 832.428 1554.82 840.933 1598 840.933L1598 981.852C1536.32 981.852 1475.23 969.702 1418.24 946.096C1361.25 922.49 1309.47 887.89 1265.85 844.271C1222.24 800.653 1187.63 748.87 1164.03 691.88ZM1233.46 332.522C1209.85 275.532 1175.25 223.749 1131.64 180.131C1088.02 136.513 1036.23 101.913 979.245 78.3066C922.255 54.7009 861.175 42.5509 799.49 42.5505L1233.46 332.522Z"
              fill="url(#paint3_linear_1217_1539)"
            />
          </mask>
          <g mask="url(#mask1_1217_1539)">
            <g filter="url(#filter2_f_1217_1539)">
              <circle
                cx="321.504"
                cy="727.836"
                r="193.34"
                transform="rotate(90 321.504 727.836)"
                fill="#49B4E1"
              />
            </g>
          </g>
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1164.03 332.676C1140.42 389.666 1128.27 450.748 1128.27 512.434L1128.3 512.434C1128.28 555.561 1119.77 598.263 1103.27 638.107C1086.74 678.001 1062.52 714.248 1031.99 744.781C1001.46 775.314 965.211 799.534 925.318 816.058C885.425 832.582 842.669 841.087 799.49 841.087C756.31 841.087 713.553 832.582 673.66 816.058C633.767 799.534 597.519 775.314 566.986 744.781C536.453 714.248 512.233 678 495.709 638.107C479.185 598.214 470.68 555.457 470.68 512.277L470.64 512.277C470.64 450.591 458.49 389.51 434.884 332.52C411.278 275.529 376.678 223.747 333.06 180.129C289.441 136.51 237.659 101.91 180.669 78.3041C123.679 54.698 62.5968 42.5481 0.911174 42.5481L0.911168 183.467C44.0911 183.467 86.8482 191.972 126.741 208.496C166.634 225.02 202.882 249.24 233.415 279.773C263.948 310.306 288.168 346.554 304.692 386.447C321.216 426.34 329.721 469.097 329.721 512.277L329.761 512.277C329.761 573.963 341.911 635.044 365.517 692.035C389.123 749.025 423.723 800.807 467.342 844.426C510.96 888.044 562.743 922.644 619.733 946.25C676.722 969.856 737.803 982.006 799.487 982.006L1233.46 692.035C1257.07 635.045 1269.22 573.963 1269.22 512.277L1269.19 512.277C1269.21 469.15 1277.72 426.448 1294.22 386.604C1310.75 346.71 1334.97 310.463 1365.5 279.93C1396.03 249.397 1432.28 225.177 1472.17 208.653C1512.06 192.128 1554.82 183.624 1598 183.624L1598 42.7048C1536.32 42.7048 1475.23 54.8547 1418.24 78.4608C1361.25 102.067 1309.47 136.667 1265.85 180.285C1222.24 223.904 1187.64 275.686 1164.03 332.676Z"
            fill="url(#paint4_linear_1217_1539)"
          />
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M434.887 290.374C458.493 347.364 470.643 408.446 470.643 470.131L470.617 470.131C470.638 513.258 479.142 555.96 495.646 595.805C512.17 635.698 536.39 671.946 566.923 702.479C597.456 733.011 633.704 757.231 673.597 773.756C713.49 790.28 756.247 798.785 799.427 798.785C842.606 798.784 885.362 790.28 925.254 773.756C965.147 757.232 1001.39 733.012 1031.93 702.479C1062.46 671.946 1086.68 635.698 1103.2 595.805C1119.73 555.912 1128.23 513.155 1128.23 469.975L1269.15 469.975C1269.15 531.66 1257 592.742 1233.4 649.732C1209.79 706.722 1175.19 758.505 1131.57 802.123C1087.95 845.742 1036.17 880.342 979.181 903.948C922.191 927.554 861.11 939.704 799.424 939.704L799.424 939.704C737.739 939.703 676.659 927.553 619.67 903.948C562.68 880.341 510.897 845.741 467.279 802.123C423.66 758.505 389.06 706.722 365.454 649.732C341.848 592.742 329.698 531.66 329.698 469.975L329.724 469.975C329.704 426.848 321.199 384.146 304.695 344.301C288.171 304.408 263.951 268.16 233.418 237.627C202.885 207.095 166.637 182.875 126.744 166.35C86.8512 149.826 44.0941 141.321 0.914122 141.321L0.914104 0.402405C62.5998 0.402407 123.681 12.5523 180.672 36.1584C237.662 59.7645 289.444 94.3645 333.063 137.983C376.681 181.601 411.281 233.384 434.887 290.374ZM1128.27 469.975C1128.27 408.289 1140.42 347.207 1164.03 290.217C1187.63 233.227 1222.23 181.444 1265.85 137.826C1309.47 94.2077 1361.25 59.6077 1418.24 36.0016C1475.23 12.3955 1536.32 0.245612 1598 0.245614L1598 141.164C1554.82 141.164 1512.06 149.669 1472.17 166.194C1432.28 182.718 1396.03 206.938 1365.5 237.471C1334.96 268.003 1310.74 304.251 1294.22 344.144C1277.7 384.037 1269.19 426.795 1269.19 469.975L1128.27 469.975Z"
            fill="url(#paint5_linear_1217_1539)"
          />
          <path
            opacity="0.3"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M434.887 290.374C458.493 347.364 470.643 408.446 470.643 470.131L470.617 470.131C470.638 513.258 479.142 555.96 495.646 595.805C512.17 635.698 536.39 671.946 566.923 702.479C597.456 733.011 633.704 757.231 673.597 773.756C713.49 790.28 756.247 798.785 799.427 798.785C842.606 798.784 885.362 790.28 925.254 773.756C965.147 757.232 1001.39 733.012 1031.93 702.479C1062.46 671.946 1086.68 635.698 1103.2 595.805C1119.73 555.912 1128.23 513.155 1128.23 469.975L1269.15 469.975C1269.15 531.66 1257 592.742 1233.4 649.732C1209.79 706.722 1175.19 758.505 1131.57 802.123C1087.95 845.742 1036.17 880.342 979.181 903.948C922.191 927.554 861.11 939.704 799.424 939.704L799.424 939.704C737.739 939.703 676.659 927.553 619.67 903.948C562.68 880.341 510.897 845.741 467.279 802.123C423.66 758.505 389.06 706.722 365.454 649.732C341.848 592.742 329.698 531.66 329.698 469.975L329.724 469.975C329.704 426.848 321.199 384.146 304.695 344.301C288.171 304.408 263.951 268.16 233.418 237.627C202.885 207.095 166.637 182.875 126.744 166.35C86.8512 149.826 44.0941 141.321 0.914122 141.321L0.914104 0.402405C62.5998 0.402407 123.681 12.5523 180.672 36.1584C237.662 59.7645 289.444 94.3645 333.063 137.983C376.681 181.601 411.281 233.384 434.887 290.374ZM1128.27 469.975C1128.27 408.289 1140.42 347.207 1164.03 290.217C1187.63 233.227 1222.23 181.444 1265.85 137.826C1309.47 94.2077 1361.25 59.6077 1418.24 36.0016C1475.23 12.3955 1536.32 0.245612 1598 0.245614L1598 141.164C1554.82 141.164 1512.06 149.669 1472.17 166.194C1432.28 182.718 1396.03 206.938 1365.5 237.471C1334.96 268.003 1310.74 304.251 1294.22 344.144C1277.7 384.037 1269.19 426.795 1269.19 469.975L1128.27 469.975Z"
            fill="url(#paint6_linear_1217_1539)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1217_1539"
            x="1140.05"
            y="525.148"
            width="721.481"
            height="721.481"
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
              stdDeviation="83.7003"
              result="effect1_foregroundBlur_1217_1539"
            />
          </filter>
          <filter
            id="filter1_f_1217_1539"
            x="749.756"
            y="-22.7692"
            width="721.481"
            height="721.481"
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
              stdDeviation="83.7003"
              result="effect1_foregroundBlur_1217_1539"
            />
          </filter>
          <filter
            id="filter2_f_1217_1539"
            x="-39.2365"
            y="367.095"
            width="721.481"
            height="721.481"
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
              stdDeviation="83.7003"
              result="effect1_foregroundBlur_1217_1539"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1217_1539"
            x1="1646.9"
            y1="912.77"
            x2="799.458"
            y2="411.261"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1217_1539"
            x1="1646.9"
            y1="912.77"
            x2="799.458"
            y2="411.261"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1217_1539"
            x1="0.911392"
            y1="1088.95"
            x2="717.382"
            y2="248.636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1217_1539"
            x1="0.911392"
            y1="1088.95"
            x2="717.382"
            y2="248.636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1217_1539"
            x1="70.9999"
            y1="96.6303"
            x2="362.129"
            y2="261.033"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_1217_1539"
            x1="1430.1"
            y1="-59.3705"
            x2="1226.13"
            y2="312.081"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_1217_1539"
            x1="443.31"
            y1="723.711"
            x2="1149.67"
            y2="702.547"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="0.489583" stop-color="white" />
            <stop offset="0.96875" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}></div>
        <div className={styles.footerLinks}>
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
            Contact us
          </button>
        </div>
      </footer>
    </div>
  );
}
