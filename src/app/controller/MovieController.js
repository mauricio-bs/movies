import Movie from '../database/model/Movie'
import movieValidator from '../validation/MovieValidation'

class MovieController {
  async index (req, res) {
    // Search and return all movies of database
    const movies = await Movie.find()
    return res.status(200).json(movies)
  }

  async store (req, res) {
    const mov = req.body

    // Check if exist body content
    if (!mov) res.status(400).json({ error: 'Make sure you sent all required informations' })

    try {
      await movieValidator.validateSync(mov, { abortEarly: false }) // Validate recived data, and get all error detected
      await Movie.save(mov) // Await create movie on database
    } catch (err) {
      return res.status(400).json({ error: err.errors }) // Error, return error message
    }
    // Movie created successfully
    return res.status(201).json({ success: 'Movie created successfully!' })
  }

  async show (req, res) {
    const id = req.params
    // Check if the movie ID was spended
    if (!id) res.status(400).json({ error: 'Make sure you sent all required informations' })

    // Search for movie on database an return it
    try {
      const movie = await Movie.findOne(id)
      return res.status(200).json(movie)
    } catch (err) { // Error
      return res.status(400).json(err.errors)
    }
  }

  async update (req, res) {

  }

  async delete (req, res) {
    // Check if the ID param was spended
    if (!req.params) res.status(400).json({ error: 'Make sure you sent all required informations' })

    // Delete movie from database
    try {
      await Movie.findByIdAndDelete(req.params)
    } catch (err) {
      // Error
      return res.status(500).json({ error: 'Internal server error' })
    }
    // Movie deleted successfully
    return res.status(204).json({ success: 'Movie was deleted successfully!' })
  }
}

export default new MovieController()
