import { NextResponse } from "next/server";
import modelFields, { castParam } from "./fields";

export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  hasNextPage: boolean;
}

export function handleUrl(url: URL, modelName: string) {
  const orMode = url.searchParams.get("orMode") === "true";

  return [...url.searchParams].reduce<Record<string, any>>(
    (acc, [key, value]) => {
      if (["page", "limit", "sort", "order"].includes(key)) return acc;

      const parsed = castParam(modelName, key, value);

      if (!parsed) return acc;

      if (!orMode) return { ...acc, ...parsed };

      return {
        ...acc,
        OR: [...(acc.OR ?? []), parsed],
      };
    },
    {},
  );
}

export const filterPrisma = async <T, TWhereInput, TInclude, TSelect, TOrderBy>(
  model: {
    findMany: (args: {
      where?: TWhereInput;
      skip?: number;
      take?: number;
      include?: TInclude;
      select?: TSelect;
      orderBy?: any;
    }) => Promise<T[]>;
    count: (args: { where?: TWhereInput }) => Promise<number>;
  },
  page: number,
  limit: number,
  params?: TWhereInput,
  url?: URL,
  modelName?: string,
  include?: TInclude,
  select?: TSelect,
  orderBy?: TOrderBy,
): Promise<NextResponse> => {
  //: Promise<PaginatedResult<T>>
  try {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    // console.log("url", url)

    const sortField = url?.searchParams.get("sort");
    const sortOrder = url?.searchParams.get("order") || "asc";

    // Build orderBy object
    let newOrderBy: any = orderBy;
    if (sortField && modelName && modelFields[modelName]?.[sortField]) {
      newOrderBy = { [sortField]: sortOrder === "desc" ? "desc" : "asc" };
    }
    
    if (url && modelName) {
      params = { ...params, ...handleUrl(url, modelName) } as TWhereInput;
    }

    const skip = (safePage - 1) * safeLimit;
    // console.log(
    //   "safePage",
    //   safePage,
    //   "safeLimit",
    //   safeLimit,
    //   "skip",
    //   skip,
    //   "params",
    //   params,
    //   "model",
    //   modelName
    // );
    const [items, total] = await Promise.all([
      model.findMany({
        ...(params && { where: params }),
        skip,
        take: safeLimit,
        ...(Object.keys(include || {}).length ? { include } : {}),
        ...(!Object.keys(include || {}).length &&
        Object.keys(select || {}).length
          ? { select }
          : {}),
        ...(newOrderBy && { orderBy: newOrderBy }),
      }),
      model.count({
        ...(params && { where: params }),
      }),
    ]);

    if (!items.length)
      return NextResponse.json(
        { error: "No items found" + (params && ", try changing your filters") },
        { status: 404 },
      );

    const totalPages = Math.ceil(total / safeLimit);
    const hasNextPage = safePage < totalPages;

    // return {
    //   data: items,
    //   totalPages,
    //   hasNextPage,
    // };

    return NextResponse.json(
      { data: items, totalPages, hasNextPage },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error filtering data:", error);
    return NextResponse.json(
      { error: "Error querying " + modelName || "data" },
      { status: 500 },
    );
  }
};
