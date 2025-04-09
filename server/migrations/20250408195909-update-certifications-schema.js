export default {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('certifications', 'expires'),
      queryInterface.addColumn('certifications', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('certifications', 'expires', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.removeColumn('certifications', 'description'),
    ]);
  },
};
