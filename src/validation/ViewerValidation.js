import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  sureName: yup.string().required(),
  email: yup.string().email().required()
})

module.exports = schema
