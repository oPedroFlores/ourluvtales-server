// sync.js
const database = require('../db');
const models = require('./DataModels');

const syncDatabase = async () => {
  try {
    await database.authenticate();
    console.log(
      '{SYNC} Conexão com o banco de dados estabelecida com sucesso.',
    );

    // Sincronizar todos os modelos
    await database.sync({ alter: true }); // Use { force: true } para redefinir as tabelas
    console.log(
      '{SYNC} Todos os modelos foram sincronizados com o banco de dados.',
    );
  } catch (error) {
    console.error(
      '{SYNC} Erro ao conectar ou sincronizar com o banco de dados:',
      error,
    );
  } finally {
    await database.close();
  }
};

module.exports = syncDatabase;
