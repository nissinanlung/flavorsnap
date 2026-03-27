import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity, Download, Calendar, Filter, RefreshCw, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AnalyticsCard from '../components/AnalyticsCard';
import {
  ChartSkeleton,
  ListSkeleton,
  DateRangeFilterSkeleton,
} from '../components/SkeletonLoader';

interface UsageStats {
  date: string;
  requests: number;
  users: number;
  accuracy: number;
}

interface ModelPerformance {
  model: string;
  accuracy: number;
  inferenceTime: number;
  confidence: number;
}

interface UserEngagement {
  category: string;
  value: number;
  color: string;
}

interface ActivityLog {
  id: string;
  icon: 'eye' | 'check' | 'alert';
  title: string;
  description: string;
  timestamp: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  // Loading states for different sections
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingCharts, setIsLoadingCharts] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [usageData, setUsageData] = useState<UsageStats[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);
  const [statsCards, setStatsCards] = useState<StatCard[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data with proper async handling
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setError(null);
      setIsLoadingCards(true);
      setIsLoadingCharts(true);
      setIsLoadingActivity(true);

      // Simulate API calls with delays
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate usage statistics
      const usage: UsageStats[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        usage.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          requests: Math.floor(Math.random() * 500) + 100,
          users: Math.floor(Math.random() * 200) + 50,
          accuracy: Math.random() * 10 + 85,
        });
      }
      setUsageData(usage);

      // Generate model performance data
      const models: ModelPerformance[] = [
        { model: 'ResNet18', accuracy: 94.2, inferenceTime: 234, confidence: 87.5 },
        { model: 'ResNet34', accuracy: 95.1, inferenceTime: 312, confidence: 89.2 },
        { model: 'EfficientNet', accuracy: 93.8, inferenceTime: 189, confidence: 86.1 },
      ];
      setModelPerformance(models);

      // Generate user engagement data
      const engagement: UserEngagement[] = [
        { category: 'Akara', value: 23, color: '#FF6B6B' },
        { category: 'Bread', value: 19, color: '#4ECDC4' },
        { category: 'Egusi', value: 17, color: '#45B7D1' },
        { category: 'Moi Moi', value: 21, color: '#96CEB4' },
        { category: 'Rice and Stew', value: 12, color: '#FFEAA7' },
        { category: 'Yam', value: 8, color: '#DDA0DD' },
      ];
      setUserEngagement(engagement);

      setIsLoadingCharts(false);

      // Generate stats cards with calculated values
      await new Promise((resolve) => setTimeout(resolve, 400));
      const statsCardData: StatCard[] = [
        { title: 'Total Requests', value: '12,847', change: '+12.5%', icon: Activity, color: 'bg-blue-500' },
        { title: 'Active Users', value: '3,421', change: '+8.2%', icon: Users, color: 'bg-green-500' },
        { title: 'Avg Accuracy', value: '94.2%', change: '+2.1%', icon: CheckCircle, color: 'bg-purple-500' },
        { title: 'Response Time', value: '234ms', change: '-15ms', icon: Clock, color: 'bg-orange-500' },
      ];
      setStatsCards(statsCardData);
      setIsLoadingCards(false);

      // Generate activity logs
      await new Promise((resolve) => setTimeout(resolve, 600));
      const activities: ActivityLog[] = [
        {
          id: '1',
          icon: 'eye',
          title: 'Classification Request',
          description: 'Jollof Rice - 95.2% confidence',
          timestamp: '2 min ago',
        },
        {
          id: '2',
          icon: 'check',
          title: 'Model Update',
          description: 'Accuracy improved to 94.5%',
          timestamp: '15 min ago',
        },
        {
          id: '3',
          icon: 'alert',
          title: 'High Traffic Alert',
          description: '150+ requests in last hour',
          timestamp: '1 hour ago',
        },
      ];
      setActivityLogs(activities);
      setIsLoadingActivity(false);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      setIsLoadingCards(false);
      setIsLoadingCharts(false);
      setIsLoadingActivity(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData();
    setIsRefreshing(false);
  }, [fetchAnalyticsData]);

  // Handle export
  const handleExport = useCallback(() => {
    try {
      const data = {
        usageData,
        modelPerformance,
        userEngagement,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export report. Please try again.');
    }
  }, [usageData, modelPerformance, userEngagement]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor usage patterns, model performance, and user engagement</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleExport}
                disabled={isLoadingCharts || isLoadingCards}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards with Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {isLoadingCards
            ? Array.from({ length: 4 }).map((_, i) => <AnalyticsCard key={i} title="" value="" change="" icon={Activity} color="" isLoading />)
            : statsCards.map((stat, index) => (
                <AnalyticsCard key={index} {...stat} isLoading={false} />
              ))}
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {isLoadingCards ? (
            <DateRangeFilterSkeleton />
          ) : (
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Usage Statistics */}
          {isLoadingCharts ? (
            <ChartSkeleton title />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Statistics</h2>
              {usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#3B82F6" name="Requests" strokeWidth={2} />
                    <Line type="monotone" dataKey="users" stroke="#10B981" name="Active Users" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          )}

          {/* Model Performance */}
          {isLoadingCharts ? (
            <ChartSkeleton title />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Model Performance</h2>
              {modelPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#8B5CF6" name="Accuracy (%)" />
                    <Bar dataKey="confidence" fill="#F59E0B" name="Confidence (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          )}

          {/* User Engagement */}
          {isLoadingCharts ? (
            <ChartSkeleton title />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Food Classification Distribution</h2>
              {userEngagement.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userEngagement}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userEngagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          )}

          {/* Real-time Activity */}
          {isLoadingActivity ? (
            <ChartSkeleton title />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Real-time Activity</h2>
              {activityLogs.length > 0 ? (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        {log.icon === 'eye' && <Eye className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                        {log.icon === 'check' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        {log.icon === 'alert' && <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{log.title}</p>
                          <p className="text-sm text-gray-600 truncate">{log.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 ml-4 flex-shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <ListSkeleton count={3} type="activity" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
