import { ObjectId } from "mongodb";
import { Router } from "express";
import { z } from "zod";
import { database } from "../db.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = Router();
const collection = database.collection<BookRecord>("books");

const bookFields = {
  title: z.string().trim().min(1, "El título es obligatorio").max(160),
  author: z.string().trim().min(1, "El autor es obligatorio").max(120),
  genre: z.string().trim().min(1, "El género es obligatorio").max(80),
  publishedYear: z.number().int().min(0).max(new Date().getFullYear() + 1),
  available: z.boolean()
};

const createBookSchema = z.object(bookFields).strict();
const updateBookSchema = createBookSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Debe enviar al menos un campo para actualizar"
);

type BookRecord = {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function serializeBook(book: BookRecord & { _id: ObjectId }) {
  return { ...book, id: book._id.toString(), _id: undefined };
}

function parseId(id: string | string[] | undefined): ObjectId | null {
  return typeof id === "string" && ObjectId.isValid(id) ? new ObjectId(id) : null;
}

router.get("/", async (_req, res, next) => {
  try {
    const books = await collection.find().sort({ title: 1 }).toArray();
    res.json(books.map(serializeBook));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const book = id ? await collection.findOne({ _id: id }) : null;
    if (!book) {
      res.status(404).json({ error: "Libro no encontrado" });
      return;
    }
    res.json(serializeBook(book));
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, requireRole("admin"), async (req, res, next) => {
  const parsed = createBookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const now = new Date();
    const book: BookRecord = { ...parsed.data, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(book);
    res.status(201).json(serializeBook({ ...book, _id: result.insertedId }));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, requireRole("admin"), async (req, res, next) => {
  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(404).json({ error: "Libro no encontrado" });
      return;
    }
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...parsed.data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result) {
      res.status(404).json({ error: "Libro no encontrado" });
      return;
    }
    res.json(serializeBook(result));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const result = id ? await collection.deleteOne({ _id: id }) : null;
    if (!result || result.deletedCount === 0) {
      res.status(404).json({ error: "Libro no encontrado" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export { router as booksRouter };
