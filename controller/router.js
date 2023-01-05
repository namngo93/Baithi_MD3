const homeHandleRouter = require('./handleRouter/HomehandleRouter')

const router = {
    'home': homeHandleRouter.showHome,
    'create': homeHandleRouter.createHome,
    'delete': homeHandleRouter.deleteProduct,
    'edit': homeHandleRouter.editHome
}
module.exports = router

