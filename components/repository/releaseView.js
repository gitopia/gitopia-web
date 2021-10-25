import Link from "next/link";
import dayjs from "dayjs";
import shrinkAddress from "../../helpers/shrinkAddress";
import formatBytes from "../../helpers/formatBytes";
import shrinkSha from "../../helpers/shrinkSha";

export default function ReleaseView({
  release,
  repository,
  latest = false,
  ...props
}) {
  return (
    <div className="p-4">
      <div className="flex items-center">
        <Link
          href={
            "/" +
            repository.owner.id +
            "/" +
            repository.name +
            "/releases/tag/" +
            release.tagName
          }
        >
          <a className="text-3xl link link-primary no-underline hover:underline">
            {repository.name + " " + release.tagName}
          </a>
        </Link>
        {latest ? (
          <span className="ml-4 mt-1 badge badge-primary badge-outline">
            Latest
          </span>
        ) : (
          ""
        )}
      </div>
      <div className="flex items-center mt-4">
        <div className="avatar mr-1">
          <div className="w-5 h-5 rounded-full">
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                release.creator.slice(-1)
              }
            />
          </div>
        </div>
        <Link href={"/" + release.creator}>
          <a className="text-sm link no-underline hover:underline text-type-secondary">
            {shrinkAddress(release.creator)}
          </a>
        </Link>
        <div className="ml-1 text-sm text-type-secondary">
          {"released this on " +
            dayjs(release.publishedAt * 1000).format("DD-MM-YYYY")}
        </div>
      </div>
      <div className="text-xs mt-4 text-type-secondary">{release.name}</div>
      <div className="text-xs mt-2 text-type-secondary">
        {release.description}
      </div>
      <div className="text-sm mt-4">
        <span>Assets</span>
        <span className="badge badge-sm ml-2">
          {release.attachments.length}
        </span>
      </div>
      {release.attachments.length ? (
        <ul className="mt-2 menu compact border border-grey rounded">
          {release.attachments.map((a) => {
            return (
              <li key={a.sha}>
                <a
                  className="flex py-2 items-center"
                  target="_blank"
                  href={
                    process.env.NEXT_PUBLIC_OBJECTS_URL +
                    "/releases/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/" +
                    release.tagName +
                    "/" +
                    a.name
                  }
                >
                  <div className="flex-1 text-sm">{a.name}</div>
                  <div className="text-xs mr-2">{formatBytes(a.size)}</div>
                  <div className="">
                    <div className="text-xs flex items-center">
                      <div className="mr-2">{"(" + shrinkSha(a.sha) + ")"}</div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
}
