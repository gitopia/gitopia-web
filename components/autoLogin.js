import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { unlockWallet } from "../store/actions/wallet";

function AutoLogin(props) {
  useEffect(async () => {
    let lastWallet;
    try {
      lastWallet = JSON.parse(localStorage["lastWallet"]);
    } catch (e) {
      console.error(e);
    }
    if (lastWallet) {
      console.log("Last Wallet found, unlocking.. ", lastWallet.name);
      let res = await props.unlockWallet({
        name: lastWallet.name,
        password: lastWallet.password,
      });
      if (res) {
        console.log("Sign in success");
      }
    } else {
      console.log("Last wallet not found");
    }
  }, []);
  return "";
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  unlockWallet,
})(AutoLogin);
