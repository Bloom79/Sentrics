import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Transaction {
  id: string;
  name: string;
  type: 'production' | 'consumption';
  amount: number;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    name: 'Energy Production',
    type: 'production',
    amount: 0,
    date: '2024-02-07 14:30',
  },
  {
    id: '2',
    name: 'Energy Consumption',
    type: 'consumption',
    amount: 0,
    date: '2024-02-07 14:00',
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {transaction.type === 'production' ? 'P' : 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleString()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span className={transaction.type === 'production' ? 'text-green-500' : 'text-red-500'}>
              {transaction.type === 'production' ? '+' : '-'}{transaction.amount} kWh
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 