type CursorPaginationOptions = {
  cursor?: {
    id: string;
    created_at: Date;
  };
  limit?: number;
  where?: any;
  include?: any;
  model?: any;
  idField?: string;
  dateField?: string;
  uniqueName?: string;
};

export const cursorPaginate = async ({
  cursor,
  limit = 20,
  where = {},
  include = {},
  model,
  idField = "post_id",
  dateField = "created_at",
  uniqueName = "created_at_post_id",
}: CursorPaginationOptions) => {
  const items = await model.findMany({
    where,
    include,
    orderBy: [{ [dateField]: "desc" }, { [idField]: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: {
        [uniqueName]: {
          [dateField]: cursor.created_at,
          [idField]: cursor.id,
        },
      },
      skip: 1,
    }),
  });

  const hasMore = items.length > limit;
  if (hasMore) {
    items.pop();
  }
  const lastItem = items[items.length - 1];

  const nextCursor = hasMore && lastItem
    ? {
        id: lastItem[idField],
        created_at: lastItem[dateField],
      }
    : null;

  return {
    items,
    nextCursor,
    hasMore,
  };
};
