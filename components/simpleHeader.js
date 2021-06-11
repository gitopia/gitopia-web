import Link from "next/link";

export default function SimpleHeader(props) {
  return (
    <div className="navbar bg-base-100 text-base-content">
      <div className="container mx-auto py-7">
        <div className="flex-none">
          <Link href="/home">
            <img
              width={120}
              height={30}
              src="/logo-white.svg"
              className="cursor-pointer"
            ></img>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div class="items-stretch">
          <a class="btn btn-ghost btn-sm rounded-btn">Login</a>
          <a class="btn btn-ghost btn-sm rounded-btn">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
