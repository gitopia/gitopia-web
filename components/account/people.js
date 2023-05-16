import { useEffect, useState } from "react";
import AccountCard from "../account/card";
import getDaoMember from "../../helpers/getUserDaoMember";

function AccountPeople(props) {
  const [allMembers, setAllMembers] = useState([]);

  const getAllMembers = async () => {
    if (props.dao.id) {
      const members = await getDaoMember(props.dao.address);
      setAllMembers(members);
    }
  };

  useEffect(() => {
    getAllMembers();
  }, [props.dao]);

  return (
    <>
      <div className="mt-8 max-w-3xl">
        <ul className="divide-y divide-grey">
          {allMembers.map((m, i) => {
            return (
              <li className="p-4" key={m.id}>
                <div className="flex items-center">
                  <AccountCard id={m.address} showAvatar={true} />
                  <div className="flex-1 text-right text-sm">
                    {allMembers[i].role}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default AccountPeople;
