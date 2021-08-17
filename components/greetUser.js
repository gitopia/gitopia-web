import { useEffect, useState } from "react";
import { connect } from "react-redux";
import shrinkAddress from "../helpers/shrinkAddress";

function GreetUser(props) {
  const [greetingName, setGreetingName] = useState("");

  useEffect(() => {
    if (props.username) {
      setGreetingName(props.username);
    } else if (props.address) {
      setGreetingName(shrinkAddress(props.address));
    } else {
      setGreetingName("");
    }
  }, [props.username]);

  return props.address ? (
    <div>
      <div className="text-xs uppercase">Welcome,</div>
      <div className="text-lg">{greetingName}</div>
    </div>
  ) : (
    <div></div>
  );
}

const mapStateToProps = (state) => {
  return {
    address: state.wallet.selectedAddress,
    username: state.user.username,
  };
};

export default connect(mapStateToProps, {})(GreetUser);
