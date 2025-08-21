import currencies from "../util/currencies";

const CurrencySelector = ({ label, value, onChange }) => {
  const selectId = `${(label || "").toLowerCase()}-currency` || "currency-selector";
  const nameAttr = `${(label || "").toLowerCase()}Currency` || "currency";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={nameAttr}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={onChange}
      >
        {Object.keys(currencies).map((currency) => (
          <option key={currency} value={currency}>
            {currencies[currency].flag} {currency} - {currencies[currency].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;