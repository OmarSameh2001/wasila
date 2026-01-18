export default function ErrorPage({
  height,
  width,
  message,
}: {
  height?: string;
  width?: string;
  message?: string;
}) {
  return (
    <div
      className={
        `flex flex-col items-center justify-center ${
          height ? "h-" + height : "min-h-[70vh]"
        } ${width ? "w-" + width : ""}`
        // (height ? " h-" + height : "h-screen") +
        // (width ? " w-" + width : "")
      }
    >
      
        <span className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Wasila
        </span>
        <span className="text-lg font-bold text-gray-900 dark:text-white mt-4">
          {message}
        </span>
    </div>
  );
}
