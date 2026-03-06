import { useState, useEffect } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { currencies } from "./data/currencies";

function App() {

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState(
    currencies.find((c) => c.value === "USD")
  );
  const [toCurrency, setToCurrency] = useState(
    currencies.find((c) => c.value === "GHS")
  );
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedResult, setConvertedResult] = useState(null);
  const [displayResult, setDisplayResult] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch exchange rates for base currency
  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    const fetchRate = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://open.er-api.com/v6/latest/${fromCurrency.value}`
        );

        const data = await res.json();

        if (data.result !== "success") {
          setError("Rate fetch failed");
          setExchangeRate(null);
        } else {
          const rate = data.rates[toCurrency.value];
          if (rate == null) {
            setError("Unsupported currency pair");
            setExchangeRate(null);
          } else {
            setExchangeRate(rate);
          }
        }
      } catch {
        setError("Failed to fetch exchange rate.");
        setExchangeRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  // Auto convert
  useEffect(() => {
    const numericAmount = parseFloat(amount);

    if (!isNaN(numericAmount) && exchangeRate != null) {
      setConvertedResult((numericAmount * exchangeRate).toFixed(2));
      animateResult((numericAmount * exchangeRate).toFixed(2));
    } else {
      setConvertedResult(null);
      setDisplayResult(0);
    }
  }, [amount, exchangeRate]);

  const animateResult = (target) => {
    let start = 0;
    const end = parseFloat(target);
    if (isNaN(end)) return;
    const duration = 600;
    const stepTime = 20;
    const increment = end / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayResult(start.toFixed(2));
    }, stepTime);
  };

  const handleAmountChange = (e) => setAmount(e.target.value);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const convertCurrency = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (fromCurrency.value === toCurrency.value) {
      setError("Choose different currencies");
      return;
    }
    if (convertedResult) {
      setHistory((prev) => [
        {
          from: fromCurrency.value,
          to: toCurrency.value,
          amount: numericAmount,
          result: convertedResult,
        },
        ...prev,
      ]);
      setError("");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <motion.div
          layout
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-[420px] transition-colors duration-500"
        >

          <div className="flex justify-end mb-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
            Currency Converter
          </h1>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
          />

          <div className="space-y-3">
            <Select
              options={currencies}
              value={fromCurrency}
              onChange={setFromCurrency}
            />
            <Select
              options={currencies}
              value={toCurrency}
              onChange={setToCurrency}
            />
          </div>

          <motion.button
            onClick={swapCurrencies}
            whileTap={{ rotate: 180 }}
            className="w-full mt-4 mb-3 bg-gray-200 dark:bg-gray-700 p-2 rounded"
          >
            Swap Currencies
          </motion.button>

          <button
            onClick={convertCurrency}
            className="w-full bg-blue-600 text-white p-2 rounded mb-2"
          >
            Convert
          </button>

          {loading && <p className="text-center text-gray-500 dark:text-gray-300">Fetching rate...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {exchangeRate != null && !loading && (
            <p className="text-center mt-4 dark:text-gray-300">
              1 {fromCurrency.value} = {exchangeRate} {toCurrency.value}
            </p>
          )}

          <AnimatePresence>
            {convertedResult != null && !loading && (
              <motion.div
                layout
                className="text-center mt-6 text-lg font-semibold dark:text-white"
              >
                {amount} {fromCurrency.value} = {displayResult} {toCurrency.value}
              </motion.div>
            )}
          </AnimatePresence>

          {history.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2 dark:text-white">History</h2>
              <ul className="space-y-1 text-sm dark:text-gray-300">
                {history.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b">
                    <span>{item.amount} {item.from}</span>
                    <span>= {item.result} {item.to}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;