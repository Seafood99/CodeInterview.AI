import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Target,
  Code,
  Brain,
  Calendar,
  Award
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data - nanti akan diganti dengan real data dari Firebase
  const stats = {
    problemsSolved: 24,
    totalProblems: 100,
    averageTime: '12m 34s',
    successRate: 78,
    weeklyGoal: 5,
    currentStreak: 3
  };

  const recentActivity = [
    { id: 1, problem: 'Two Sum', difficulty: 'Easy', time: '8m 23s', status: 'solved', date: '2 hours ago' },
    { id: 2, problem: 'Binary Tree Traversal', difficulty: 'Medium', time: '15m 12s', status: 'solved', date: '1 day ago' },
    { id: 3, problem: 'Valid Parentheses', difficulty: 'Easy', time: '5m 45s', status: 'solved', date: '2 days ago' },
    { id: 4, problem: 'Merge Intervals', difficulty: 'Hard', time: '25m 30s', status: 'attempted', date: '3 days ago' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'solved' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Coder'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to ace your next coding interview? Let's see your progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.problemsSolved}</p>
              <p className="text-sm text-gray-500">of {stats.totalProblems} total</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageTime}</p>
              <p className="text-sm text-green-600">↓ 2m faster</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              <p className="text-sm text-green-600">↑ 5% this week</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
              <p className="text-sm text-gray-500">days in a row</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.problem}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">• {activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/problems"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-center block"
                >
                  View All Problems
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Weekly Goal */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Goal</h3>
              <Target className="h-5 w-5 text-primary-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stats.currentStreak}/{stats.weeklyGoal} problems</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.currentStreak / stats.weeklyGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {stats.weeklyGoal - stats.currentStreak} more to reach your goal!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
            <div className="space-y-3">
              <Link
                to="/problems?difficulty=easy"
                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Code className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Easy Problems</span>
              </Link>
              <Link
                to="/problems?random=true"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Random Challenge</span>
              </Link>
              <Link
                to="/interview/mock"
                className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800 font-medium">Mock Interview</span>
              </Link>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-primary-900">AI Tip</h3>
            </div>
            <p className="text-primary-800 text-sm">
              Based on your recent performance, try focusing on dynamic programming problems. 
              Your array manipulation skills are strong! 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;