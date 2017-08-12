import Sequelize from 'sequelize';

const sequelize = new Sequelize('graphql', 'graphql_admin', 'graphql_pass', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = {
  User: sequelize.import('./user'),
};

db.sequelize = sequelize;

export default db;
