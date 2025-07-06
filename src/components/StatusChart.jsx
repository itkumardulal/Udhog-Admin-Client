import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const StatusChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const statusData = {
      labels: ['Active', 'Inactive'],
      datasets: [
        {
          data: [10, 4], // ✅ One dataset with both values
          backgroundColor: ['#22c55e', '#ef4444'], // Green & Red
          borderRadius: 10,
          barThickness: 80,
        },
      ],
    };

    const config = {
      type: 'bar',
      data: statusData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top',
            labels: {
              font: {
                size: 16,
              },
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 20,
              color: '#374151',
            },
          },
        },
        layout: {
          padding: {
            top: 30,
            bottom: 10,
            left: 20,
            right: 20,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 14,
              },
              color: '#4b5563',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 2,
              font: {
                size: 14,
              },
              color: '#4b5563',
            },
            grid: {
              drawBorder: false,
              color: '#e5e7eb',
            },
          },
        },
      },
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 Company Status Report</h1>
      <div className="relative h-[500px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default StatusChart;
