import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import { useRouter } from "next/router";
import Dao from "../../../components/dashboard/dao";
import Link from "next/link";
import getDao from "../../../helpers/getDao";
import getGroupMembers from "../../../helpers/getGroupMembers";
import { useErrorStatus } from "../../../hooks/errorHandler";
import { useApiClient } from "../../../context/ApiClientContext";

export async function getStaticProps() {
  const fs = await import("fs");
  const buildId = fs.readFileSync("./seo/build-id").toString();
  return {
    props: {
      buildId,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function DaoDashboard(props) {
  const [dao, setDao] = useState({});
  const { setErrorStatusCode } = useErrorStatus();
  const router = useRouter();
  const { apiClient } = useApiClient();

  async function refreshData() {
    const dao = await getDao(apiClient, router.query.daoId);
    const members = await getGroupMembers(apiClient, dao.group_id);

    if (dao) {
      let isMember = false;
      members.forEach((m) => {
        if (m.member.address == props.selectedAddress) {
          isMember = true;
          return false;
        } else {
          return true;
        }
      });
      console.log(dao, members, props.selectedAddress);
      if (!isMember) {
        console.log("Not a member");
        setErrorStatusCode(404);
      }
      setDao({ ...dao, members: members });
    } else {
      setErrorStatusCode(404);
    }
  }

  useEffect(() => {
    if (props.selectedAddress) refreshData();
  }, [props.selectedAddress]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="sm:flex sm:flex-1">
        <div className="flex-1 px-4">
          <Dao dao={dao} refreshData={refreshData} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(DaoDashboard);
