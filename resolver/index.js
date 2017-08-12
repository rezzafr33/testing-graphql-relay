const root = {
  allUsers: async (_, { models }) => models.User.findAll(),
  getUser: async ({ username }, { models }) => models.User.findOne({
    where: {
      username,
    },
  }),
  createUser: async (args, { models }) => models.User.create(args),
  deleteUser: async ({ username }, { models }) => models.User.destroy({
    where: {
      username,
    },
  }),
};

export default root;
