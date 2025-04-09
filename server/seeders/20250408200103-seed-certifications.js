export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('certifications', [
      {
        name: 'Fire Safety Training',
        description: 'Comprehensive training on handling fire emergencies and extinguishers.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Electrical Safety Certification',
        description: 'Safety measures for working with high-voltage electrical equipment.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Workplace Ergonomics',
        description: 'Training to improve workplace posture and reduce repetitive strain.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('certifications', null, {});
  },
};
