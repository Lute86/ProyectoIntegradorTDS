import { Op } from 'sequelize';
import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};
  const {
    categoria_id,
    estado,
    search,
    page = 1,
    limit = 10,
  } = filters;

  if (categoria_id) {
    where.categoria_id = categoria_id;
  }

  if (estado) {
    where.estado = estado;
  }

  if (search) {
    where[Op.or] = [
      { titulo: { [Op.like]: `%${search}%` } },
      { contenido: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await models.Noticia.findAndCountAll({
    where,
    include: [
      {
        model: models.Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'slug', 'color'],
      },
      {
        model: models.User,
        as: 'autor',
        attributes: ['id', 'nombre', 'apellido', 'avatar_url'],
      },
    ],
    order: [['fecha_publicacion', 'DESC NULLS LAST']],
    offset,
    limit,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
});

export const getById = handleDbErrors(async (id) => {
  const noticia = await models.Noticia.findByPk(id, {
    include: [
      {
        model: models.Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'slug', 'color'],
      },
      {
        model: models.User,
        as: 'autor',
        attributes: ['id', 'nombre', 'apellido', 'avatar_url'],
      },
    ],
  });

  if (!noticia) {
    throw new NotFoundError('Noticia no encontrada');
  }

  return noticia;
});

export const getBySlug = handleDbErrors(async (slug) => {
  const noticia = await models.Noticia.findOne({
    where: { slug },
    include: [
      {
        model: models.Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'slug', 'color'],
      },
      {
        model: models.User,
        as: 'autor',
        attributes: ['id', 'nombre', 'apellido', 'avatar_url'],
      },
    ],
  });

  if (!noticia) {
    throw new NotFoundError('Noticia no encontrada');
  }

  return noticia;
});

export const create = handleDbErrors(async (data) => {
  const existing = await models.Noticia.findOne({ where: { slug: data.slug } });
  if (existing) {
    throw new ConflictError('Ya existe una noticia con ese slug');
  }

  if (data.categoria_id) {
    const categoria = await models.Categoria.findByPk(data.categoria_id);
    if (!categoria) {
      throw new ConflictError('La categoria especificada no existe');
    }
  }

  if (data.autor_id) {
    const autor = await models.User.findByPk(data.autor_id);
    if (!autor) {
      throw new ConflictError('El autor especificado no existe');
    }
  }

  const noticia = await models.Noticia.create(data);
  return getById(noticia.id);
});

export const update = handleDbErrors(async (id, data) => {
  const noticia = await models.Noticia.findByPk(id);

  if (!noticia) {
    throw new NotFoundError('Noticia no encontrada');
  }

  if (data.slug && data.slug !== noticia.slug) {
    const existing = await models.Noticia.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new ConflictError('Ya existe una noticia con ese slug');
    }
  }

  if (data.categoria_id && data.categoria_id !== noticia.categoria_id) {
    const categoria = await models.Categoria.findByPk(data.categoria_id);
    if (!categoria) {
      throw new ConflictError('La categoria especificada no existe');
    }
  }

  if (data.autor_id && data.autor_id !== noticia.autor_id) {
    const autor = await models.User.findByPk(data.autor_id);
    if (!autor) {
      throw new ConflictError('El autor especificado no existe');
    }
  }

  await noticia.update(data);
  return getById(noticia.id);
});

export const remove = handleDbErrors(async (id) => {
  const noticia = await models.Noticia.findByPk(id);

  if (!noticia) {
    throw new NotFoundError('Noticia no encontrada');
  }

  await noticia.destroy();
  return { message: 'Noticia eliminada exitosamente' };
});
