export default function LoadingPage({
  height,
  width,
  className,
}: {
  height?: string;
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={
        `flex flex-col items-center justify-center ${
          height ? "h-" + height : "min-h-[70vh]"
        } ${width ? "w-" + width : ""} ${className ? className : ""}`
        // (height ? " h-" + height : "h-screen") +
        // (width ? " w-" + width : "")
      }
    >
      <div className={"animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"}></div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Wasila
        </span>
    </div>
  );
}
