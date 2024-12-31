'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {Account} from '@/lib/schemas'


// Context　を定義する
type AccountContextType = {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account| null) => void;
};

// Context　を作成
const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Context Provider　を定義する
export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

// conext を使いやすいため、Hookを定義する
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('「useAccount」は「AccountProvider」の内部で使用されなければなりません。');
  }
  return context;
};
