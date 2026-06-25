function JourneyItem({ year, title, last = false }) {
  return (
    <div className="flex flex-col items-center">

      {/* Circle */}
      <div className="w-5 h-5 rounded-full bg-blue-600"></div>

      {/* Line */}
      {!last && (
        <div className="w-[2px] h-20 bg-slate-300"></div>
      )}

      {/* Content */}
      <div className="text-center mt-6">

        <h3 className="text-xl font-bold text-slate-900">
          {year}
        </h3>

        <p className="mt-2 text-slate-600">
          {title}
        </p>

      </div>

    </div>
  );
}

export default JourneyItem;