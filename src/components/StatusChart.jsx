import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const StatusChart = ({ companies }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!companies || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const activeCount = companies.filter(c => c.renewStatus === 'Active').length;
    const inactiveCount = companies.filter(c => c.renewStatus === 'Inactive').length;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const statusData = {
      labels: ['Active', 'Inactive'],
      datasets: [
        {
          data: [activeCount, inactiveCount],
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
          legend: { display: false },
        },
        layout: {
          padding: { top: 20, bottom: 10, left: 10, right: 10 },
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

    chartInstanceRef.current = new Chart(ctx, config);
  }, [companies]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        📊 Company Status Overview
      </h2>
      <div className="relative h-[300px] w-full bg-gray-50 rounded-lg p-2">
        {(!companies || companies.length === 0) ? (
          <p className="text-center text-gray-400 pt-20">No company data available.</p>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>
    </div>
  );
};

export default StatusChart;
