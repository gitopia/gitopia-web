import Document, { Html, Head, Main, NextScript } from "next/document";

class GitopiaDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {process.env.NODE_ENV === "production" && (
            <script
              async
              defer
              data-domain="gitopia.org"
              src="https://plausible.io/js/plausible.js"
            />
          )}
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
