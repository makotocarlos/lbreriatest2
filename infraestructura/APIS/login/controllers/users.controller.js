/**
 * @author carlos
 * @version 1.0.0
 * 
 * Controlador de usuario
 * Este archivo define los controladores de usuarios
 */

const { response, request } = require('express');
const { PrismaClient } = require('@prisma/client');
const { Encrypt, Decrypt } = require('../middlewares/validate');
const { CreateJWT } = require('../middlewares/jwt');

const prisma = new PrismaClient();

// Mostrar todos los usuarios
const ShowUsers = async (req = request, res = response) => {
    const users = await prisma.users.findMany()
        .catch(err => {
            return err.message;
        }).finally(async () => {
            await prisma.$disconnect();
        });

    res.json({
        users
    });
};

// Agregar un nuevo usuario
const AddUsers = async (req = request, res = response) => {
    let { email, password } = req.body;

    password = Encrypt(password);

    const result = await prisma.users.create({
        data: {
            email,
            password
        }
    }).catch(err => {
        return err.message;
    }).finally(async () => {
        await prisma.$disconnect();
    });

    res.json({
        result
    });
};

// Mostrar un solo usuario por id
const ShowUser = async (req = request, res = response) => {
    const { id } = req.params;  // Obtiene el 'id' desde los parámetros de la solicitud

    const user = await prisma.users.findUnique({
        where: {
            id: Number(id)  // Busca el usuario por su 'id'
        }
    }).catch(err => {
        return res.status(500).json({ error: err.message });  // Manejo de errores
    }).finally(async () => {
        await prisma.$disconnect();  // Desconecta Prisma después de la operación
    });

    // Si el usuario no existe
    if (user) {
        res.json({
            user  // Devuelve el usuario encontrado
        });
    } else {
        res.status(404).json({
            msn: "Usuario no encontrado"  // Si no se encuentra el usuario
        });
    }
};

// Editar un usuario
const EditUsers = async (req = request, res = response) => {
    const { id } = req.params;

    const { email, password } = req.body;

    const result = await prisma.users.update({
        where: {
            id: Number(id)
        },
        data: {
            email,
            password
        }
    }).catch(err => {
        return err.message;
    }).finally(async () => {
        await prisma.$disconnect();
    });

    res.json({
        result
    });
};

// Eliminar un usuario
const DeleteUsers = async (req = request, res = response) => {
    const { id } = req.params;

    const result = await prisma.users.delete({
        where: {
            id: Number(id)
        }
    }).catch(err => {
        return err.message;
    }).finally(async () => {
        await prisma.$disconnect();
    });

    res.json({
        result
    });
};

// Iniciar sesión (Login)
const Login = async (req = request, res = response) => {
    let { email, password } = req.body;

    try {
        const user = await prisma.users.findFirst({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Desencriptar la contraseña
        if (Decrypt(user.password) !== password) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // Crear JWT
        const userJWT = CreateJWT(user);

        // Asegurarnos de que el id esté accesible en la respuesta
        res.json({
            user: { id: user.id, email: user.email }, // Solo el id y email
            userJWT
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error interno del servidor" });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    AddUsers,
    ShowUsers,
    ShowUser,
    EditUsers,
    DeleteUsers,
    Login
};