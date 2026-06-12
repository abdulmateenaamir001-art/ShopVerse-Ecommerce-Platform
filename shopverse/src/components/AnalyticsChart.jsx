import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsChart({ totalRevenue }) {
  const baseRevenue = totalRevenue > 0 ? totalRevenue : 1525.69;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Gross Revenue ($)',
        data: [
          (baseRevenue * 0.4).toFixed(2),
          (baseRevenue * 0.55).toFixed(2),
          (baseRevenue * 0.5).toFixed(2),
          (baseRevenue * 0.75).toFixed(2),
          (baseRevenue * 0.85).toFixed(2),
          baseRevenue.toFixed(2),
        ],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        tension: 0.35,
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.04)' },
        ticks: { font: { weight: '600' } },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}

