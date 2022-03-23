import Sequelize from 'sequelize'
import 'dotenv/config'
import configDatabase from '../config/database'
import Viewer from '../app/model/Viewer'
import Movie from '../app/model/Movie'

// Models array
const models = [Viewer, Movie]
class Database {
  constructor() {
    this.init()
  }

  init() {
    // Connect every model, one at a time
    this.connection = new Sequelize(
      process.env.CLEARDB_DATABASE_URL,
      configDatabase
    )
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

export default new Database()
