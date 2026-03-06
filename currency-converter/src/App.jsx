import React from 'react'
import AmountInput from './components/AmountInput'
import CurrencySelector from './components/CurrencySelector'
import ConversionResult from './components/ConversionResult'
import ExchangeRateInfo from './components/ExchangeRateInfo'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Currency Converter
        </h1>

        <AmountInput />
        <div className="flex gap-4 my-4">
          <CurrencySelector label="From" />
          <CurrencySelector label="To" />
        </div>

        <ConversionResult />
        <ExchangeRateInfo />
      </div>
    </div>
  )
}

export default App