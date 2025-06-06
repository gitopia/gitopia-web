import Head from "next/head";
export default function Error404() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Head>
        <title>Error - 404</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="justify-center items-center">
        <div className="font-bold text-5xl text-center">Oops!</div>
        <div className="mt-5 text-center">
          Looks like the page you’re looking for doesn’t exist
        </div>
        <div className="relative flex items-center justify-center">
          <img width={500} height={364} src="/404.svg"></img>
        </div>
        <div className="text-center">
          Once our team is done watching the latest episode of
        </div>
        <div className="text-center">
          Arcane, we’ll be back to have a look at this.
        </div>
        <div className="flex justify-center mt-10">
          <a className="flex-none btn btn-primary btn-wide w-52" href={"/home"}>
            GO TO HOME
          </a>
        </div>
      </div>
    </div>
  );
}
