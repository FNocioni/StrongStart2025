import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingBag, Coffee, Car, Home, Plane, Utensils, Filter, Download, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function Transactions() {
  const [filter, setFilter] = useState('all');

  const allTransactions = [
    {
      id: 1,
      name: 'Whole Foods Market',
      category: 'Groceries',
      date: '2025-10-27',
      time: '14:32',
      amount: -127.50,
      status: 'completed',
      icon: ShoppingBag,
    },
    {
      id: 2,
      name: 'Starbucks',
      category: 'Food & Drink',
      date: '2025-10-27',
      time: '09:15',
      amount: -5.75,
      status: 'completed',
      icon: Coffee,
    },
    {
      id: 3,
      name: 'Shell Gas Station',
      category: 'Transportation',
      date: '2025-10-26',
      time: '18:45',
      amount: -45.00,
      status: 'completed',
      icon: Car,
    },
    {
      id: 4,
      name: 'Salary Deposit',
      category: 'Income',
      date: '2025-10-25',
      time: '00:01',
      amount: 5002.00,
      status: 'completed',
      icon: Home,
    },
    {
      id: 5,
      name: 'Delta Airlines',
      category: 'Travel',
      date: '2025-10-24',
      time: '11:20',
      amount: -456.80,
      status: 'completed',
      icon: Plane,
    },
    {
      id: 6,
      name: 'Amazon Prime',
      category: 'Shopping',
      date: '2025-10-24',
      time: '16:30',
      amount: -14.99,
      status: 'pending',
      icon: ShoppingBag,
    },
    {
      id: 7,
      name: 'Chipotle',
      category: 'Food & Drink',
      date: '2025-10-23',
      time: '12:45',
      amount: -18.50,
      status: 'completed',
      icon: Utensils,
    },
    {
      id: 8,
      name: 'Uber',
      category: 'Transportation',
      date: '2025-10-23',
      time: '08:20',
      amount: -22.30,
      status: 'completed',
      icon: Car,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage all your transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="food">Food & Drink</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="recent">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Transaction</th>
                <th className="text-left py-3 px-4 text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-gray-700">Date & Time</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="text-right py-3 px-4 text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-gray-900">{transaction.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-900">{transaction.date}</p>
                        <p className="text-gray-500">{transaction.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'outline'}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
