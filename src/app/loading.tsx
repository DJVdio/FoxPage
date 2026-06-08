export default function RootLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="pip-progress mx-auto w-48">
          <div className="pip-progress-fill w-2/3 animate-pulse" />
        </div>
        <p className="mt-2 text-[10px] tracking-[0.15em] text-[#00aa2a]/60">LOADING...</p>
      </div>
    </div>
  );
}
