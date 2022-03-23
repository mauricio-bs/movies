import Sequelize, { Model } from 'sequelize'

class Viewer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        sure_name: Sequelize.STRING,
        email: Sequelize.STRING,
        times_watched: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
    return this
  }

  static associate(model) {
    this.belongsToMany(model.Movie, {
      through: 'movie_viewer',
      as: 'movies_watched',
      foreignKey: 'viewer_id',
    })
  }
}

export default Viewer
