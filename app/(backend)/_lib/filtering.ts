import { castParam } from "./fields";

export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  hasNextPage: boolean;
}

function handleUrl(url: URL, modelName: string) {
  return [...url.searchParams].reduce<Record<string, any>>((acc, [key, value]) => {
    if (["page", "limit", "sort", "order"].includes(key)) return acc;

    const parsed = castParam(modelName, key, value);
    if (!parsed) return acc;

    // Merge into the final object
    return { ...acc, ...parsed };
  }, {});
}

export const filterPrisma = async <T>(
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: () => Promise<number>;
  },
  page: number,
  limit: number,
  params?: { [key: string]: string | number },
  url?: URL,
  modelName?: string
): Promise<PaginatedResult<T>> => {
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
      // ...(params && { where: params }),
      skip,
      take: safeLimit,
    }),
    model.count(),
  ]);

  const totalPages = Math.ceil(total / safeLimit);
  const hasNextPage = safePage < totalPages;

  return {
    data: items,
    totalPages,
    hasNextPage,
  };
};
