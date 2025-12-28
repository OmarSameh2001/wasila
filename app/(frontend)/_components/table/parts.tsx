import Image from "next/image";

export default function TablePart({ type, data }: any) {
  switch (type) {
    case "logo":
      return (
        <div className="flex items-center">
          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
            <Image
              className="rounded-full"
              src={
                data
              }
              width="40"
              height="40"
              alt={'logo'}
            />
          </div>
        </div>
      );
    case "text":
      return <div className="text-left">{data}</div>;
    case "action":
      return (
        <div className="flex flex-col gap-2">
          <span className="font-bold">{data.name}</span>
          <span className="text-sm">{data.description}</span>
        </div>
      );
    case "price":
      return (
        <div className="text-left font-medium text-green-500">{data}</div>
      );
    default:
      return null;
  }
}
