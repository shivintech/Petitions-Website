const users = require('../controllers/users.controller');

module.exports = function (app) {

    app.route(app.rootUrl +'/users/register')
        .post(users.create);

    app.route(app.rootUrl +'/users/login')
        .post(users.loggingIn);

    app.route(app.rootUrl +'/users/logout')
        .post(users.loggingOut);

    app.route(app.rootUrl +'/users/:userId')
        .patch(users.editingUser)
        .get(users.getUserById);

    app.route(app.rootUrl +'/users/:userId/photo')
        .get(users.getUserPhoto)
        .put(users.insertUserPhoto)
        .delete(users.deletePhoto);
}

