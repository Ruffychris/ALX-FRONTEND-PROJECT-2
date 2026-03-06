import React from 'react'

export default function CurrencySelector({ label }) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium">{label}</label>
      <select className="border border-gray-300 rounded px-3 py-2">
        <option>USD</option>
        <option>GHS</option>
        <option>EUR</option>
        <option>GBP</option>
      </select>
    </div>
  )
}