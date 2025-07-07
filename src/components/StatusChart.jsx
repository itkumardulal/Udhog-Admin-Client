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
          data: [10, 4],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderRadius: 8,
          barThickness: 60,
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
          },
        },
        layout: {
          padding: {
            top: 20,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 13 },
              color: '#4b5563',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 2,
              font: { size: 13 },
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
    return () => chartInstance.destroy();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        📊 Company Status Overview
      </h2>
      <div className="relative h-[300px] w-full bg-gray-50 rounded-lg p-2">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default StatusChart;
