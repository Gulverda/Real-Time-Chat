const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800 z-50">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-[#5D5FEF] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
