import { useEffect, useState } from "react";
import Link from "next/link";
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
                  <div className="avatar mr-2">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={
                          "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                          m.address.slice(-1)
                        }
                      />
                    </div>
                  </div>
                  <div className="mr-8">
                    <Link
                      href={"/" + m.address}
                      className="text-sm btn-link"
                      legacyBehavior
                    >
                      {m.address}
                    </Link>
                  </div>
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
