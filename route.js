// This file is an example, it's not functionally used by the module.

// Sets up the routes.
module.exports.setup = function (app) {
    /**
     * @swagger
     * /:
     *   post:
     *     description: Salva a mensagem no corpo do arquivo index.html
     *     responses:
     *       200:
     *         description: 'OK'
     */

    /**
     * @swagger
     * /scheduled:
     *   post:
     *     description: Salva a mensagem de scheduled no corpo do arquivo index.html
     *     responses:
     *       200:
     *         description: hello world
     */

    /**
     * @swagger
     * /:
     *   get:
     *     description: Retorna index.html
     *     responses:
     *       200:
     *         description: index.html
     */

    /**
     * @swagger
     * /openapi:
     *   post:
     *     description: Retorna os endpoints da aplicação
     *     responses:
     *       200:
     *         description: Retorna endpoints
     */
};
