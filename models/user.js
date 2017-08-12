export default (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  return user;
};
