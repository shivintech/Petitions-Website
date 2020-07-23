const petitions = require('../controllers/petitions.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions')
       // .get(petitions.list)
        .get(petitions.getAllPetitions)
        .post(petitions.insertPetitions);

    app.route(app.rootUrl +'/petitions/categories')
        .get(petitions.getCategory)

    app.route(app.rootUrl +'/petitions/categories')
        .get(petitions.getCategory)
    //.put(petitions.insertPetitionPhoto)

    app.route(app.rootUrl +'/petitions/:petitionId')
        .patch(petitions.editPetition)
        .get(petitions.getDetailPetition)
        .delete(petitions.deletePetition)

    //.put(petitions.insertPetitionPhoto)
    app.route(app.rootUrl +'/petitions/:petitionId/photo')
        .get(petitions.getPetitionPhoto)
        .put(petitions.insertPetitionPhoto)
       // .delete(users.deletePhoto);


}

