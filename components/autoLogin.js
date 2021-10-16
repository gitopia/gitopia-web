import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { unlockWallet, unlockKeplrWallet } from "../store/actions/wallet";
import initKeplr from "../keplr/init";

function AutoLogin(props) {
  useEffect(async () => {
    let lastWallet;
    try {
      const data = localStorage["lastWallet"];
      if (data) lastWallet = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    if (lastWallet) {
      console.log(
        "Last Wallet found, unlocking.. ",
        lastWallet.name,
        "isKeplr",
        lastWallet.isKeplr
      );
      if (lastWallet.isKeplr) {
        await initKeplr();
        const acc = await props.unlockKeplrWallet();
        console.log(acc);
        if (acc) {
          console.log("Keplr sign in success");
        }
      } else {
        let res = await props.unlockWallet({
          name: lastWallet.name,
          password: lastWallet.password,
        });
        if (res) {
          console.log("Local sign in success");
        }
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
  unlockKeplrWallet,
})(AutoLogin);
