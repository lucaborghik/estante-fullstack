export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookInput = Omit<Book, "id" | "createdAt" | "updatedAt">;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers }
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error ?? `Error HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const booksApi = {
  list: () => request<Book[]>("/books"),
  get: (id: string) => request<Book>(`/books/${id}`),
  create: (book: BookInput) => request<Book>("/books", { method: "POST", body: JSON.stringify(book) }),
  update: (id: string, book: Partial<BookInput>) =>
    request<Book>(`/books/${id}`, { method: "PUT", body: JSON.stringify(book) }),
  remove: (id: string) => request<void>(`/books/${id}`, { method: "DELETE" })
};
