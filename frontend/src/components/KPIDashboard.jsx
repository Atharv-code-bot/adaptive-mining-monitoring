import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

const KPIDashboard = ({ mineId }) => {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKPI = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getMineKPI(mineId);
        setKpi(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setKpi(null);
      } finally {
        setLoading(false);
      }
    };

    if (mineId !== null && mineId !== undefined) {
      loadKPI();
    }
  }, [mineId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Error loading KPI</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!kpi) {
    return <div className="text-gray-500 text-center py-8">No KPI data available</div>;
  }

  const metrics = [
    {
      title: 'Total Pixels',
      value: kpi.total_pixels?.toLocaleString() || '0',
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'Excavated Pixels',
      value: `${kpi.excavated_pixels?.toLocaleString() || '0'} (${kpi.excavated_percentage || '0'}%)`,
      icon: '🚜',
      color: 'red'
    },
    {
      title: 'Avg NDVI (Normal)',
      value: kpi.avg_ndvi_normal?.toFixed(3) || '0.00',
      icon: '🌱',
      color: 'green'
    },
    {
      title: 'Avg NDVI (Excavated)',
      value: kpi.avg_ndvi_excavated?.toFixed(3) || '0.00',
      icon: '⚠️',
      color: 'orange'
    },
    {
      title: 'Max Anomaly Score',
      value: kpi.max_anomaly_score?.toFixed(4) || '0.00',
      icon: '🎯',
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`${colorClasses[metric.color]} border rounded-lg p-4 transition hover:shadow-md`}
          >
            <div className="text-2xl mb-2">{metric.icon}</div>
            <p className="text-xs uppercase tracking-wide font-semibold opacity-70">
              {metric.title}
            </p>
            <p className="text-lg font-bold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {kpi.date_range && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
          <span className="font-semibold">Data Range:</span> {kpi.date_range.start} to {kpi.date_range.end}
        </div>
      )}
    </div>
  );
};

export default KPIDashboard;
