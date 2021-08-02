import { repositoryActions, envActions } from "./actionTypes";
import { txClient } from "gitopiajs";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";

// import { assertIsBroadcastTxSuccess } from '@cosmjs/stargate'
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";

async function initTxClient(accountSigner) {
  return await txClient(accountSigner, {
    addr: "http://localhost:26657",
  });
}

export const createRepository = ({ name = null, description = null }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    /*
    const accountIndex = state.activeWallet.accounts.findIndex(
      (acc) => acc.address == address
    );
    */
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath + state.activeWallet.accounts[0].pathIncrement
      ),
      state.activeWallet.prefix
    );
    const [acc] = await accountSigner.getAccounts();
    const repository = {
      creator: acc.address,
      name: name,
      owner: JSON.stringify({
        Type: "User",
        ID: acc.address,
      }),
      description: description,
    };

    //dispatch({ type: repositoryActions.ADD_REPOSITORY, payload: { repository } });
    console.log(acc);
    console.log(repository);
    try {
      const msg = await (
        await initTxClient(accountSigner)
      ).msgCreateRepository(repository);
      const result = await (
        await initTxClient(accountSigner)
      ).signAndBroadcast([msg], {
        fee: { amount: [], gas: "200000" },
        memo: "",
      });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
    }

    //dispatch({ type: repositoryActions.STORE_REPOSITORYS });
  };
};
