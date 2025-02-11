// src/migrations/add-project-id-to-tasks.migration.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('tasks', 'projectId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('tasks', 'projectId');
}