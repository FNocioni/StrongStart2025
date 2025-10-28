import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function Budgets() {
  const budgets = [
    {
      id: 1,
      category: 'Groceries',
      spent: 450,
      budget: 600,
      color: 'blue',
      icon: '🛒',
    },
    {
      id: 2,
      category: 'Transportation',
      spent: 280,
      budget: 300,
      color: 'green',
      icon: '🚗',
    },
    {
      id: 3,
      category: 'Entertainment',
      spent: 320,
      budget: 250,
      color: 'red',
      icon: '🎬',
    },
    {
      id: 4,
      category: 'Utilities',
      spent: 180,
      budget: 200,
      color: 'purple',
      icon: '💡',
    },
    {
      id: 5,
      category: 'Dining Out',
      spent: 240,
      budget: 300,
      color: 'orange',
      icon: '🍽️',
    },
    {
      id: 6,
      category: 'Shopping',
      spent: 150,
      budget: 400,
      color: 'pink',
      icon: '🛍️',
    },
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudget = budgets.filter(b => b.spent > b.budget);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Budgets</h1>
          <p className="text-gray-600">Track and manage your spending limits</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {overBudget.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {overBudget.length} budget{overBudget.length > 1 ? 's' : ''} that exceeded the limit this month.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-2">Total Budget</h3>
          <p className="text-gray-900 mb-4">${totalBudget.toFixed(2)}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Spent</span>
              <span>${totalSpent.toFixed(2)}</span>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} />
            <div className="flex justify-between text-gray-600">
              <span>Remaining</span>
              <span>${(totalBudget - totalSpent).toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 mb-2">This Month's Summary</h3>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">On Track</span>
              <span className="text-green-600">{budgets.filter(b => b.spent <= b.budget).length} budgets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Over Budget</span>
              <span className="text-red-600">{overBudget.length} budgets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Usage</span>
              <span className="text-gray-900">{((totalSpent / totalBudget) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const isOverBudget = budget.spent > budget.budget;
          
          return (
            <Card key={budget.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{budget.icon}</span>
                  <div>
                    <h4 className="text-gray-900">{budget.category}</h4>
                    <p className="text-gray-600">
                      ${budget.spent} / ${budget.budget}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Progress 
                value={Math.min(percentage, 100)} 
                className={isOverBudget ? 'bg-red-100' : ''}
              />

              <div className="mt-3 flex justify-between">
                <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className="text-gray-600">
                  ${(budget.budget - budget.spent).toFixed(2)} left
                </span>
              </div>

              {isOverBudget && (
                <div className="mt-3 text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Over budget by ${(budget.spent - budget.budget).toFixed(2)}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
