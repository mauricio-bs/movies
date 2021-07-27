import Sequelize, { Model } from 'sequelize'

class Viewer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        sure_name: Sequelize.STRING,
        email: Sequelize.STRING,
        watched: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
  }
}

export default Viewer
