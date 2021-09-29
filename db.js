const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database2', {
    useNewUrlParser: true,

}, (err) => {
    if (!err) {
        console.log("MongoDB Connected...");

    } else {
        console.log("Error",err);
    }
});
module.exports = mongoose