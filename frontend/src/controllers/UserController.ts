import { BaseController } from './BaseController';
import { UserModel } from '../models/UserModel';
import { useAuthStore } from '../contexts/authStore'; // Asumsikan ini store untuk mendapatkan data user
import { BASE_API_URL } from '../configs/constants';

class UserController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/users`); // Sesuaikan base URL API untuk users
  }

  // Mendapatkan daftar film dengan pagination
  public async getUsers(page: number = 1, searchTerm?: string, user?: string) {
    const params = { page, searchTerm, user };
    return this.get<UserModel[]>('/', params);
  }

  // Mendapatkan detail film berdasarkan ID
  public async getUserById(id: number) {
    return this.get<UserModel>(`/${id}`);
  }

  // Menambah film baru
  public async addUser(user: UserModel) {
    return this.post<UserModel>('/', user);
  }

  // Mengubah data film, hanya untuk admin
  public async updateUser(id: number, newUser: UserModel) {
    const { user } = useAuthStore.getState();
    return this.put<UserModel>(`/${id}`, newUser, user!.role!.toString());
  }
  
  // Menghapus film berdasarkan ID, hanya untuk admin
  public async deleteUser(id: number) {
    const { user } = useAuthStore.getState();
    return this.delete<void>(`/${id}`, user!.role!.toString());
  }
}

const userController = new UserController();
export default userController;
