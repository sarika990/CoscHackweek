/**
 * Perform case-insensitive search filtering across storage keys, values, and types.
 * @param {Array<object>} items
 * @param {string} query
 * @returns {Array<object>}
 */
export function searchItems(items, query) {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  
  return items.filter(item => {
    const keyMatch = item.key.toLowerCase().includes(lowerQuery);
    const valueMatch = item.value.toLowerCase().includes(lowerQuery);
    const typeMatch = item.type.toLowerCase().includes(lowerQuery);
    return keyMatch || valueMatch || typeMatch;
  });
}

/**
 * Sort storage items according to selected criteria.
 * @param {Array<object>} items
 * @param {string} criteria
 * @returns {Array<object>}
 */
export function sortItems(items, criteria) {
  const sorted = [...items];
  
  switch (criteria) {
    case 'key-asc':
      sorted.sort((a, b) => a.key.localeCompare(b.key));
      break;
    case 'key-desc':
      sorted.sort((a, b) => b.key.localeCompare(a.key));
      break;
    case 'size-desc':
      sorted.sort((a, b) => b.size - a.size);
      break;
    case 'size-asc':
      sorted.sort((a, b) => a.size - b.size);
      break;
    case 'type':
      sorted.sort((a, b) => a.type.localeCompare(b.type) || a.key.localeCompare(b.key));
      break;
    default:
      break;
  }
  
  return sorted;
}
