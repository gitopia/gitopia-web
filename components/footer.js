export default function Footer(props) {
  return (
    <div className="py-24 bg-footer-grad">
      <div className="mx-auto max-w-screen-lg container">
        <div className="border-t border-grey p-4 flex justify-between text-xs text-type-secondary">
          <span className="border-r border-grey pr-8">
            &copy; Gitopia {new Date().getFullYear()}
          </span>
          <a>Terms</a>
          <a>Privacy</a>
          <a>Security</a>
          <a>Status</a>
          <a>Docs</a>
          <a>About</a>
          <a>Blog</a>
          <a>Training</a>
          <a>API</a>
          <a>Pricing</a>
          <a>Contact Us</a>
        </div>
      </div>
    </div>
  );
}
