const Loading = () => {
  return (
    <>
      <div className="w-full h-20 animate-pulse bg-gray-200 rounded-md" />
      {[...Array(10)].map((item, index) => <div key={index} className="w-full h-20 animate-pulse bg-gray-200 rounded-md mt-2" />)}
    </>
  );
};

export default Loading;