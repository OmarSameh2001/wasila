
export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  hasNextPage: boolean;
}


export const filterPrisma = async <T>(
  model: {
    findMany: (args: any) => Promise<T[]>
    count: () => Promise<number>
  },
  page: number,
  limit: number,
  params?: { [key: string]: any }
): Promise<PaginatedResult<T>> => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);

  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    model.findMany({
      ...(params && { where: { [params[0].key]: params[0].value } }),
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

