export default function BestSellerCardSkeleton() {
  return (
    <div className="flex flex-col w-full min-w-[240px] md:min-w-[220px] min-h-[400px] bg-white rounded-2xl border border-zinc-100 shadow-sm animate-pulse overflow-hidden">
      <div className="aspect-square bg-white" />
      <div className="flex flex-col p-5 space-y-2">
        <div className="h-3 bg-zinc-100 rounded w-1/2" />
        <div className="h-5 bg-zinc-100 rounded w-3/4" />
        <div className="h-6 bg-zinc-100 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}
