import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SpendingChart } from './SpendingChart';
import { RecentTransactions } from './RecentTransactions';

export function Dashboard() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$45,678.90',
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
      color: 'blue',
    },
    {
      title: 'Income',
      value: '$12,345.00',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Expenses',
      value: '$8,456.30',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'red',
    },
    {
      title: 'Credit Card',
      value: '$2,890.50',
      change: '+5.4%',
      trend: 'up',
      icon: CreditCard,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600">{stat.title}</p>
                  <p className="text-gray-900 mt-2">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Budget Overview</h3>
          <div className="space-y-4">
            {[
              { category: 'Groceries', spent: 450, budget: 600, color: 'blue' },
              { category: 'Transportation', spent: 280, budget: 300, color: 'green' },
              { category: 'Entertainment', spent: 320, budget: 250, color: 'red' },
              { category: 'Utilities', spent: 180, budget: 200, color: 'purple' },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="text-gray-900">
                    ${item.spent} / ${item.budget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.spent > item.budget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <RecentTransactions />
    </div>
  );
}
