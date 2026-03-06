import React from 'react'

export default function ExchangeRateInfo({ from, to, rate, lastUpdated }) {

  if (!rate) return null

  return (
    <div className="mt-3 text-sm text-gray-500 text-center">

      1 {from} = {rate} {to}

      <div>
        Updated: {lastUpdated}
      </div>

    </div>
  )
}