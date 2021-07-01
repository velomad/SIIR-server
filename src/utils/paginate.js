module.exports = paginate = async (
  model,
  pageSize,
  pageLimit,
  search,
  next
) => {
  try {
    const limit = parseInt(pageLimit, 10) || 10;
    const page = parseInt(pageSize, 10) || 1;

    let options = {
      offset: getOffset(page, limit),
      limit: limit,
    };

    if (Object.keys(search).length) {
      options = { search, ...options };
    }

    let { count, rows } = await model.findAndCountAll(options);

    return {
      previousPage: getPreviousPage(page),
      currentPage: page,
      nextPage: getNextPage(page, limit, count),
      total: count,
      limit: limit,
      data: rows,
    };
  } catch (error) {
    next(error);
  }
};

const getOffset = (page, limit) => {
  return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
  if (total / limit > page) {
    return page + 1;
  }

  return null;
};

const getPreviousPage = (page) => {
  if (page <= 1) {
    return null;
  }
  return page - 1;
};
