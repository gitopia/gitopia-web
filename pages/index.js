import Head from "next/head";
import { Button, Grid, Row, Col } from "rsuite";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <Grid>
          <h3>Popular open source projects</h3>
          <ul>
            <li>
              <Button
                appearance="link"
                href="/orgs/z_TqsbmVJOKzpuQH4YrYXv_Q0DrkwDwc0UqapRrE0Do"
              >
                Gitopia
              </Button>
            </li>
          </ul>
        </Grid>
      </main>
    </div>
  );
}
