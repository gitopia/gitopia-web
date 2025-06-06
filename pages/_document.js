import Document, { Html, Head, Main, NextScript } from "next/document";

class GitopiaDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="dark">
        <Head>
          {process.env.NODE_ENV === "production" && (
            <script
              async
              defer
              data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/plausible.js"
            />
          )}
          <meta name="color-scheme" content="dark"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GitopiaDocument;
