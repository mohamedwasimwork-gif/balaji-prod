interface StatBarProps {
  state: string;
  mw: number;
  color: string;
  widthPercent: number;
}

export default function StatBar({ state, mw, color, widthPercent }: StatBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex min-h-[56px] items-center justify-between rounded-xl px-5 py-3 font-manrope"
        style={{ backgroundColor: color, width: `${widthPercent}%`, minWidth: '180px' }}
      >
        <span className="text-sm font-medium text-white/90">{state}</span>
        <span className="text-sm font-semibold text-white">
          {mw.toLocaleString()} <span className="opacity-70">MW</span>
        </span>
      </div>
    </div>
  );
}
