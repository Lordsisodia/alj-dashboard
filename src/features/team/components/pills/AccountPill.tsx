export function AccountPill({ handle }: { handle: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{
        backgroundColor: '#f5f5f4',
        color: '#78716c',
        border: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {handle}
    </span>
  );
}
