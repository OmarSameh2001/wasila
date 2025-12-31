import { NextResponse } from "next/server";
import { castParam } from "./fields";

export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  hasNextPage: boolean;
}

export function handleUrl(url: URL, modelName: string) {
  return [...url.searchParams].reduce<Record<string, any>>(
    (acc, [key, value]) => {
      if (["page", "limit", "sort", "order"].includes(key)) return acc;

      const parsed = castParam(modelName, key, value);
      if (!parsed) return acc;

      // Merge into the final object
      return { ...acc, ...parsed };
    },
    {}
  );
}

export const filterPrisma = async <T>(
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  },
  page: number,
  limit: number,
  params?: { [key: string]: string | number },
  url?: URL,
  modelName?: string,
  include: any = {}
) => {
  //: Promise<PaginatedResult<T>>
  try {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);

    if (url && modelName) params = { ...params, ...handleUrl(url, modelName) };

    const skip = (safePage - 1) * safeLimit;
    console.log(
      "safePage",
      safePage,
      "safeLimit",
      safeLimit,
      "skip",
      skip,
      "params",
      params,
      "model",
      modelName
    );
    const [items, total] = await Promise.all([
      model.findMany({
        ...(params && { where: params }),
        skip,
        take: safeLimit,
        include,
      }),
      model.count({
        ...(params && { where: params }),
      }),
    ]);

    if (!items.length)
      return NextResponse.json(
        { error: "No items found" + (params && ", try changing your filters") },
        { status: 404 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error filtering data:", error);
    return NextResponse.json(
      { error: "Error querying " + modelName || "data" },
      { status: 500 }
    );
  }
};
