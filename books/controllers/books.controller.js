/**
 * @author carlos
 * @version 1.0.0
 * 
 * Controlador de libros
 * Este archivo define los controladores de libros
 */

const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client');
const { EncryptBookData, DecryptBookData } = require('../middlewares/booksCryptoMiddleware');

const prisma = new PrismaClient();

// Obtener todos los libros
const ShowBooks = async (req = request, res = response) => {
    try {
        const books = await prisma.books.findMany();

        // Descifrar datos sensibles de los libros si es necesario
        const decryptedBooks = books.map(book => ({
            ...book,
            title: DecryptBookData(book.title),
            description: DecryptBookData(book.description)
        }));

        res.json({
            books: decryptedBooks
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
        const { title, description, author, publishedYear, userId } = req.body;

        // Cifrar los datos antes de guardarlos
        const encryptedTitle = EncryptBookData(title);
        const encryptedDescription = EncryptBookData(description);

        const result = await prisma.books.create({
            data: {
                title: encryptedTitle,
                description: encryptedDescription,
                author,
                publishedYear: Number(publishedYear),
                userId: Number(userId)
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

        // Descifrar datos del libro
        book.title = DecryptBookData(book.title);
        book.description = DecryptBookData(book.description);

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
        const { title, description, author, publishedYear, userId } = req.body;

        // Cifrar los datos actualizados
        const encryptedTitle = EncryptBookData(title);
        const encryptedDescription = EncryptBookData(description);

        const result = await prisma.books.update({
            where: {
                id: Number(id)
            },
            data: {
                title: encryptedTitle,
                description: encryptedDescription,
                author,
                publishedYear: Number(publishedYear),
                userId: Number(userId)
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
