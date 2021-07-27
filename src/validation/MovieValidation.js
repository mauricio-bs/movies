import * as yup from 'yup'
// Set validation shape to Movies
const schema = yup.object().shape({
  name: yup.string().required(),
  synopsis: yup.string().required(),
  spectators: yup.number().integer()
})

module.exports = schema
