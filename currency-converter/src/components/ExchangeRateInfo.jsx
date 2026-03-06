export default function ExchangeRateInfo({ from, to, rate, lastUpdated }) {

  if (!rate) return null

  return (

    <div className="mt-3 text-xs text-gray-500 text-center">

      <p>
        1 {from} = {rate} {to}
      </p>

      <p>
        Updated: {new Date(lastUpdated).toLocaleString()}
      </p>

    </div>

  )
}