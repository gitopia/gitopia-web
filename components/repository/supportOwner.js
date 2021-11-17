import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getBalance } from "../../store/actions/wallet";

function SupportOwner({ ownerAddress, ...props }) {
  const [ownerBalance, setOwnerBalance] = useState(0);
  useEffect(async () => {
    const balance = await props.getBalance(ownerAddress);
    setOwnerBalance(balance + " " + process.env.NEXT_PUBLIC_CURRENCY_TOKEN);
  }, [ownerAddress]);

  return (
    <div className="p-2 border border-gray-700 rounded flex items-center">
      <div
        className="border rounded-full w-7 h-7 mr-2 flex items-center justify-center"
        style={{ borderColor: "#FCC945" }}
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.46875 1.05078H8.5248C9.90551 1.05078 11.0248 2.17007 11.0248 3.55078V10.4495C11.0248 11.8302 9.90551 12.9495 8.5248 12.9495H3.46875C2.08804 12.9495 0.96875 11.8302 0.96875 10.4495V3.55078C0.96875 2.17007 2.08804 1.05078 3.46875 1.05078Z"
            stroke="#FCC945"
          />
          <path d="M3.41797 4.2361H8.57746" stroke="#FCC945" />
          <path d="M3.41797 6.44722H8.57746" stroke="#FCC945" />
          <path
            d="M4.52344 13.0809V10.5012C4.52344 9.68703 5.18343 9.02703 5.99758 9.02703V9.02703C6.81172 9.02703 7.47172 9.68703 7.47172 10.5012V13.0809"
            stroke="#FCC945"
          />
        </svg>
      </div>
      <div>
        <div
          className="text-type-tertiary font-semibold uppercase"
          style={{ fontSize: "0.5rem" }}
        >
          Owner Address
        </div>
        <div className="text-xs">{ownerAddress}</div>
      </div>
      <div
        className="border rounded-full w-7 h-7 mr-2 ml-4 flex items-center justify-center"
        style={{ borderColor: "#883BE6" }}
      >
        <svg
          width="10"
          height="17"
          viewBox="0 0 10 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.00061 8.51845C6.33523 8.51845 7.41715 7.43653 7.41715 6.10192C7.41715 4.7673 6.33523 3.68538 5.00061 3.68538C3.666 3.68538 2.58408 4.7673 2.58408 6.10192C2.58408 7.43653 3.666 8.51845 5.00061 8.51845ZM5.00061 10.2314C7.28128 10.2314 9.13013 8.38259 9.13013 6.10192C9.13013 3.82125 7.28128 1.9724 5.00061 1.9724C2.71994 1.9724 0.871094 3.82125 0.871094 6.10192C0.871094 8.38259 2.71994 10.2314 5.00061 10.2314Z"
            fill="#883BE6"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.58408 11.1195C2.58408 11.7593 2.84059 12.3714 3.29468 12.8215C3.74849 13.2713 4.36229 13.5225 5.00061 13.5225C5.63893 13.5225 6.25273 13.2713 6.70655 12.8215C7.16063 12.3714 7.41715 11.7593 7.41715 11.1195H9.13013C9.13013 12.2004 8.69698 13.2386 7.92343 14.0053C7.14962 14.7723 6.09841 15.2046 5.00061 15.2046C3.90281 15.2046 2.8516 14.7723 2.07779 14.0053C1.30425 13.2386 0.871094 12.2004 0.871094 11.1195H2.58408Z"
            fill="#883BE6"
          />
          <path
            d="M4.19727 0.743828H5.8455V2.39206H4.19727V0.743828Z"
            fill="#883BE6"
          />
          <path
            d="M4.19727 14.7537H5.8455V16.4019H4.19727V14.7537Z"
            fill="#883BE6"
          />
        </svg>
      </div>
      <div className="">
        <div
          className="text-type-tertiary font-semibold uppercase"
          style={{ fontSize: "0.5rem" }}
        >
          Lore Available
        </div>
        <div className="text-xs">{ownerBalance}</div>
      </div>
      <div className="flex-1 text-right">
        <a className="text-xs link link-primary uppercase no-underline">
          Support Project
        </a>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { getBalance })(SupportOwner);
