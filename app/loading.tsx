export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-2 border-orange-500/20 animate-ping" />
        <div className="h-10 w-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-white">Memuat Data SEJIWA+...</p>
        <p className="text-xs text-slate-400">Menyinkronkan data spasial & deret waktu ekonometrika</p>
      </div>
    </div>
  );
}
