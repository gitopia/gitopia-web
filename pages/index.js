import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Grid, Row, Col, Icon } from "rsuite";
// import * as actionTypes from "../store/actions/actionTypes";
import { connect } from "react-redux";
import { createWalletWithMnemonic } from "../store/actions/wallet";
import {
  startStarportPolling,
  stopStarportPolling,
} from "../store/actions/starport";
import * as bip39 from "bip39";

function Home(props) {
  console.log("PROPS", props);
  const [mnemonic, setMnemonic] = useState(bip39.generateMnemonic(256));
  useEffect(() => {
    props.startStarportPolling();
    return props.stopStarportPolling;
  }, []);

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
          <Row>
            <Col>
              <h6>
                Active Wallet:{" "}
                {props.activeWallet ? props.activeWallet.name : ""}
              </h6>
              <h6>Mnemonic: {mnemonic}</h6>
              <Button
                onClick={() =>
                  props.createWalletWithMnemonic({
                    name: "Niki",
                    mnemonic: mnemonic,
                    password: "Lauda",
                  })
                }
              >
                createWallet
              </Button>
            </Col>
            <Col>
              <h3>Services running</h3>
              <h6>
                Admin Panel
                <Icon icon="check-circle" inverse={!props.isFrontendRunning} />
              </h6>
              <h6>
                API
                <Icon icon="check-circle" inverse={!props.isApiRunning} />
              </h6>
              <h6>
                RPC
                <Icon icon="check-circle" inverse={!props.isRpcRunning} />
              </h6>
            </Col>
          </Row>
        </Grid>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    activeWallet: state.wallet.activeWallet,
    isFrontendRunning: state.starport.backend.running.frontend,
    isApiRunning: state.starport.backend.running.api,
    isRpcRunning: state.starport.backend.running.rpc,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {};
// };

/* setActiveWallet(wallet) =>
      dispatch({ type: actionTypes.ADD_WALLET, payload: wallet }),
  };
  */
export default connect(mapStateToProps, {
  createWalletWithMnemonic,
  startStarportPolling,
})(Home);
