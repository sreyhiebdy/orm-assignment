const users = require('../models/users') || [];
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllUserController = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const createNewUserController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const updateUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: {
        username,
        password,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  getAllUserController,
  createNewUserController,
  getUserByIdController,
  updateUserByIdController,
  deleteUserByIdController,
};