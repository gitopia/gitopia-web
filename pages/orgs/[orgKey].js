import Head from "next/head";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Button,
  IconButton,
  Icon,
  Container,
  Header,
  Content,
  Footer,
  Sidebar,
  Sidenav,
  List,
  Timeline,
  Grid,
  Row,
  Col,
  Tag,
} from "rsuite";
import find from "lodash/find";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import styles from "../../styles/org.module.css";

const walletOrgMap = {
  z_TqsbmVJOKzpuQH4YrYXv_Q0DrkwDwc0UqapRrE0Do: {
    name: "Gitopia",
    description:
      "Persistent, decentralized and always accessible code collaboration.",
    location: "India",
    link: "https://gitopia.org/Gitopia",
    email: "support@gitopia.org",
    hasDescription: true,
  },
};

export async function getStaticProps(context) {
  const client = new ApolloClient({
    uri: "https://arweave.net/graphql",
    cache: new InMemoryCache(),
  });

  const address = context.params.orgKey;

  const { data } = await client.query({
    query: gql`
          query {
            transactions(
              first: 2147483647
              owners: ["${address}"]
              tags: [
                { name: "Type", values: ["create-repo", "update-repo", "update-ref"] }
                { name: "Version", values: "0.0.2" }
                { name: "App-Name", values: "Gitopia" }
              ]
            ) {
              pageInfo {
                hasNextPage
              }
              edges {
                cursor
                node {
                  id
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }
        `,
  });

  let repositories = [];
  let activities = [];
  let orgData = walletOrgMap[address] || {
    name: address,
    hasDescription: false,
  };

  if (data && data.transactions && data.transactions.edges) {
    activities = data.transactions.edges.map((item, index) => {
      let timeTag = find(item.node.tags, { name: "Unix-Time" }) || {};
      let repoNameTag = find(item.node.tags, { name: "Repo" }) || {};
      let refNameTag = find(item.node.tags, { name: "Ref" }) || {};
      let typeTag = find(item.node.tags, { name: "Type" }) || {};
      if (typeTag.value === "create-repo") {
        repositories.push({ repoName: repoNameTag.value });
      }
      return {
        time: timeTag.value || null,
        repoName: repoNameTag.value || null,
        refName: refNameTag.value || null,
        type: typeTag.value || null,
      };
    });
  }

  return {
    props: { repositories, activities, orgData }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default function Home({ orgData, repositories, activities }) {
  const activityList = (
    <Grid fluid>
      {activities &&
        activities.map((activity, index) => {
          return (
            <Row key={index} index={index} className={styles.padded}>
              <Col xs={24} sm={18}>
                <div>{activity.repoName}</div>
                <div>
                  <Tag>{activity.type}</Tag>
                  <span>{activity.refName}</span>
                </div>
              </Col>
              <Col xs={24} sm={6}>
                {formatDistanceToNow(fromUnixTime(Number(activity.time)), {
                  addSuffix: true,
                })}
              </Col>
            </Row>
          );
        })}
    </Grid>
  );

  const repoList = (
    <List bordered={true}>
      {repositories &&
        repositories.map((repo, index) => {
          return (
            <List.Item key={index} index={index}>
              <Button appearance="link" href={orgData.name + "/" + repo.repoName}>
                {repo.repoName}
              </Button>
            </List.Item>
          );
        })}
    </List>
  );

  let orgHeader = <></>;

  if (orgData) {
    orgHeader = (
      <>
        <h2>{orgData.name}</h2>
        {orgData.hasDescription && (
          <div>
            <h6>{orgData.description}</h6>
            <span className={styles.headerActions}>
              <Icon icon="map-marker" className={styles.headerActions} />
              {orgData.location}
            </span>
            <span className={styles.headerActions}>
              <Icon icon="link" />
              <Button appearance="link">{orgData.link}</Button>
            </span>
            <span className={styles.headerActions}>
              <Icon icon="envelope" />
              <Button appearance="link">{orgData.email}</Button>
            </span>
          </div>
        )}
        <div>
          {!orgData.hasDescription && (
            <IconButton
              icon={<Icon icon="hand-grab-o" />}
              className={styles.headerActions}
              color="green"
            >
              Register your profile
            </IconButton>
          )}
          <IconButton
            icon={<Icon icon="gift" />}
            className={styles.headerActions}
          >
            Sponsor
          </IconButton>
          <IconButton
            icon={<Icon icon="rss" />}
            className={styles.headerActions}
          >
            Follow
          </IconButton>
        </div>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <Grid>
          <Header className={styles.padded}>{orgHeader}</Header>
          <Container>
            <Sidebar className={styles.padded}>
              <h4>Repositories</h4>
              {repoList}
            </Sidebar>
            <Content className={styles.padded}>
              <h4>Activities</h4>
              {activityList}
            </Content>
          </Container>
        </Grid>
      </main>
    </div>
  );
}
