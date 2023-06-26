import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models';

interface AuthState {
  user: IUser | null;
  // Các thuộc tính khác liên quan đến xác thực người dùng
}

const initialState: AuthState = {
    user: null,
    // Khởi tạo các thuộc tính khác
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    // Các reducers khác liên quan đến xác thực người dùng
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;