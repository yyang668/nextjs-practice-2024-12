'use client';

import { useState, useEffect ,useCallback } from 'react';
import AccountSelector from '@/components/AccountSelector';
import { useAccount } from '@/app/_context/AccountContext';
import {Account} from '@/lib/schemas'

export default function Header() {
  const { selectedAccount, setSelectedAccount } = useAccount();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchAccounts = useCallback(async () => {
    const response = await fetch('/api/accounts/getAccounts');
    const data = await response.json();
    setAccounts(data);

    if (!selectedAccount){
      setSelectedAccount(data[0]);
    }
   }, []);

  useEffect(() => {
    // コンポーネントがマウントされたときの初期取得
    fetchAccounts();
  }, [fetchAccounts]);
   
  const handleAccountChange = async (account: Account) => {
    setSelectedAccount(account);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-200">
      <div className="text-lg font-bold"></div>
      <AccountSelector
        accounts={accounts}
        currentAccount={selectedAccount}
        onChange={handleAccountChange}
      />
    </header>
  );
}
