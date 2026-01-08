export default function ErrorPage({
  height,
  width,
}: {
  height?: string;
  width?: string;
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
    </div>
  );
}
