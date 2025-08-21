import {useRef, useState} from "react";
import CurrencySelector from "./CurrencySelector";
const CurrencyConverter = () => {
  const amountInput = useRef();
  const [fromCurrency,setFromCurrency] = useState("USD");
  const [toCurrency,setToCurrency] = useState("INR");
  const [convertedAmount,setConvertedAmount] = useState(0);

  
  
  const convertHandler = () => {
    fetch("http://localhost:3000/api/convert",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInput.current.value,
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setConvertedAmount(data.targetAmount);
    })

  };

  return (
    <div className="max-w-3xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
          <input
            id="amount"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref ={amountInput}
            placeholder="Enter amount here"
          />
        </div>

        <CurrencySelector label ="From" value ={fromCurrency} onChange ={(e) => setFromCurrency(e.target.value)}/>
        <CurrencySelector label ="To" value ={toCurrency} onChange ={(e) => setToCurrency(e.target.value)}/>

        <div className="sm:col-span-4 flex justify-end">
          <button
            onClick={convertHandler}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Convert
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-600">Converted Amount</div>
        <div className="text-2xl font-bold" aria-live="polite">
          {convertedAmount} {toCurrency}
        </div>
      </div>

    </div>
  );

};

export default CurrencyConverter;