"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { transactionType } from "@/type";

type productDetail = {
  serviceId: string;
  price: number;
  name: string;
};

type ReportData = {
  transaction: Transaction[];
  totalTransaction: number;
  totalPrice: number;
};

type Transaction = {
  outletId: string;
  customerId: string;
  transactionDate: string;
  totalAmount: number;
  status: string;
  productDetail: productDetail[];
};

Chart.register(...registerables);

type TimePeriod = "Hari" | "Minggu" | "Bulan" | "Tahun";

export default function StorePerformance() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("Minggu");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const [chartData, setChartData] = useState<number[]>([]);

  const labels: Record<TimePeriod, string[]> = {
    Hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    Minggu: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    Bulan: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    Tahun: Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString()).reverse(),
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dailyRes, weeklyRes, monthlyRes, yearlyRes, transactionsRes] = await Promise.all([
          fetch("/api/outlets/reports/daily"),
          fetch("/api/outlets/reports/weekly"),
          fetch("/api/outlets/reports/monthly"),
          fetch("/api/outlets/reports/yearly"),
          fetch("/api/outlets/transaction"),
        ]);

        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);

        const dailyData = await dailyRes.json();
        const weeklyData = await weeklyRes.json();
        const monthlyData = await monthlyRes.json();
        const yearlyData = await yearlyRes.json();

        if (timePeriod === "Hari") {
          setChartData(dailyData);
        } else if (timePeriod === "Minggu") {
          setChartData(weeklyData);
        } else if (timePeriod === "Bulan") {
          setChartData(monthlyData);
        } else if (timePeriod === "Tahun") {
          setChartData(yearlyData);
        }

        const totalTransaction = transactionsData.length;
        const totalPrice = transactionsData.reduce((sum: number, t: transactionType) => sum + t.totalAmount, 0);
        setReportData({ transaction: transactionsData, totalTransaction, totalPrice });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, selectedMonth, selectedYear]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const chartConfig: ChartConfiguration = {
        type: "line",
        data: {
          labels: labels[timePeriod],
          datasets: [
            {
              label: `Penjualan (${timePeriod})`,
              data: chartData,
              backgroundColor: "rgba(128, 0, 128, 0.2)", 
              borderColor: "rgba(255, 20, 147, 1)", 
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
  }, [chartData, timePeriod]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-16 w-16 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center mt-20 bg-pink-50 min-h-screen">
      <span className="text-xl font-bold mb-4 text-purple-700">Performa Toko</span>

      <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 lg:w-1/2 mb-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Summary</h2>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Total Transactions:</span>
          <span className="text-purple-700">{reportData?.totalTransaction}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Total Amount:</span>
          <span className="text-purple-700">{reportData?.totalPrice}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="timePeriod" className="block text-lg font-medium mb-2">
            Pilih Periode Waktu
          </label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            className="border rounded-md px-4 py-2 text-sm bg-white"
          >
            <option value="Hari">Per Hari</option>
            <option value="Minggu">Per Minggu</option>
            <option value="Bulan">Per Bulan</option>
            <option value="Tahun">Per Tahun</option>
          </select>
        </div>

        {timePeriod === "Bulan" && (
          <div>
            <label htmlFor="month" className="block text-lg font-medium mb-2">
              Pilih Bulan
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border rounded-md px-4 py-2 text-sm bg-white"
            >
              {labels.Bulan.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}

        {(timePeriod === "Bulan" || timePeriod === "Tahun") && (
          <div>
            <label htmlFor="year" className="block text-lg font-medium mb-2">
              Pilih Tahun
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded-md px-4 py-2 text-sm bg-white"
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

      <div className="w-full lg:w-1/2">
        <span className="text-lg block text-center mb-2 text-purple-700">Grafik Penjualan</span>
        <div className="relative" style={{ height: "300px" }}>
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
