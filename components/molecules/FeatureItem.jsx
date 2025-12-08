export default function FeatureItem({ text }) {
  return (
    <div className="group bg-white rounded-xl px-6 py-4 border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg shadow-sm transition-all duration-300 hover:-translate-y-1 text-center">
      <p className="text-base font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">{text}</p>
    </div>
  );
}
