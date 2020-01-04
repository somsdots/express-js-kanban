module.exports =  {
  login: (req, res) => {
    res.render('auth/login',{layout : false});
  },
  register: (req, res) => {
    res.render('auth/register',{layout : false});
  },
  logout: (req, res) => {
    res.redirect('/api/v1/signout');
  }
};
