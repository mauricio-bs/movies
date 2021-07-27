import Viewer from '../database/model/Viewer'
import viewerValidate from '../validation/ViewerValidation'

class ViewerController {
  async index (req, res) {
    // Find all spectators and return as JSON object
    try {
      const specs = await Viewer.find()
      return res.status(200).json(specs)
    } /* Error */ catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async store (req, res) {
    const viewer = req.body
    // Check if exist body content
    if (!viewer) res.status(400).json({ error: 'Make sure you sent all required informations' })

    // Validate recived data, and get all error detected
    try {
      await viewerValidate.validateSync(viewer, { abortEarly: false })
    } /* Error */ catch (err) {
      return res.status(400).json({ error: err.errors })
    }
    // Check if the email is already registered on database
    const viewerExists = Viewer.findOne(viewer.email)
    // Viewer already registered, error status with json message
    if (viewerExists) res.status(400).json({ error: 'Viewer already exists' })

    try {
      // Await create viewer on database
      await Viewer.save(viewer)
    } catch (err) {
      // Error, viewer not created
      return res.status(500).json({ error: err.message })
    }
    // Viewer created successfully
    return res.status(201).json({ success: 'Viewer created successfully!' })
  }

  async show (req, res) {
    const id = req.params
    try {
      const spec = await Viewer.findById(id)
      return res.status(200).json(spec)
    } catch (err) {
      return res.json({ error: err.errors })
    }
  }

  async update (req, res) {
    const id = req.params

    try {
      const spec = await Viewer.findOne(id)

      if (!spec) res.status(400).json({ error: 'Viewer not exists' })

      // Create changes of spector
      spec.watched += 1

      Viewer.save(spec)
      return res.status(200)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  }

  async delete (req, res) {
    const id = req.params

    if (!id) res.status(400).json({ error: 'Make sure you sent the viewer' })

    try {
      await Viewer.findByIdAndDelete(id)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
    return res.status(204).json({ success: 'Viewer deleted successfully!' })
  }
}

export default new ViewerController()
