import React from 'react'

export default function AmountInput() {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Amount</label>
      <input
        type="number"
        className="border border-gray-300 rounded px-3 py-2"
        placeholder="Enter amount"
      />
    </div>
  )
}