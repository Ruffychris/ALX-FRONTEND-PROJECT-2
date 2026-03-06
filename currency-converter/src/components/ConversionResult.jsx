export default function ConversionResult({ amount, currency }) {

  if (!amount) return null

  return (

    <div className="mt-4 p-4 bg-blue-50 rounded text-center">

      <p className="text-sm text-gray-500">
        Converted Amount
      </p>

      <p className="text-2xl font-bold text-blue-600">

        {amount.toFixed(2)} {currency}

      </p>

    </div>

  )
}