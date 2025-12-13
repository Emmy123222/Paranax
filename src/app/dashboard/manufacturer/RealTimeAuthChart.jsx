'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, subHours, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const RealTimeAuthChart = ({ auths = [] }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('line');
  const [isRealTime, setIsRealTime] = useState(true);
  const intervalRef = useRef(null);

  // Process authentication data based on time range
  const processAuthData = () => {
    const now = new Date();
    let startTime;
    let timeFormat;
    let groupBy;

    switch (timeRange) {
      case '1h':
        startTime = subHours(now, 1);
        timeFormat = 'HH:mm';
        groupBy = 'minute';
        break;
      case '24h':
        startTime = subHours(now, 24);
        timeFormat = 'HH:mm';
        groupBy = 'hour';
        break;
      case '7d':
        startTime = subDays(now, 7);
        timeFormat = 'MMM dd';
        groupBy = 'day';
        break;
      case '30d':
        startTime = subDays(now, 30);
        timeFormat = 'MMM dd';
        groupBy = 'day';
        break;
      default:
        startTime = subHours(now, 24);
        timeFormat = 'HH:mm';
        groupBy = 'hour';
    }

    // Filter authentications within time range
    const filteredAuths = auths.filter(auth => {
      const authDate = new Date(auth.createdAt);
      return authDate >= startTime && authDate <= now;
    });

    // Group by time intervals
    const timeSlots = [];
    const successCounts = [];
    const failedCounts = [];
    const totalCounts = [];

    // Generate time slots
    const slotCount = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    
    for (let i = slotCount - 1; i >= 0; i--) {
      let slotTime;
      if (groupBy === 'minute') {
        slotTime = subHours(now, i * 0.083); // 5-minute intervals
      } else if (groupBy === 'hour') {
        slotTime = subHours(now, i);
      } else {
        slotTime = subDays(now, i);
      }
      
      timeSlots.push(format(slotTime, timeFormat));
      
      // Count authentications in this time slot
      const slotAuths = filteredAuths.filter(auth => {
        const authDate = new Date(auth.createdAt);
        if (groupBy === 'minute') {
          return Math.abs(authDate - slotTime) < 5 * 60 * 1000; // 5-minute window
        } else if (groupBy === 'hour') {
          return authDate.getHours() === slotTime.getHours() && 
                 authDate.getDate() === slotTime.getDate();
        } else {
          return authDate.getDate() === slotTime.getDate() && 
                 authDate.getMonth() === slotTime.getMonth();
        }
      });

      const successCount = slotAuths.filter(auth => auth.status === 'passed').length;
      const failedCount = slotAuths.filter(auth => auth.status === 'failed').length;
      
      successCounts.push(successCount);
      failedCounts.push(failedCount);
      totalCounts.push(successCount + failedCount);
    }

    return { timeSlots, successCounts, failedCounts, totalCounts };
  };

  const { timeSlots, successCounts, failedCounts, totalCounts } = processAuthData();

  // Chart data configuration
  const getChartData = () => {
    const baseConfig = {
      labels: timeSlots,
      datasets: []
    };

    if (chartType === 'line') {
      baseConfig.datasets = [
        {
          label: 'Successful Authentications',
          data: successCounts,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Failed Authentications',
          data: failedCounts,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ];
    } else if (chartType === 'bar') {
      baseConfig.datasets = [
        {
          label: 'Successful',
          data: successCounts,
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1,
        },
        {
          label: 'Failed',
          data: failedCounts,
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1,
        }
      ];
    }

    return baseConfig;
  };

  // Doughnut chart for success/failure ratio
  const getDoughnutData = () => {
    const totalSuccess = successCounts.reduce((a, b) => a + b, 0);
    const totalFailed = failedCounts.reduce((a, b) => a + b, 0);

    return {
      labels: ['Successful', 'Failed'],
      datasets: [
        {
          data: [totalSuccess, totalFailed],
          backgroundColor: ['#10B981', '#EF4444'],
          borderColor: ['#059669', '#DC2626'],
          borderWidth: 2,
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: chartType !== 'doughnut' ? {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          stepSize: 1,
        }
      }
    } : {},
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Real-time updates
  useEffect(() => {
    if (isRealTime) {
      intervalRef.current = setInterval(() => {
        // Force re-render to update with new data
        setTimeRange(prev => prev);
      }, 30000); // Update every 30 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime]);

  // Handle empty data
  if (!auths || auths.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Authentication Data</h3>
            <p className="text-gray-500">Authentication requests will appear here once products are verified.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={getChartData()} options={chartOptions} />;
      case 'bar':
        return <Bar data={getChartData()} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={getDoughnutData()} options={doughnutOptions} />;
      default:
        return <Line data={getChartData()} options={chartOptions} />;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Authentication Analytics</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isRealTime ? 'Live' : 'Static'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => setTimeRange(prev => prev)}
            className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            title="Refresh Data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Real-time Toggle */}
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isRealTime 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isRealTime ? 'Live' : 'Static'}
          </button>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Chart Type Selector */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="doughnut">Doughnut Chart</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {totalCounts.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-blue-600">Total Requests</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {successCounts.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-green-600">Successful</div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {failedCounts.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-red-600">Failed</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {totalCounts.reduce((a, b) => a + b, 0) > 0 
              ? ((successCounts.reduce((a, b) => a + b, 0) / totalCounts.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
              : 0}%
          </div>
          <div className="text-sm text-purple-600">Success Rate</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        {renderChart()}
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {isRealTime && (
          <span>Updates automatically every 30 seconds • </span>
        )}
        Showing data for {timeRange === '1h' ? 'the last hour' : 
                         timeRange === '24h' ? 'the last 24 hours' : 
                         timeRange === '7d' ? 'the last 7 days' : 
                         'the last 30 days'}
      </div>
    </div>
  );
};

export default RealTimeAuthChart;