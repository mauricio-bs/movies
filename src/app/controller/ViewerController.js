import { v4 } from 'uuid'
import Viewer from '../model/Viewer'
import Movie from '../model/Movie'
import viewerValidate from '../../validation/ViewerValidation'

class ViewerController {
  async index(req, res) {
    // Find all spectators and return as JSON object
    try {
      const specs = await Viewer.findAll()
      if (specs) res.status(200).json(specs)
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
        watched: viewer.watched,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
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
      const person = await Viewer.findByPk(id)
      // Check if viewer exists and return a correct response
      if (!person) res.status(400).json({ error: 'Viewer not exists' })
      else res.status(200).json(person)
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async update(req, res) {
    const { id } = req.params // movie ID
    const { viewer_id } = req.body

    if (!viewer_id || !id) {
      return res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })
    }

    try {
      const spec = await Viewer.findByPk(viewer_id)
      if (!spec) res.status(400).json({ error: 'Viewer not exists' })

      const movie = await Movie.findByPk(id)
      if (!movie) res.status(400).json({ error: 'Movie not exists' })
      // Change watched propertie
      spec.watched += 1
      movie.spectators += 1

      // Update spectator properties
      await Viewer.update(
        { watched: spec.watched },
        { where: { id: viewer_id } }
      )
      // Update movie properties
      await Movie.update({ spectators: movie.spectators }, { where: { id } })

      return res.status(200).json({ succes: `${viewer_id} was updated` })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    // Check if the viewer exists
    try {
      const viewer = await Viewer.findByPk(id)
      if (!viewer) res.status(400).json({ error: 'Viewer not exitst' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Delete the viewer
    try {
      await Viewer.destroy({ where: { id } })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    return res.status(204).json()
  }
}
export default new ViewerController()
