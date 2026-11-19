import bcrypt from 'bcrypt'
import Sequelize, { Model } from 'sequelize'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // não existe no banco, só chega na requisição
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      { sequelize },
    )

    // antes de salvar, transforma a senha em hash
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
