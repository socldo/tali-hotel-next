import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiUrl } from '../utils/config'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body: { phone: string; password: string }) => {
                return { url: '/api/auth/signin', method: 'post', body }
            }
        }),

        registerUser: builder.mutation({
            query: (body: {
                name: string;
                email: string;
                password: string;
                phone: string;
                role_id: 1
            }) => {
                return { url: '/api/auth/signup', method: 'post', body }
            }
        })
    })
})

export const { useLoginUserMutation, useRegisterUserMutation } = authApi
