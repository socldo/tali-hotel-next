import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IHotel } from '../models'
import { RootState } from '../store/store'

import { apiUrl } from '../utils/config'

export const hotelApi = createApi({
    reducerPath: 'hotelApi',
    tagTypes: ['rooms'],
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const user = (getState() as RootState).persistedReducer.auth

            if (user && user.token && endpoint !== 'refresh') {
                headers.set('Authorization', `Bearer ${user.token}`)
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        getHotel: builder.query<IHotel, string>({
            query: (id) => `/hotels/search/${id}`,
            providesTags: ['rooms']
        }),
        getHotels: builder.query<IHotel[], { city?: string; limit?: number; min?: number; max?: number }>({
            query: (arg) => {
                const { city, limit, min, max } = arg
                return {
                    url: '/hotels',
                    params: { city, limit, min, max }
                }
            },
            providesTags: ['rooms']
        }),
        postReview: builder.mutation({
            query: (body: {
                id: string; review: string; score: number
            }) => {
                return { url: '/hotels/review', method: 'post', body }
            },
            invalidatesTags: ['rooms']
        }),
        deleteReview: builder.mutation({
            query: (id) => {
                return { url: `/hotels/review/${id}`, method: 'delete' }
            },
            invalidatesTags: ['rooms']
        }),
        updateReview: builder.mutation({
            query: (body: {
                id: string; review: string
            }) => {
                return { url: `/hotels/review/${body.id}`, method: 'put', body }
            },
            invalidatesTags: ['rooms']
        }),
    })
})

export const { useGetHotelsQuery, useGetHotelQuery, usePostReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } = hotelApi
