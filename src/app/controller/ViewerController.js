import { v4 } from 'uuid'
import Viewer from '../model/Viewer'
import Movie from '../model/Movie'
import viewerValidate from '../../validation/ViewerValidation'

class ViewerController {
  async index(req, res) {
    // Find all spectators and return as JSON object
    try {
      const specs = await Viewer.findAll({
        include: [
          {
            model: Movie,
            as: 'movies_watched',
            attributes: ['id', 'name', 'spectators_count'],
            through: { attributes: ['id', 'created_at'] },
          },
        ],
      })
      return res.status(200).json(specs)
    } /* Error */ catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async store(req, res) {
    try {
      await (viewerValidate.validateSync(req.body), { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }
    const viewer = req.body

    try {
      const vw = await Viewer.findOne({ where: { email: viewer.email } })
      if (vw) res.status(400).json({ error: 'Email already exists' })
    } catch (err) {
      return res.status(400).json({ error: 'Internal server error' })
    }

    try {
      Viewer.create({
        id: v4(),
        name: viewer.name,
        sure_name: viewer.sure_name,
        email: viewer.email,
        times_watched: viewer.times_watched,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create viewer' })
    }

    return res.status(201).json({ success: 'Viewer created successfully!' })
  }

  async show(req, res) {
    const { id } = req.params

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    try {
      // Find viewer
      const person = await Viewer.findByPk(id, {
        include: [
          {
            model: Movie,
            as: 'movies_watched',
            attributes: ['id', 'name', 'spectators_count'],
            through: { attributes: ['id', 'created_at'] },
          },
        ],
      })
      // Check if viewer exists and return a correct response
      if (!person) throw new Error()

      return res.status(200).json(person)
    } catch (err) {
      return res.status(400).json({ error: 'Viewer not found' })
    }
  }

  async update(req, res) {
    const { movie_id, viewer_id } = req.params // movie ID

    if (!viewer_id || !movie_id) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    const spec = await Viewer.findByPk(viewer_id)
    if (!spec) res.status(400).json({ error: 'Viewer not found' })

    const movie = await Movie.findByPk(movie_id)
    if (!movie) res.status(400).json({ error: 'Movie not found' })
    // Change watched propertie
    spec.times_watched += 1
    movie.spectators_count += 1

    try {
      await spec.addMovies_watched(movie)

      // Update spectator properties
      await Viewer.update(
        { times_watched: spec.times_watched },
        { where: { id: viewer_id } }
      )
      // Update movie properties
      await Movie.update(
        { spectators_count: movie.spectators_count },
        { where: { id: movie_id } }
      )

      return res
        .status(200)
        .json({ succes: `${spec.name + ' ' + spec.sure_name} was updated` })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    // Check if the viewer exists
    try {
      const viewer = await Viewer.findByPk(id, {
        include: [
          {
            model: Movie,
            as: 'movies_watched',
            attributes: ['id', 'name'],
            through: { attributes: ['id', 'created_at'] },
          },
        ],
      })
      if (!viewer) throw new Error()
    } catch (err) {
      return res.status(400).json({ error: 'Viewer not exitst' })
    }

    // Delete the viewer
    try {
      await Viewer.destroy({ where: { id } })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete viewer' })
    }

    return res.status(204).json()
  }
}
export default new ViewerController()
