import Sequelize from 'sequelize'
import configDatabase from '../config/database'
import Movie from '../app/model/Movie'
import Viewer from '../app/model/Viewer'

// Models array
const models = [Viewer, Movie]
class Database {
  constructor() {
    this.init()
  }

  init() {
    // Connect with every model, one at a time
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()
