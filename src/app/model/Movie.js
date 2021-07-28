import Sequelize, { Model } from 'sequelize'

class Movie extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        synopsis: Sequelize.TEXT,
        spectators: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
  }
}

export default Movie
