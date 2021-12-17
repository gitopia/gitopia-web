export default function Error404() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="justify-center items-center">
        <div className="font-bold text-5xl text-center">Oops!</div>
        <div className="mt-5 text-center">
          Looks like the page you’re looking for doesn’t exist
        </div>
        <div className="relative flex items-center justify-center">
          <img width={500} src="/404.svg"></img>
        </div>
        <div className="text-center mx-96 px-32">
          Once our team is done watching the latest episode of Arcane, we’ll be
          back to have a look at this.
        </div>
        <div className="flex justify-center mt-10">
          <button className="flex-none btn btn-primary btn-wide w-52">
            GO TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}
