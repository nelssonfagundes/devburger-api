// Configuração do banco usada pelo Sequelize (app e migrations)
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'devburger',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
