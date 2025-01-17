const jwt = require('jsonwebtoken');
const userService = require('../services/user');

module.exports = {
  async auth(request, response) {
    const { username, password } = request.body;

    // Pull user from Database
    const pulledUser = await userService.getUserByUsername({ username });

    //User was not found
    if (!pulledUser) {
      response.status(404).json({ message: 'User not found' });
    }

    // Successful validation
    if (pulledUser.isPasswordValid(password)) {
      const token = jwt.sign({ sub: username }, process.env.SECRET, {
        expiresIn: '7d',
        algorithm: 'HS256',
      });
      response
        .json({
          message: 'Success',
          role: pulledUser.usr_primary_role,
          token,
          user: pulledUser.usr_id,
        })
        .status(200);
    } else {
      response.json({ message: 'Error' }).status(403);
    }
  },
  async show(request, response) {
    const userId = request.params.userId;
    const user = await userService.getUserById(userId);
    return response.json(user);
  },
};
