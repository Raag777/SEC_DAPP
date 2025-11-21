export default function Input({ label, className = "", ...props }) {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>}
      <input
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
}
