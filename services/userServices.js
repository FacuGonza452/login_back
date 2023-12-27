const UserModel = require('../src/models/userModel');

class UserService {
  async createUser(user) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      return await UserModel.findById(userId);
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      throw error;
    }
  }

  async updateUser(userId, updatedUserData) {
    try {
      return await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      return await UserModel.deleteOne({ _id: userId });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }
}

module.exports = UserService;
