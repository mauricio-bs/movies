import Sequelize from 'sequelize'
import configDatabase from '../config/database'
import Movie from '../app/model/Movie'
import Viewer from '../app/model/Viewer'

const models = [Movie, Viewer]

class Database {
  constructor () {
    this.init()
  }

  init () {
    this.connection = new Sequelize(configDatabase)
    models.map(model => model.init(this.connection))
  }
}

export default new Database()
