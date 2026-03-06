import React, { useState, useEffect } from "react"
import AmountInput from "./components/AmountInput"
import CurrencySelector from "./components/CurrencySelector"
import ConversionResult from "./components/ConversionResult"
import ExchangeRateInfo from "./components/ExchangeRateInfo"
import { fetchExchangeRates } from "./services/exchangeRateService"

function App() {

  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("GHS")
  const [rates, setRates] = useState({})
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch exchange rates
  useEffect(() => {

    async function getRates() {

      try {

        setLoading(true)
        setError(null)

        const data = await fetchExchangeRates(fromCurrency)

        setRates(data.rates)
        setLastUpdated(data.time_last_update_utc)

      } catch (err) {

        setError("Failed to fetch exchange rates. Please try again.")

      } finally {

        setLoading(false)

      }
    }

    getRates()

  }, [fromCurrency])


  // Calculate conversion
  useEffect(() => {

    if (rates[toCurrency]) {

      const result = amount * rates[toCurrency]
      setConvertedAmount(result)

    }

  }, [amount, toCurrency, rates])


  // Swap currencies
  function handleSwap() {

    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 md:p-8">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Currency Converter
        </h1>


        {/* Loading message */}

        {loading && (

          <p className="text-center text-gray-500 mb-4">
            Fetching exchange rates...
          </p>

        )}


        {/* Error message */}

        {error && (

          <p className="text-center text-red-500 mb-4">
            {error}
          </p>

        )}


        <AmountInput
          amount={amount}
          setAmount={setAmount}
        />


        {/* Currency selectors */}

        <div className="flex items-end gap-2 my-4">

          <CurrencySelector
            label="From"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            currencies={Object.keys(rates)}
          />


          {/* Swap Button */}

          <button
            onClick={handleSwap}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ⇄
          </button>


          <CurrencySelector
            label="To"
            currency={toCurrency}
            setCurrency={setToCurrency}
            currencies={Object.keys(rates)}
          />

        </div>


        <ConversionResult
          amount={convertedAmount}
          currency={toCurrency}
        />


        <ExchangeRateInfo
          from={fromCurrency}
          to={toCurrency}
          rate={rates[toCurrency]}
          lastUpdated={lastUpdated}
        />

      </div>

    </div>

  )
}

export default App