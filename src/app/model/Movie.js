import Sequelize, { Model } from 'sequelize'

class Movie extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        synopsis: Sequelize.TEXT,
        spectators_count: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
    return this
  }

  static associate(model) {
    this.belongsToMany(model.Viewer, {
      through: 'movie_viewer',
      as: 'spectators',
      foreignKey: 'movie_id',
    })
  }
}

export default Movie
