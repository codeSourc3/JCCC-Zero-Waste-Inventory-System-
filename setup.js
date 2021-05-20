const InternRepository = require('./persistence/intern-repository.js');
const {Intern, Admin} = require('./models/interns.js');
(async function() {
    const defaultAdmin = new Admin(1, 'Default', 'User', 'defaultuser', 'password');
    const repo = await InternRepository.load();
    let rows = await repo.getAll();
    if (rows.length <= 0) {
        // Sheet is empty. Create default admin.
        console.log('Sheet is empty.');
        const result = await repo.add(defaultAdmin);
        console.log(`Default admin created. Username: ${defaultAdmin.username}\nPassword: ${defaultAdmin.password}`);
    }
});