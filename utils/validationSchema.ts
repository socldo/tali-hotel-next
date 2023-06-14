import * as yup from 'yup'

export const signInSchema = yup.object().shape({
    phone: yup.string().required().min(10).max(11),
    password: yup.string().required().min(4)

    // .matches(
    //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-8]).{8,}$/,
    //   "Must contain at least 8 characters with one uppercase, one lowercase and one digit"
    // ),
})
export const signUpSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(4),
    password2: yup.string().required().oneOf([yup.ref('password')])

})
