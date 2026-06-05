'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ScanLine, 
  Eye, 
  Smartphone, 
  Monitor, 
  Loader2, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { getAnalyticsByWorkspace, aggregateAnalytics, getProductsByWorkspace } from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

type TimeRange = 7 | 30 | 9999; // 9999 = All time

export default function AnalyticsPage() {
  const { workspace, verticalConfig } = useBusinessVertical();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const fetchData = async () => {
    if (!workspace?.workspaceId) return;

    try {
      setLoading(true);
      const [events, productData] = await Promise.all([
        getAnalyticsByWorkspace(workspace.workspaceId, timeRange),
        getProductsByWorkspace(workspace.workspaceId),
      ]);

      const aggregated = aggregateAnalytics(events);
      setAnalyticsData(aggregated);
      setProducts(productData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workspace?.workspaceId, timeRange]);

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your {verticalConfig.arExperienceLabel} performance and customer engagement
          </p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-surface rounded-xl p-1">
          {[
            { value: 7, label: '7 Days' },
            { value: 30, label: '30 Days' },
            { value: 9999, label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as TimeRange)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-all',
                timeRange === option.value
                  ? 'bg-white dark:bg-dark-card shadow-sm text-brand-600 dark:text-brand-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: verticalConfig.analyticsKPILabels.scans,
            value: analyticsData?.totalScans || 0,
            icon: ScanLine,
            color: 'blue',
            bgColor: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
          },
          {
            label: `${verticalConfig.arExperienceLabel} Launches`,
            value: analyticsData?.totalARLaunches || 0,
            icon: Eye,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: 'Conversion Rate',
            value: `${analyticsData?.conversionRate || 0}%`,
            icon: TrendingUp,
            color: 'emerald',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: 'Active Devices',
            value: Object.keys(analyticsData?.devices || {}).length,
            icon: Smartphone,
            color: 'amber',
            bgColor: 'bg-amber-50 dark:bg-amber-900/30',
            textColor: 'text-amber-600 dark:text-amber-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ rotateY: 5, rotateX: -5, transition: { duration: 0.2 } }}
            className="perspective-1000"
          >
            <div className="glass-card-hover p-5 preserve-3d">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Scan Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
              Scan Trends
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="text-gray-500 dark:text-gray-400">Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-500 dark:text-gray-400">Launches</span>
              </div>
            </div>
          </div>

          {analyticsData?.chartData?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.chartData}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLaunches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="scans" stroke="#5c7cfa" fillOpacity={1} fill="url(#colorScans)" />
                  <Area type="monotone" dataKey="launches" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLaunches)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center">
              <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No scan data yet. Share your QR codes to start tracking!
              </p>
            </div>
          )}
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Device Breakdown
          </h2>

          {Object.keys(analyticsData?.devices || {}).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analyticsData.devices as Record<string, number>).map(([device, count]) => {
                const deviceCounts = Object.values(analyticsData.devices as Record<string, number>);
                const total = deviceCounts.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device === 'ios' ? (
                          <Smartphone className="w-4 h-4 text-gray-500" />
                        ) : device === 'android' ? (
                          <Smartphone className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Monitor className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {device}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-dark-surface rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-brand-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center">
              <Smartphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Waiting for device data
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing {verticalConfig.productLabels.plural}
        </h2>

        {analyticsData?.topProducts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {verticalConfig.productLabels.singular}
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Scans
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts.map((item: any, i: number) => (
                  <tr key={item.productId} className="border-b border-gray-50 dark:border-dark-border/50 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {getProductName(item.productId)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {item.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No product data yet. Generate QR codes and share them to see which {verticalConfig.productLabels.plural.toLowerCase()} perform best!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}