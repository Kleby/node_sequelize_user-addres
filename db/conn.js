const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'sequelize',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

// try {
//     sequelize.authenticate();
//     console.log('Conectado ao banco com sucesso!');

// } catch (error) {
//     console.log('Não foi possível conectar ao banco '+ error);
// }

module.exports = sequelize;