import Sequelize, { Model } from 'sequelize'

class Movie extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      synopsis: Sequelize.TEXT,
      release: Sequelize.DATEONLY,
      spectators: Sequelize.INTEGER
    },
    {
      sequelize
    })
  }
}

export default Movie
