export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <div className="justify-center items-center">
        <div className="absolute w-20 h-20 border-b-2 border-purple-900 rounded-full animate-spin"></div>
        <img className="absolute m-2" src="/logo-g.svg" />
      </div>
    </div>
  );
}
