import { Card } from './ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Analytics() {
  const categoryData = [
    { name: 'Groceries', value: 450, color: '#3b82f6' },
    { name: 'Transportation', value: 280, color: '#10b981' },
    { name: 'Entertainment', value: 320, color: '#ef4444' },
    { name: 'Utilities', value: 180, color: '#8b5cf6' },
    { name: 'Dining Out', value: 240, color: '#f59e0b' },
    { name: 'Shopping', value: 150, color: '#ec4899' },
  ];

  const monthlyData = [
    { month: 'Jan', groceries: 420, transportation: 250, entertainment: 300, utilities: 180 },
    { month: 'Feb', groceries: 380, transportation: 290, entertainment: 280, utilities: 180 },
    { month: 'Mar', groceries: 460, transportation: 310, entertainment: 340, utilities: 190 },
    { month: 'Apr', groceries: 440, transportation: 270, entertainment: 290, utilities: 180 },
    { month: 'May', groceries: 430, transportation: 300, entertainment: 350, utilities: 185 },
    { month: 'Jun', groceries: 450, transportation: 280, entertainment: 320, utilities: 180 },
  ];

  const trendData = [
    { month: 'Jan', amount: 1150 },
    { month: 'Feb', amount: 1130 },
    { month: 'Mar', amount: 1300 },
    { month: 'Apr', amount: 1180 },
    { month: 'May', amount: 1265 },
    { month: 'Jun', amount: 1230 },
  ];

  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900">${category.value}</span>
                    <span className="text-gray-500">
                      {((category.value / totalSpending) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(category.value / totalSpending) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Monthly Spending Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="groceries" fill="#3b82f6" />
            <Bar dataKey="transportation" fill="#10b981" />
            <Bar dataKey="entertainment" fill="#ef4444" />
            <Bar dataKey="utilities" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Total Spending Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
