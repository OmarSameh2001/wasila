export default function LoadingPage({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  return (
    <div
      className={
        `flex items-center justify-center` +
        (height ? " h-" + height : "h-screen") +
        (width ? " w-" + width : "")
      }
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
