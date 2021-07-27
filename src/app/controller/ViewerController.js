import Viewer from '../model/Viewer'
import viewerValidate from '../../validation/ViewerValidation'

class ViewerController {
  async index(req, res) {
    // Find all spectators and return as JSON object
    try {
      const specs = await Viewer.findAll()
      return res.status(200).json(specs)
    } /* Error */ catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async store(req, res) {
    // Check if exist body content
    if (!req.body)
      res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })

    const { name, sure_name, email } = req.body
    const viewer = req.body

    // Validate recived data, and get all error detected
    try {
      await viewerValidate.validateSync(viewer, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    try {
      // Check if the email is already registered on database
      const view = await Viewer.findOne({ where: { email } })
      if (view) res.status(400).json({ error: 'Viewer already exists' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Create viewer on database
    try {
      await Viewer.create({ name, sure_name, email })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }

    // Viewer created successfully
    return res.status(201).json({ success: 'Viewer created successfully!' })
  }

  async show(req, res) {
    try {
      const spec = await Viewer.findByPk(req.params)
      return res.status(200).json(spec)
    } catch (err) {
      return res.json({ error: err.errors })
    }
  }

  async update(req, res) {
    try {
      const spec = await Viewer.findByPk(req.params)
      if (!spec) res.status(400).json({ error: 'Viewer not exists' })

      // Change watched propertie
      spec.watched += 1

      await Viewer.update({ watched: spec.watched, where: { id: req.params } })

      return res.status(200)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  async delete(req, res) {
    if (!req.params)
      res
        .status(400)
        .json({ error: 'Make sure you sent all required informations' })

    try {
      await Viewer.destroy({ where: { id: req.params } })
    } catch (err) {
      return res.status(400).json({ error: 'Internal server error' })
    }

    return res.status(204).json({ success: 'Viewer deleted successfully!' })
  }
}
export default new ViewerController()
