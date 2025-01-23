export default function Finance() {
  return (
    <div className="w-screen h-screen bg-pink-50 pt-20 flex flex-col items-center">
      {/* Section Total */}
      <div className="mt-6 bg-white w-3/4 h-36 p-10 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <span className="text-lg lg:text-xl font-medium text-purple-700">Total:</span>
        <span className="text-xl lg:text-2xl font-semibold text-pink-600">Rp</span>
      </div>

      {/* Section Balance and Withdraw */}
      <div className="flex justify-center mt-10 space-x-12 w-full">
        {/* Total Balance */}
        <div className="bg-white w-1/3 h-42 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <span className="text-lg lg:text-xl font-semibold text-purple-700">Total Saldo:</span>
          <span className="text-xl lg:text-2xl text-pink-600">Rp</span>
        </div>

        {/* Withdrawn */}
        <div className="bg-white w-1/3 h-36 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <span className="text-lg lg:text-xl font-semibold text-purple-700">Ditarik:</span>
          <span className="text-xl lg:text-2xl text-pink-600">Rp</span>
        </div>
      </div>
    </div>
  );
}
