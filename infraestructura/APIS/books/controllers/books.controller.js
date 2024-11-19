const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtener todos los libros
const ShowBooks = async (req = request, res = response) => {
    try {
        const books = await prisma.books.findMany();
        res.json({
            books
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los libros',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
};

// Agregar un libro
const AddBook = async (req = request, res = response) => {
    try {
        const { title, description, author, imageUrl, price } = req.body;

        const result = await prisma.books.create({
            data: {
                title,
                description,
                author,
                imageUrl,
                price, // Añadido precio
            }
        });

        res.json({
            message: 'Libro agregado con éxito',
            book: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al agregar el libro',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
};

// Obtener un libro específico
const ShowBook = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const book = await prisma.books.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!book) {
            return res.status(404).json({
                message: 'Libro no encontrado'
            });
        }

        res.json({
            book
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el libro',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
};

// Editar un libro
const EditBook = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { title, description, author, imageUrl, price } = req.body;

        const result = await prisma.books.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                description,
                author,
                imageUrl,
                price, // Actualizado precio
            }
        });

        res.json({
            message: 'Libro actualizado con éxito',
            book: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el libro',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
};

// Eliminar un libro
const DeleteBook = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const result = await prisma.books.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            message: 'Libro eliminado con éxito',
            book: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el libro',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    ShowBooks,
    AddBook,
    ShowBook,
    EditBook,
    DeleteBook
};