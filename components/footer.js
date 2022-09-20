export default function Footer(props) {
  return (
    <div className="py-24 bg-footer-grad">
      <div className="mx-auto max-w-screen-lg container px-1 sm:px-4">
        <div className="border-t border-grey py-4 px-24 flex text-xs justify-between text-type-secondary flex-col sm:flex-row text-center">
          <span className="sm:border-r sm:border-grey sm:pr-16">
            &copy; Gitopia {new Date().getFullYear()}
          </span>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://docs.gitopia.com/"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://gitopia.com/whitepaper.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Whitepaper
          </a>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://discord.gg/mVpQVW3vKE"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://twitter.com/gitopiadao"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://t.me/Gitopia"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="link no-underline hover:underline mt-3 sm:mt-0"
            href="https://medium.com/gitopia"
            target="_blank"
            rel="noreferrer"
          >
            Medium
          </a>
        </div>
      </div>
    </div>
  );
}
