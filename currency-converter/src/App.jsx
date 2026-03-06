import { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "2c7d2f827c-24da54f391-tbhfyf";

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "GHS",
    "CAD",
    "AUD",
    "JPY",
    "CNY",
  ];

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Choose two different currencies");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`
      );

      const data = await res.json();

      setResult(data.conversion_result);
    } catch (err) {
      setError("Conversion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">

        <h1 className="text-2xl font-bold text-center mb-6">
          Currency Converter
        </h1>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Currency Selection */}
        <div className="flex gap-4 mb-4">

          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>

        </div>

        {/* Swap Button */}
        <button
          onClick={swapCurrencies}
          className="w-full mb-4 bg-gray-200 hover:bg-gray-300 p-2 rounded"
        >
          Swap Currencies
        </button>

        {/* Convert Button */}
        <button
          onClick={convertCurrency}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Convert
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-4 text-gray-500">
            Converting...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center mt-4 text-red-500">
            {error}
          </p>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="text-center mt-6 text-lg font-semibold">
            {amount} {fromCurrency} = {result} {toCurrency}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;