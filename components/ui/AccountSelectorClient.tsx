"use client";

import { useEffect, useState, useRef } from "react";
import { Account } from "@/lib/schemas";
import { useAccount } from "@/app/_context/AccountContext";
import { PersonIcon } from "@radix-ui/react-icons";
interface AccountSelectorClientProps {
  accounts: Account[];
}

export default function AccountSelectorClient({
  accounts,
}: AccountSelectorClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedAccount, setSelectedAccount } = useAccount();
  const ref = useRef<HTMLDivElement | null>(null);

  // デフォルト値を選択
  useEffect(() => {
    if (!selectedAccount && accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [selectedAccount, accounts, setSelectedAccount]);

  // アカウント以外のエリアをクリックする時に、ドロップダウンリストを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center px-4 py-2 bg-white shadow rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PersonIcon className="size-12" />
        <span className="ml-2">
          {selectedAccount?.name || "アカウント未選択"}
        </span>
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 mt-2 w-48 bg-white shadow rounded"
          onMouseLeave={() => {
            if (isOpen) {
              setIsOpen(false);
            }
          }}
        >
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
