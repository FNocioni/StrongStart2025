import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ShoppingBag, Coffee, Car, Home, Plane, Utensils } from 'lucide-react';

export function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      name: 'Whole Foods Market',
      category: 'Groceries',
      date: '2025-10-27',
      amount: -127.50,
      icon: ShoppingBag,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Starbucks',
      category: 'Food & Drink',
      date: '2025-10-27',
      amount: -5.75,
      icon: Coffee,
      color: 'green',
    },
    {
      id: 3,
      name: 'Shell Gas Station',
      category: 'Transportation',
      date: '2025-10-26',
      amount: -45.00,
      icon: Car,
      color: 'red',
    },
    {
      id: 4,
      name: 'Salary Deposit',
      category: 'Income',
      date: '2025-10-25',
      amount: 5002.00,
      icon: Home,
      color: 'purple',
    },
    {
      id: 5,
      name: 'Delta Airlines',
      category: 'Travel',
      date: '2025-10-24',
      amount: -456.80,
      icon: Plane,
      color: 'blue',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Recent Transactions</h3>
        <button className="text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${transaction.color}-100`}>
                  <Icon className={`w-5 h-5 text-${transaction.color}-600`} />
                </div>
                <div>
                  <p className="text-gray-900">{transaction.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{transaction.category}</Badge>
                    <span className="text-gray-500">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <p className={`${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
