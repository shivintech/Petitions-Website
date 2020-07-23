const signatures = require('../controllers/signatures.controller');

module.exports = function (app) {
    app.route(app.rootUrl +'/petitions/:petitionId/signatures')
        .get(signatures.getSignatureByPetitionId)
        .post(signatures.signPetition)
        .delete(signatures.deleteSignature);
}

