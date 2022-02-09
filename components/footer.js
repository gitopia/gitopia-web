export default function Footer(props) {
  return (
    <div className="py-24 bg-footer-grad">
      <div className="mx-auto max-w-screen-lg container px-4">
        <div className="border-t border-grey py-4 px-24 flex text-xs  justify-between text-type-secondary">
          <span className="border-r border-grey pr-16">
            &copy; Gitopia {new Date().getFullYear()}
          </span>
          <a
            className="link no-underline hover:underline"
            href="https://docs.gitopia.com/"
            target="_blank"
          >
            Docs
          </a>
          <a
            className="link no-underline hover:underline"
            href="https://gitopia.com/whitepaper.pdf"
            target="_blank"
          >
            Whitepaper
          </a>
          <a
            className="link no-underline hover:underline"
            href="https://discord.gg/mVpQVW3vKE"
            target="_blank"
          >
            Discord
          </a>
          <a
            className="link no-underline hover:underline"
            href="https://twitter.com/gitopiadao"
            target="_blank"
          >
            Twitter
          </a>
          <a
            className="link no-underline hover:underline"
            href="https://t.me/Gitopia"
            target="_blank"
          >
            Telegram
          </a>
          <a
            className="link no-underline hover:underline"
            href="https://medium.com/gitopia"
            target="_blank"
          >
            Medium
          </a>
        </div>
      </div>
    </div>
  );
}
