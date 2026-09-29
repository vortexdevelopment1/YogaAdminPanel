// ProgressBar component rendering dynamic visual capacity metrics with color-coded fill

interface ProgressBarProps {
  percent: number;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  let barColor = "bg-sage";
  if (clampedPercent >= 100) {
    barColor = "bg-terracotta";
  } else if (clampedPercent >= 75) {
    barColor = "bg-[#E0B45A]";
  }

  return (
    <div className="w-full h-2.5 bg-sand/70 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${barColor}`}
        style={{ width: `${clampedPercent}%` }}
      />
    </div>
  );
}
