import Movie from '../model/Movie'
import movieValidator from '../../validation/MovieValidation'

class MovieController {
  async index(req, res) {
    // Search and return all movies of database
    try {
      const movies = await Movie.findAll()
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
    if (!mov.spectators) mov.spectators = 0

    // Await create movie on database
    try {
      await Movie.create({
        name: mov.name,
        synopsis: mov.synopsis,
        spectators: mov.synopsis,
      })
    } catch (err) {
      return res.status(500).json({ error: err.errors })
    }

    // Movie created successfully
    return res.status(201).json({ success: 'Movie created successfully!' })
  }

  async show(req, res) {
    // Check if the movie ID was spended
    if (!req.params)
      res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })

    // Search for movie on database an return it
    try {
      const movie = await Movie.findOne(req.params)
      return res.status(200).json(movie)
    } catch (err) {
      // Error
      return res.status(400).json(err.message)
    }
  }

  async delete(req, res) {
    // Check if the ID param was spended
    if (!req.params)
      res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })

    // Check if the movie exist on datbase
    try {
      await Movie.findByPk(req.params)
    } catch (err) {
      return res.status(400).json({ error: 'Movie not exists' })
    }

    // Delete movie from database
    try {
      await Movie.destroy({ where: { id: req.params } })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Movie deleted successfully
    return res.status(204).json({ success: 'Movie was deleted successfully!' })
  }
}

export default new MovieController()
