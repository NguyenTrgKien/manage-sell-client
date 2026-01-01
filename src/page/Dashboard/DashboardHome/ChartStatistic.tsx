import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface ChartStatisticProp {
  dashboardStatistic: {
    guest: { guestRevenue: number; guestOrders: number };
    member: { memberRevenue: number; memberOrders: number };
    period: string;
    totalOrders: number;
    totalRevenue: number;
  }[];
  statisticFollow: "all" | "member" | "guest";
}

function ChartStatistic({
  dashboardStatistic,
  statisticFollow,
}: ChartStatisticProp) {
  const titleMap = {
    all: "Tổng doanh thu & số đơn hàng",
    member: "Doanh thu & đơn hàng - Khách thành viên",
    guest: "Doanh thu & đơn hàng - Khách vãng lai",
  };
  const data = {
    labels: dashboardStatistic.map((it: any) => it.period),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: dashboardStatistic.map((it) =>
          statisticFollow === "all"
            ? Number(it.totalRevenue)
            : statisticFollow === "member"
              ? Number(it.member.memberRevenue)
              : Number(it.guest.guestRevenue)
        ),
        backgroundColor: "green",
        borderColor: "green",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y-doanhthu",
      },
      {
        label: "Tổng đơn hàng",
        data: dashboardStatistic.map((it) =>
          statisticFollow === "all"
            ? Number(it.totalOrders)
            : statisticFollow === "member"
              ? Number(it.member.memberOrders)
              : Number(it.guest.guestOrders)
        ),
        backgroundColor: "orange",
        borderColor: "orange",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y-donhang",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { font: { size: 14 }, padding: 20 },
      },
      title: {
        display: true,
        text: titleMap[statisticFollow],
        font: { size: 18, weight: "bold" },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label.includes("Doanh thu")) {
              return `${label}: ${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
            }
            return `${label}: ${value} đơn`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      "y-doanhthu": {
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VND)",
          font: { size: 14 },
        },
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat("vi-VN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value);
          },
        },
      },
      "y-donhang": {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: "Số đơn hàng",
          font: { size: 14 },
        },
        ticks: {
          stepSize: 1,
          font: { size: 12 },
        },
      },
    },
  };
  return (
    <div className="w-full h-[50rem]">
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartStatistic;
