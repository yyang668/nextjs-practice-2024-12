'use client';
import { useState , useEffect} from 'react';
import { useAccount } from '@/app/_context/AccountContext';
import { AccountSelectorProps } from '@/lib/schemas'

export default function AccountSelector({
  accounts,
  onChange,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedAccount, setSelectedAccount } = useAccount();
 
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    const account = accounts.find((a) => a.id === selectedId) || null;
    setSelectedAccount(account); //アカウントを更新する
  };

  return (
    <div className="relative">
      <button
        className="flex items-center px-4 py-2 bg-white shadow rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
          <svg fill="#000000" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12 2.5a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 101.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0012 2.5zM8 8a4 4 0 118 0 4 4 0 01-8 0z"/>
          </svg>
        
          {selectedAccount?.name || 'アカウント未選択'}
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white shadow rounded">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(account);
                setSelectedAccount(account)
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
