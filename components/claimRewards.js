import { useState, useEffect } from "react";
import axios from "../helpers/axiosFetch";
import Head from "next/head";
import Header from "./header";
import Footer from "./landingPageFooter";
import styles from "../styles/landing.module.css";
import Link from "next/link";
import { connect } from "react-redux";
import { notify } from "reapop";
import { calculateGithubRewards, claimRewards } from "../store/actions/user";
import { updateUserBalance } from "../store/actions/wallet";
import getTasks from "../helpers/getTasks";
import { tasksToMessage } from "../helpers/tasksTypes";
import { useRouter } from "next/router";
import getRewardToken from "../helpers/getRewardTokens";



function ClaimRewards(props) {


  
}
const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {

})(ClaimRewards);
