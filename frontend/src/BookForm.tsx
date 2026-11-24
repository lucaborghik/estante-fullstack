import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Book, BookInput } from "./api";

const schema = z.object({
  title: z.string().trim().min(1, "Ingresá un título").max(160, "Máximo 160 caracteres"),
  author: z.string().trim().min(1, "Ingresá el autor").max(120, "Máximo 120 caracteres"),
  genre: z.string().trim().min(1, "Ingresá el género").max(80, "Máximo 80 caracteres"),
  publishedYear: z.coerce.number().int("Ingresá un año entero").min(0, "El año no puede ser negativo").max(new Date().getFullYear() + 1),
  available: z.boolean()
});

type FormValues = z.infer<typeof schema>;

export function BookForm({ initial, onSubmit, onCancel }: {
  initial?: Book;
  onSubmit: (book: BookInput) => Promise<void>;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? {
      title: initial.title,
      author: initial.author,
      genre: initial.genre,
      publishedYear: initial.publishedYear,
      available: initial.available
    } : { title: "", author: "", genre: "", publishedYear: new Date().getFullYear(), available: true }
  });

  return (
    <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
      <label>Título<input {...register("title")} />{errors.title && <small>{errors.title.message}</small>}</label>
      <label>Autor<input {...register("author")} />{errors.author && <small>{errors.author.message}</small>}</label>
      <label>Género<input {...register("genre")} />{errors.genre && <small>{errors.genre.message}</small>}</label>
      <label>Año de publicación<input type="number" {...register("publishedYear")} />{errors.publishedYear && <small>{errors.publishedYear.message}</small>}</label>
      <label className="checkbox-label"><input type="checkbox" {...register("available")} /> Disponible</label>
      <div className="form-actions"><button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : initial ? "Guardar cambios" : "Crear libro"}</button>
        {initial && <button type="button" className="button button-outline" onClick={onCancel}>Cancelar</button>}</div>
    </form>
  );
}
