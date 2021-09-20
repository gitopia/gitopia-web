import { useEffect, useState } from "react";
import { connect } from "react-redux";
import shrinkAddress from "../../helpers/shrinkAddress";
import { setCurrentDashboard } from "../../store/actions/user";
import ClickAwayListener from "react-click-away-listener";
import { useRouter } from "next/router";

function DashboardSelector(props) {
  const router = useRouter();
  const [accountsList, setAccountsList] = useState([]);
  const [selected, setSelected] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let userAcc = {},
      toSelect;
    const newAccountsList = [
      ...props.dashboards.map((d) => {
        const acc = {
          ...d,
        };

        if (d.type === "User") userAcc = acc;
        if (d.id === props.currentDashboard) {
          toSelect = acc;
        }
        return acc;
      }),
    ];

    if (!toSelect) {
      setSelected(userAcc);
    } else {
      setSelected(toSelect);
    }
    setAccountsList(newAccountsList);
  }, [props.dashboards, props.currentDashboard]);

  return props.address ? (
    <div className="pl-4 pr-4 mt-8">
      <ClickAwayListener
        onClickAway={() => {
          setMenuOpen(false);
        }}
      >
        <div
          className={
            "dropdown dropdown-end w-full " + (menuOpen ? "dropdown-open" : "")
          }
        >
          <div
            tabIndex="0"
            className="btn btn-ghost btn-block"
            onClick={() => {
              setMenuOpen(true);
            }}
          >
            {selected.type === "User" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <div className="flex-1 text-left">
              <div className="text-md">{selected.name}</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <ul
            tabIndex="0"
            className="shadow-xl menu dropdown-content bg-base-300 rounded w-52"
          >
            {accountsList.map((a, i) => {
              return (
                <li key={i}>
                  <a
                    className="flex-nowrap"
                    onClick={() => {
                      setSelected(a);
                      props.setCurrentDashboard(a.id);
                      setMenuOpen(false);
                    }}
                  >
                    {a.type === "User" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 flex-none"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 flex-none"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className="flex-1 text-left">
                      <div className="text-md">{a.name}</div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </ClickAwayListener>
    </div>
  ) : (
    <div></div>
  );
}

const mapStateToProps = (state) => {
  return {
    address: state.wallet.selectedAddress,
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, { setCurrentDashboard })(
  DashboardSelector
);
