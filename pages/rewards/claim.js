import Head from "next/head";
import Header from "../../components/landingPageHeader";
import Footer from "../../components/landingPageFooter";
import styles from "../../styles/landing.module.css";
import Link from "next/link";
export default function LoadingRewards() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"flex flex-col items-center mt-40 relative"}>
        <div className="flex flex-col ml-10 w-2/3">
          <div className="text-7xl font-bold w-96 tracking-tight leading-[4rem]">
            Claim Airdrop
          </div>
          <div className="flex">
            <div>
              <Link href="/home">
                <div className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md mt-10">
                  Connect Wallet
                </div>
              </Link>
            </div>
          </div>
          <div className="self-center ml-auto">
            <div className="opacity-50 font-bold">Total Token Available</div>
            <div className="text-4xl">184,500 tLore</div>
            <div className="opacity-50 font-bold mt-8">Unclaimed</div>
            <div className="text-4xl">84,500 tLore</div>
            <div className="opacity-50 font-bold mt-8">Claimed Airdrop</div>
            <div className="text-4xl">15,500 tLore</div>
          </div>
        </div>

        <div className="flex p-4 box-border bg-[#222932] w-2/3 rounded-3xl mt-4 h-44 mt-24 flex flex-col items-center">
          <div className="font-bold text-[#4C6784] text-sm uppercase">
            TIME LEFT
          </div>
          <div className="flex flex-row justify-between w-full px-16">
            <div className="font-bold text-4xl py-8">80 DAYS</div>
            <div className="border-l border-base-100 h-28"></div>
            <div className="font-bold text-4xl py-8">13 HOURS</div>
            <div className="border-l border-base-100 h-28"></div>
            <div className="font-bold text-4xl py-8">58 MIN</div>
          </div>
        </div>
        <div className="flex mt-24 w-2/3">
          <div className="text-4xl">Mission</div>
          <div className="flex ml-auto">
            <div className="text-xs opacity-60 mt-4 font-bold mr-2">
              15% Complete
            </div>
            <progress
              className="progress progress-primary w-80 mt-5"
              value="15"
              max="100"
            ></progress>
          </div>
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className={"my-3 ml-4 " + (false ? "" : "text-green")}>
            Stake uLore on December 1st or join our community with your Gitopia
            account
          </div>
          {false ? (
            <img
              className="ml-auto mr-3 mt-2"
              src="/rewards/unchecked-mark.svg"
            />
          ) : (
            <img className="ml-auto mr-3 mt-2" src="/rewards/checkmark.svg" />
          )}
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className={"my-3 ml-4 " + (true ? "" : "text-green")}>
            Transfer a project from Github to Gitopia using our 1 click
            iteration tool.
          </div>
          {true ? (
            <img
              className="ml-auto mr-3 mt-2"
              src="/rewards/unchecked-mark.svg"
            />
          ) : (
            <img className="ml-auto mr-3 mt-2" src="/rewards/checkmark.svg" />
          )}
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className={"my-3 ml-4 " + (true ? "" : "text-green")}>
            Create a butter chicken recipy and send us a photo to approve
          </div>
          {true ? (
            <img
              className="ml-auto mr-3 mt-2"
              src="/rewards/unchecked-mark.svg"
            />
          ) : (
            <img className="ml-auto mr-3 mt-2" src="/rewards/checkmark.svg" />
          )}
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className={"my-3 ml-4 " + (true ? "" : "text-green")}>
            Write a line of code and submit it on the blockchain
          </div>
          {true ? (
            <img
              className="ml-auto mr-3 mt-2"
              src="/rewards/unchecked-mark.svg"
            />
          ) : (
            <img className="ml-auto mr-3 mt-2" src="/rewards/checkmark.svg" />
          )}
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className={"my-3 ml-4 " + (true ? "" : "text-green")}>
            Share Gitopia on Twitter, Instagram and Discord.
          </div>
          {true ? (
            <img
              className="ml-auto mr-3 mt-2"
              src="/rewards/unchecked-mark.svg"
            />
          ) : (
            <img className="ml-auto mr-3 mt-2" src="/rewards/checkmark.svg" />
          )}
        </div>
        <div className="flex flex-col items-center mt-12">
          <Link href="/login">
            <button
              className="btn btn-primary bg-green h-14 py-3 w-72 rounded-md"
              disabled={""}
            >
              Claim Now
            </button>
          </Link>
          <div className="text-xs opacity-50 text-white mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
        <img
          className={"absolute pointer-events-none -z-10 left-1/3 -top-32"}
          src="/rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={"absolute pointer-events-none z-1 left-5 "}
          src="/rewards/drop-1.svg"
        />
        <img
          className={"absolute pointer-events-none z-1 right-16 top-28 "}
          src="/rewards/drop-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 w-3/4 right-10 top-1/4 mt-10 "
          }
          src="/rewards/objects.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 w-full top-1/4 "}
          src="/rewards/ellipse.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 w-full bottom-1/2"}
          src="/rewards/stars-3.svg"
        />
      </section>
      <img
        className={"absolute pointer-events-none -z-20 w-full top-24"}
        src="/rewards/stars-1.svg"
      />

      <Footer />
    </div>
  );
}
