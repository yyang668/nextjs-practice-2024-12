import { useAccount } from "@/app/_context/AccountContext";

import { Account } from "@/lib/schemas";
import { getAccounts } from "@/app/actions";
import AccountSelectorClient from "@/components/ui/AccountSelectorClient";

export default async function Header() {
  const accounts: Account[] = (await getAccounts()).data;
  return (
    <header className="flex items-center justify-between p-4 bg-gray-200">
      <div className="text-lg font-bold"></div>
      <AccountSelectorClient accounts={accounts} />
    </header>
  );
}
