import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import { useRouter } from "next/router";
import Dao from "../../../components/dashboard/dao";
import Link from "next/link";
import getDao from "../../../helpers/getDao";
import getDaoMember from "../../../helpers/getUserDaoMember";
import { useErrorStatus } from "../../../hooks/errorHandler";

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

  async function refreshData() {
    const [dao, members] = await Promise.all([
      getDao(router.query.daoId),
      getDaoMember(router.query.daoId),
    ]);
    if (dao) {
      let isMember = false;
      members.forEach(m => {
        if (m.address == props.selectedAddress) { isMember = true; return false; } else { return true; }
      });
      console.log(dao, members, props.selectedAddress)
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

export default connect(mapStateToProps, { })(
  DaoDashboard
);
