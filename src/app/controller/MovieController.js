import { v4 } from 'uuid'
import Movie from '../model/Movie'
import movieValidator from '../../validation/MovieValidation'
import Viewer from '../model/Viewer'

class MovieController {
  async index(req, res) {
    // Search and return all movies of database
    try {
      const movies = await Movie.findAll({
        include: [
          {
            model: Viewer,
            as: 'spectators',
            attributes: ['id', 'name', 'sure_name', 'times_watched'],
            through: { attributes: ['id', 'created_at'] },
          },
        ],
      })
      return res.status(200).json(movies)
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async store(req, res) {
    // Validate recived data
    try {
      await movieValidator.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const mov = req.body
    if (!mov.spectators_count) mov.spectators_count = 0

    // Checks if movie name exists
    try {
      const movie = await Movie.findOne({ where: { name: mov.name } })
      if (movie) throw new Error()
    } catch (err) {
      return res.status(400).json({ error: 'Movie name already exists' })
    }

    // Await create movie on database
    try {
      await Movie.create({
        id: v4(),
        name: mov.name,
        synopsis: mov.synopsis,
        spectators_count: mov.spectators_count,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create the movie' })
    }

    // Movie created successfully
    return res.status(201).json({ success: 'Movie created successfully!' })
  }

  async show(req, res) {
    const { id } = req.params
    // Check if the movie ID was spended
    if (!id) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    // Search for movie on database an return it
    try {
      const movie = await Movie.findByPk(id, {
        include: [
          {
            model: Viewer,
            as: 'spectators',
            attributes: ['id', 'name', 'sure_name', 'times_watched'],
            through: { attributes: ['id', 'created_at'] },
          },
        ],
      })
      if (!movie) throw new Error()

      return res.status(200).json(movie)
    } catch (err) {
      // Error
      return res.status(400).json({ error: 'Movie not found' })
    }
  }

  async delete(req, res) {
    const { id } = req.params
    // Check if the ID param was spended
    if (!id) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    // Check if the movie exist on datbase
    try {
      await Movie.findByPk(id)
    } catch (err) {
      return res.status(400).json({ error: 'Movie not exists' })
    }

    // Delete movie from database
    try {
      await Movie.destroy({ where: { id } })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete movie' })
    }

    // Movie deleted successfully
    return res.status(204).json()
  }
}

export default new MovieController()
