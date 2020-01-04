module.exports = (router, controller) => {
  router.get('/auth/login', controller.login);
  router.get('/auth/register', controller.register);
  router.get('/auth/logout', controller.logout);
  return router;
};
