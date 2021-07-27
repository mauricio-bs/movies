import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  synopsis: yup.string().required(),
  release: yup.date().required(),
  spectators: yup.number().integer()
})

module.exports = schema
