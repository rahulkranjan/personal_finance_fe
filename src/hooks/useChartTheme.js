// src/hooks/useChartTheme.js
import { useTheme } from "../contexts/ThemeContext";

export function useChartTheme() {
  const { isDark } = useTheme();

  return {
    color: isDark ? "#fff" : "#666",
    backgroundColor: isDark ? "#1f2937" : "#fff",
    options: {
      plugins: {
        legend: {
          labels: {
            color: isDark ? "#fff" : "#666",
          },
        },
        title: {
          color: isDark ? "#fff" : "#666",
        },
      },
      scales: {
        x: {
          grid: {
            color: isDark ? "#374151" : "#e5e7eb",
          },
          ticks: {
            color: isDark ? "#fff" : "#666",
          },
        },
        y: {
          grid: {
            color: isDark ? "#374151" : "#e5e7eb",
          },
          ticks: {
            color: isDark ? "#fff" : "#666",
          },
        },
      },
    },
  };
}
