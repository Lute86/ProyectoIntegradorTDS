import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.rol) {
    where.rol = filters.rol;
  }

  if (filters.activo !== undefined) {
    where.activo = filters.activo === 'true' || filters.activo === true;
  }

  const users = await models.User.findAll({
    where,
    attributes: { exclude: ['password_hash'] },
    order: [['nombre', 'ASC']],
  });

  return users;
});

export const getById = handleDbErrors(async (id) => {
  const user = await models.User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
  });

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  return user;
});

export const create = handleDbErrors(async (data) => {
  const existingUser = await models.User.findOne({ where: { email: data.email } });
  if (existingUser) {
    throw new ConflictError('El email ya está registrado');
  }

  const userData = { ...data };

  if (userData.password) {
    userData.password_hash = await bcrypt.hash(userData.password, 10);
    delete userData.password;
  }

  const user = await models.User.create(userData);

  const userJson = user.toJSON();
  delete userJson.password_hash;

  return userJson;
});

export const update = handleDbErrors(async (id, data) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const updateData = { ...data };

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await models.User.findOne({ where: { email: updateData.email } });
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }
  }

  if (updateData.password) {
    updateData.password_hash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }

  await user.update(updateData);

  const userJson = user.toJSON();
  delete userJson.password_hash;

  return userJson;
});

export const remove = handleDbErrors(async (id) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  await user.destroy();
  return { message: 'Usuario eliminado exitosamente' };
});

export const toggleActive = handleDbErrors(async (id) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  await user.update({ activo: !user.activo });

  const userJson = user.toJSON();
  delete userJson.password_hash;

  return userJson;
});
