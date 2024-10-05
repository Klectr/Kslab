export function updateLocalStorage(
  location: "notes" | "images",
  collection: unknown[] | Record<string, unknown>
) {
  localStorage.setItem(location, JSON.stringify(collection))
}
