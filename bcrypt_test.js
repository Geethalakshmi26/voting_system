const bcrypt = require('bcryptjs');

const plainTextPassword = "260703";

bcrypt.hash(plainTextPassword, 10).then(hashedPassword => {
    console.log("New Hashed Password:", hashedPassword);

    return bcrypt.compare(plainTextPassword, hashedPassword);
}).then(result => {
    console.log("Password Match Result:", result);
}).catch(err => {
    console.error("Error:", err);
});
