export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 animate-pulse">
      <div className="aspect-square bg-zinc-100" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-zinc-100 rounded w-3/4" />
        <div className="flex justify-between pt-2 border-t border-zinc-50">
          <div className="h-6 bg-zinc-100 rounded w-1/4" />
          <div className="h-8 w-8 bg-zinc-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
