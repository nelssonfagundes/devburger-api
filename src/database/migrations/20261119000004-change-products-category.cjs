/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // a categoria deixa de ser um texto e vira um relacionamento
    await queryInterface.removeColumn('products', 'category')

    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category_id')

    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
    })
  },
}
