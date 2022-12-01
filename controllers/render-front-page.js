exports.getFrontPage = (req, res) => {
    const errMsg = req.flash('loginError')
    res.render('pug', { errorMsg: errMsg[0], username: errMsg[1] })
}