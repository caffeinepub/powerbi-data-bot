import { useEffect, useRef } from 'react';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface DataVisualizationProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
}

export default function DataVisualization({ data, type }: DataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Colors - using actual color values instead of CSS variables
    const emeraldColor = 'rgb(46, 204, 113)';
    const chartColors = [
      'rgb(46, 204, 113)',
      'rgb(52, 152, 219)',
      'rgb(155, 89, 182)',
      'rgb(241, 196, 15)',
      'rgb(230, 126, 34)',
    ];

    if (type === 'bar') {
      drawBarChart(ctx, data, rect.width, rect.height, emeraldColor);
    } else if (type === 'pie') {
      drawPieChart(ctx, data, rect.width, rect.height, chartColors);
    } else if (type === 'line') {
      drawLineChart(ctx, data, rect.width, rect.height, emeraldColor);
    }
  }, [data, type]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    data: DataPoint[],
    width: number,
    height: number,
    color: string
  ) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 10;
    const maxValue = Math.max(...data.map((d) => d.value));

    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + 10);
      const y = height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = 'rgb(156, 163, 175)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.name.substring(0, 10), x + barWidth / 2, height - padding + 15);

      // Draw value
      ctx.fillStyle = 'rgb(209, 213, 219)';
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
    });
  };

  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    data: DataPoint[],
    width: number,
    height: number,
    colors: string[]
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const total = data.reduce((sum, point) => sum + point.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((point, index) => {
      const sliceAngle = (point.value / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round((point.value / total) * 100)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: DataPoint[],
    width: number,
    height: number,
    color: string
  ) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map((d) => d.value));
    const stepX = chartWidth / (data.length - 1);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (point.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();
  };

  return (
    <div className="w-full h-[300px]">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No data available</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" />
      )}
    </div>
  );
}
