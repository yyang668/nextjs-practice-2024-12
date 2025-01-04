"use client";

import { useEffect, useState } from "react";
import { Account } from "@/lib/schemas";
import { useAccount } from '@/app/_context/AccountContext';
interface AccountSelectorClientProps {
  accounts: Account[];
}

export default function AccountSelectorClient({ accounts }: AccountSelectorClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedAccount, setSelectedAccount } = useAccount();
 
  // デフォルト値を選択
  useEffect(() => {
    if (!selectedAccount && accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [selectedAccount, accounts, setSelectedAccount]);
  
  return (
    <div className="relative" >
      <button
        className="flex items-center px-4 py-2 bg-white shadow rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          fill="#000000"
          width="32px"
          height="32px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12 2.5a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 101.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0012 2.5zM8 8a4 4 0 118 0 4 4 0 01-8 0z"
          />
        </svg>
        <span className="ml-2">{selectedAccount?.name || "アカウント未選択"}</span>
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white shadow rounded" onMouseLeave={() => {if (isOpen) {setIsOpen(false);}}}>
          {accounts.map((account) => (
            <li
              key={account.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedAccount(account);
                setIsOpen(false);
              }}
            >
              {account.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
