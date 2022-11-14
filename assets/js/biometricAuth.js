router.post('/setOwnIDDataByLoginId', async (req, res) => {
    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const ownIdData = req.body.ownIdData; //OwnID authentication information as string
    const user = await User.findOne({ email: email }).exec();
    user.ownIdData = ownIdData;
    await user.save();
    return res.sendStatus(204);
});

router.post('/getOwnIDDataByLoginId', async (req, res) => {
    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const user = await User.findOne({ email: email }).exec();
    if (!user) { return res.json({ errorCode: 404 }) } //Error code when user doesn't exist
    res.json({ ownIdData: user.ownIdData }) //OwnID authentication information as string
});

router.post('/getSessionByLoginId', async (req, res) => {
    const sign = require('jwt-encode');

    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const user = await User.findOne({ email: email }).exec();
    const jwt = sign({ email: user.email }, 'secret');
    return res.json({ token: jwt });
});

module.exports();