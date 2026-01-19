import { usePathname } from "next/navigation";

function getPathName(base?: string) {
  const pathname = usePathname();
  let path = pathname
    .split("/")
    .filter(
      (path) =>
        !["sme", "individual_medical", "car"].includes(path) &&
        isNaN(Number(path)) &&
        path !== "",
    );

  if (base) {
    path = path.fill(base, 1, 2);
  }

  return path.join("/");
}

export default getPathName;
