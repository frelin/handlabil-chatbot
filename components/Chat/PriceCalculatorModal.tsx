import React, { useState } from 'react';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({ isOpen, onClose, data }) => {
  const [financingType, setFinancingType] = useState<'Avbetalning' | 'Leasing'>('Avbetalning');
  const [price, setPrice] = useState<number | 0>(Number(data.price.value));
  const [downPayment, setDownPayment] = useState<number | 0>(Number(data.price.value)*0.2);
  const [interestRate, setInterestRate] = useState<number | 0>(8.49);
  const [amortizationPeriod, setAmortizationPeriod] = useState<number | ''>(84);
  const [residualValue, setResidualValue] = useState<number | 0>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg z-10 w-11/12 md:w-1/3">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kalkylator ({data.make} {data.model})</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Finansieringstyp</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="Avbetalning"
                  checked={financingType === 'Avbetalning'}
                  onChange={() => setFinancingType('Avbetalning')}
                  className="mr-2"
                />
                Avbetalning
              </label>
              <label>
                <input
                  type="radio"
                  value="Leasing"
                  checked={financingType === 'Leasing'}
                  onChange={() => setFinancingType('Leasing')}
                  className="mr-2"
                />
                Leasing
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pris</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Ange pris"
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Kontant/Inbyte (kr)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Ange belopp"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Aktuell ränta (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Ange ränta"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Amorteringstid (mån)</label>
              <input
                type="number"
                value={amortizationPeriod}
                onChange={(e) => setAmortizationPeriod(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Ange månader"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Restvärde (kr)</label>
              <input
                type="number"
                value={residualValue}
                onChange={(e) => setResidualValue(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Ange restvärde"
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between mb-4">
            <span>Kreditbelopp: {price*0.8} kr</span>
            <span>Eff.ränta: xx.x%</span>
          </div>

          <div className="flex justify-between items-center bg-[#008d7f] text-white p-4 rounded-md">
            <span>Månadskostnad: xxx kr</span>
            <button className="bg-gray-800 text-white px-4 py-2 rounded">nära</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculatorModal;