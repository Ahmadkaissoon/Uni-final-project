function ErrorComponent({ error }: { error?: Error }) {
  console.log(error);
  return (
    <div className="col-span-full flex-1">
      <div className="w-full h-full flex justify-center items-center text-red-400">
        عذراً, حدث خطأ ما
      </div>
    </div>
  );
}

export default ErrorComponent;
