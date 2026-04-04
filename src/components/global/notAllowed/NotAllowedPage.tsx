function NotAllowedPage({
  message = "ليست لديك صلاحية",
}: {
  message?: string;
}) {
  return (
    <div className="flex-1 w-full h-full flex justify-center items-center">
      {message}
    </div>
  );
}

export default NotAllowedPage;
