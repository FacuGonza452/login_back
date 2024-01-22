const UserModel = require('../src/models/userModel');

class UserService {
  async registerUser(user) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.error('Error al obtener el usuario por correo electrónico:', error);
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
