'use client';

export function SamplePostGrid({ gradients }: { gradients: [string, string][] }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {gradients.map(([from, to], i) => (
        <div
          key={i}
          className="aspect-square rounded-lg"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        />
      ))}
    </div>
  );
}
