require('dotenv/config')
// Database configurations
module.exports = {
  dialect: 'mysql',
  uri: process.env.CLEARDB_DATABASE_URL,
  // host: process.env.DB_HOST,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
