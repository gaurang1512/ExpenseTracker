import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { handleError } from "../../Utils/utils";

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch income data
  const fetchIncomes = async () => {
    try {
      const url = "http://localhost:8080/income";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 403) {
        navigate("/login");
        return;
      }

      const result = await response.json();
      console.log("Fetched incomes for chart:", result);
      setIncomes(result.data);
    } catch (err) {
      handleError('Error fetching incomes for chart');
    }
  };

  // Fetch expense data
  const fetchExpenses = async () => {
    try {
      const url = "http://localhost:8080/expense";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 403) {
        navigate("/login");
        return;
      }

      const result = await response.json();
      console.log("Fetched expenses for chart:", result);
      setExpenses(result.data);
    } catch (err) {
      handleError('Error fetching expenses for chart');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
      const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Income", "Expense"],
          datasets: [
            {
              data: [totalIncome, totalExpense],
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#64B5F6", "#FF99A1"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Income vs Expense Chart",
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [incomes, expenses]);

  return (
    <div className="DoughnutChart-chart-container" >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DoughnutChart;
