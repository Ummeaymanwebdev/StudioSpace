
export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white animate-pulse"
        >
          <div className="h-52 bg-gray-200" />

          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-10 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
