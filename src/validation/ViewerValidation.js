import * as yup from 'yup'
// Set validation shape to Spectators
const schema = yup.object().shape({
  name: yup.string().required(),
  sure_name: yup.string().required(),
  email: yup.string().email().required(),
})

module.exports = schema
