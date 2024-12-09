import React, { useState, useEffect } from "react";
import "./RankingsPage.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function RankingsPage() {
  const [accounts, setAccounts] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0); // Store total players
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/accounts/top");
        const data = await response.json();

        setAccounts(data.data);
        setTotalPlayers(data.totalPlayers); // Get total players from API

        // Prepare data for the chart
        setChartData({
          labels: data.data.map((item) => item.username),
          datasets: [
            {
              label: "Total Scores",
              data: data.data.map((item) => item.total_score),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="rankings-page">
      <h2>Players Ranking Page</h2>

      {/* Rankings Chart */}
      <div className="rankings-chart">
        <h3>Top 10 Players</h3>
        {chartData ? (
          <div style={{ height: "300px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Rankings Table */}
      <div className="rankings-table">
        <h3>Rankings List</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingsPage;
