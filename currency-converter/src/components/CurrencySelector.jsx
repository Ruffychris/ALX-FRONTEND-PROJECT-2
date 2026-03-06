import React from 'react'

export default function CurrencySelector({
  label,
  currency,
  setCurrency,
  currencies
}) {

  return (
    <div className="flex flex-col w-full">

      <label className="mb-1 font-medium">{label}</label>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >

        {currencies.map((curr) => (
          <option key={curr} value={curr}>
            {curr}
          </option>
        ))}

      </select>

    </div>
  )
}