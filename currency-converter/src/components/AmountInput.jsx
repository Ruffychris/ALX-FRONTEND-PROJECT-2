import React from 'react'

export default function AmountInput({ amount, setAmount }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Amount</label>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-2"
      />
    </div>
  )
}