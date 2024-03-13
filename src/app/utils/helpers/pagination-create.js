const pagination = (currentPage, maxPages) => {
  if (maxPages <= 8) {
    return createDefaultArray(currentPage, maxPages);
  }
  if (currentPage + 3 >= maxPages) {
    return createPaginationEnd(currentPage, maxPages);
  }
  if (currentPage - 4 <= 0) {
    return createPaginationStart(currentPage, maxPages);
  }
  return createPaginationCenter(currentPage, maxPages);
};
const createDefaultArray = (currentPage, maxPages) => {
  return Array.from({ length: maxPages }, (v, k) => ({
    label: k + 1,
    active: k + 1 === currentPage,
  }));
};

const createPaginationCenter = (currentPage, maxPages) => {
  const array = [];
  array.push({ label: 1, active: false });
  array.push({ label: 2, active: false });
  array.push({ label: '...', active: false });
  array.push({ label: currentPage - 1, active: false });
  array.push({ label: currentPage, active: true });
  array.push({ label: currentPage + 1, active: false });
  array.push({ label: '...', active: false });
  array.push({ label: maxPages - 1, active: false });
  array.push({ label: maxPages, active: false });
  return array;
};

const createPaginationEnd = (currentPage, maxPages) => {
  const array = [];
  if (currentPage <= maxPages) {
    let i = maxPages;
    while (i >= currentPage) {
      array.unshift({ label: i, active: i === currentPage });
      i -= 1;
    }
  }
  for (let i = currentPage - 1; i < currentPage; i++) {
    array.unshift({ label: i, active: false });
  }
  array.unshift({ label: '...', active: false });
  array.unshift({ label: 2, active: false });
  array.unshift({ label: 1, active: false });
  return array;
};

const createPaginationStart = (currentPage, maxPages) => {
  const array = [];
  if (currentPage > 1) {
    for (let index = 1; index < currentPage; index++) {
      array.push({ label: index, active: index === false });
    }
  }
  for (let index = currentPage; index <= currentPage + 1; index++) {
    array.push({ label: index, active: index === currentPage });
  }
  array.push({ label: '...', active: false });
  array.push({ label: maxPages - 1, active: false });
  array.push({ label: maxPages, active: false });
  return array;
};

export { pagination };
