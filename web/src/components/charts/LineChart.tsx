/**
 * Line Chart Component
 * 
 * ERP-style time series chart
 */

import React from 'react';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { AnalyticsTimeSeries } from '@shared/core/analytics/analyticsTypes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: AnalyticsTimeSeries[];
  label: string;
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  label,
  color = '#2563eb', // admin blue
  height = 260
}) => {
  const chartData = {
    labels: data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
    }),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          precision: 0,
          color: '#6b7280'
        }
      }
    }
  };

  return (
    <Box sx={{ height }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};
