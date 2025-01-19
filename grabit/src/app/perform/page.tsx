"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";

// Register the required components
Chart.register(...registerables);

export default function StorePerformance() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [timePeriod, setTimePeriod] = useState("Minggu"); // Default: Minggu
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default: Current Year

  // Dummy data for different time periods
  const weeklyData = [50, 75, 100, 125, 150, 175, 200]; // 7 days
  const monthlyData = [400, 500, 600, 800, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700]; // 12 months
  const yearlyData = [12000, 15000, 18000, 20000, 25000]; // 5 years

  const labels = {
    Minggu: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    Bulan: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    Tahun: Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString()).reverse(),
  };

  useEffect(() => {
    // Update or initialize the chart
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const chartConfig: ChartConfiguration = {
        type: "line",
        data: {
          labels: labels[timePeriod], // Dynamic labels
          datasets: [
            {
              label: `Penjualan (${timePeriod})`,
              data:
                timePeriod === "Minggu"
                  ? weeklyData
                  : timePeriod === "Bulan"
                  ? monthlyData
                  : yearlyData, // Dynamic data
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
          },
        },
      };

      chartInstance.current = new Chart(chartRef.current, chartConfig);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timePeriod, selectedYear]); // Rerun effect when timePeriod or selectedYear changes

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <span className="text-xl font-bold mb-4">Performa Toko</span>

      {/* Dropdown for selecting time period */}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="timePeriod" className="block text-lg font-medium mb-2">
            Pilih Periode Waktu
          </label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="border rounded-md px-4 py-2 text-sm"
          >
            <option value="Minggu">Per Minggu</option>
            <option value="Bulan">Per Bulan</option>
            <option value="Tahun">Per Tahun</option>
          </select>
        </div>

        {/* Dropdown for selecting year (only for Bulan and Tahun) */}
        {timePeriod !== "Minggu" && (
          <div>
            <label htmlFor="year" className="block text-lg font-medium mb-2">
              Pilih Tahun
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded-md px-4 py-2 text-sm"
            >
              {labels.Tahun.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full lg:w-1/2">
        <span className="text-lg block text-center mb-2">Grafik Penjualan</span>
        <div className="relative" style={{ height: "300px" }}>
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
