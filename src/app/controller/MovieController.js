import { v4 } from 'uuid'
import Movie from '../model/Movie'
import movieValidator from '../../validation/MovieValidation'

class MovieController {
  async index(req, res) {
    // Search and return all movies of database
    try {
      const movies = await Movie.findAll()
      if (movies) res.status(200).json(movies)
      else res.status(500).json({ error: 'No data' })
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
    if (!mov.spectators) mov.spectators = 0

    // Checks if movie name exists
    try {
      const movie = await Movie.findOne({ where: { name: mov.name } })
      if (movie) res.status(400).json({ error: 'Movie name already exists' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Await create movie on database
    try {
      await Movie.create({
        id: v4(),
        name: mov.name,
        synopsis: mov.synopsis,
        spectators: mov.spectators,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Movie created successfully
    return res.status(201).json({ success: 'Movie created successfully!' })
  }

  async show(req, res) {
    // Check if the movie ID was spended
    if (!req.params) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    // Search for movie on database an return it
    try {
      const movie = await Movie.findOne(req.params)
      if (movie) res.status(200).json(movie)
    } catch (err) {
      // Error
      return res.status(400).json(err.message)
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
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Movie deleted successfully
    return res.status(204).json({ success: 'Movie was deleted successfully!' })
  }
}

export default new MovieController()
