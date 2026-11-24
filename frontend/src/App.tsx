import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { authClient } from "./auth-client";
import { booksApi, type Book, type BookInput } from "./api";
import { BookForm } from "./BookForm";

function Header() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  async function logout() {
    await authClient.signOut();
    navigate("/");
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark">E</span> estante<span className="brand-dot">.</span></Link>
      <nav>
        <Link to="/">Catálogo</Link>
        {session?.user.role === "admin" && <Link to="/admin">Administrar</Link>}
        {!isPending && (session ? (
          <button className="nav-button" onClick={logout}>Cerrar sesión</button>
        ) : <Link className="nav-login" to="/login">Ingresar</Link>)}
      </nav>
    </header>
  );
}

function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    booksApi.list().then(setBooks).catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div className="eyebrow">LECTURAS PARA DESCUBRIR</div>
        <h1>Un buen libro<br /><em>siempre te encuentra.</em></h1>
        <p>Explorá nuestro catálogo y encontrá tu próxima historia favorita.</p>
        <a className="button button-dark" href="#catalogo">Explorar catálogo <span>↓</span></a>
        <div className="hero-decoration" aria-hidden="true">B.</div>
      </section>
      <section id="catalogo" className="catalog-section">
        <div className="section-heading">
          <div><div className="eyebrow">LA COLECCIÓN</div><h2>Libros destacados</h2></div>
          <span className="count">{books.length.toString().padStart(2, "0")} títulos</span>
        </div>
        {error && <p className="error">{error}</p>}
        {!error && books.length === 0 ? <p className="empty">Todavía no hay libros. Volvé pronto.</p> : (
          <div className="book-grid">
            {books.map((book, index) => (
              <Link to={`/books/${book.id}`} className="book-card" key={book.id}>
                <div className={`book-cover cover-${index % 5}`}>
                  <span className="cover-genre">{book.genre}</span>
                  <span className="cover-title">{book.title}</span>
                  <span className="cover-author">{book.author}</span>
                  <span className="cover-year">{book.publishedYear}</span>
                </div>
                <div className="book-meta"><span>{book.author}</span><span>{book.available ? "Disponible" : "Prestado"}</span></div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function BookDetail() {
  const { id = "" } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { booksApi.get(id).then(setBook).catch((err: Error) => setError(err.message)); }, [id]);
  if (error) return <main className="page"><p className="error">{error}</p><Link to="/">Volver al catálogo</Link></main>;
  if (!book) return <main className="page">Cargando libro...</main>;
  return (
    <main className="page detail-layout">
      <div className="detail-cover"><div className="book-cover cover-2"><span className="cover-genre">{book.genre}</span><span className="cover-title">{book.title}</span><span className="cover-author">{book.author}</span></div></div>
      <section className="detail-copy">
        <Link to="/" className="back-link">← Volver al catálogo</Link>
        <div className="eyebrow">{book.genre} · {book.publishedYear}</div>
        <h1>{book.title}</h1><p className="detail-author">por {book.author}</p>
        <p>{book.available ? "Disponible para leer." : "Actualmente prestado."}</p>
      </section>
    </main>
  );
}

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const result = mode === "login"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name });
    setBusy(false);
    if (result.error) setError(result.error.message ?? "No se pudo completar la solicitud");
    else navigate("/");
  }

  async function githubLogin() {
    const result = await authClient.signIn.social({ provider: "github", callbackURL: "/" });
    if (result.error) setError(result.error.message ?? "No se pudo iniciar sesión con GitHub");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/" className="back-link">← Volver</Link>
        <div className="eyebrow">{mode === "login" ? "QUÉ BUENO VERTE" : "SUMATE A ESTANTE"}</div>
        <h1>{mode === "login" ? "Ingresá a tu cuenta" : "Crear una cuenta"}</h1>
        {mode === "register" && <label>Nombre<input required value={name} onChange={(e) => setName(e.target.value)} /></label>}
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Contraseña<input type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button className="button button-dark full-width" disabled={busy}>{busy ? "Un momento..." : mode === "login" ? "Ingresar" : "Registrarme"}</button>
        <div className="divider">o continuar con</div>
        <button type="button" className="button button-outline full-width" onClick={githubLogin}>GitHub</button>
        <p className="auth-switch">{mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <Link to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Registrate" : "Ingresá"}</Link>
        </p>
      </form>
    </main>
  );
}

function AdminPage() {
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setBooks(await booksApi.list());
  }
  useEffect(() => { refresh().catch((err: Error) => setError(err.message)); }, []);

  if (isPending) return <main className="page">Cargando sesión...</main>;
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== "admin") return <main className="page"><h1>Sin permisos</h1><p>Esta sección es solo para administradores.</p></main>;

  async function saveBook(book: BookInput) {
    try {
      if (editing) await booksApi.update(editing.id, book);
      else await booksApi.create(book);
      setEditing(null);
      setError("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("¿Eliminar este libro?")) return;
    try { await booksApi.remove(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar"); }
  }

  return (
    <main className="page admin-page">
      <div className="eyebrow">PANEL DE ADMINISTRACIÓN</div><h1>Gestionar libros</h1>
      <div className="admin-layout">
        <section className="form-panel"><h2>{editing ? "Editar libro" : "Agregar libro"}</h2><BookForm initial={editing ?? undefined} onSubmit={saveBook} onCancel={() => setEditing(null)} /></section>
        <section className="admin-list"><h2>Catálogo ({books.length})</h2>{error && <p className="error">{error}</p>}
          {books.map((book) => <div className="admin-row" key={book.id}><div><strong>{book.title}</strong><span>{book.author} · {book.publishedYear}</span></div><div className="row-actions"><button onClick={() => setEditing(book)}>Editar</button><button className="delete" onClick={() => deleteBook(book.id)}>Eliminar</button></div></div>)}
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return <><Header /><Routes>
    <Route path="/" element={<Catalog />} />
    <Route path="/books/:id" element={<BookDetail />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="*" element={<main className="page"><h1>Página no encontrada</h1><Link to="/">Volver al catálogo</Link></main>} />
  </Routes></>;
}
