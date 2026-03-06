import React from 'react'

export default function ConversionResult({ amount, currency }) {

  if (!amount) return null

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded text-center font-semibold">

      {amount.toFixed(2)} {currency}

    </div>
  )
}