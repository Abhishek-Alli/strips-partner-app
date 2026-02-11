/**
 * Bar Chart Component
 * 
 * ERP-style reusable bar chart
 */

import React from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 260,
  color = '#2563eb' // admin blue
}) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: color,
        borderRadius: 4,
        maxBarThickness: 40
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
        padding: 10
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
      <Bar data={chartData} options={options} />
    </Box>
  );
};
