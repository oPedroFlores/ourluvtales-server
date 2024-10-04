// server.js
const app = require('./app');
const sequelize = require('../db');
const { syncDatabase } = require('./Sync');

const PORT = process.env.SERVER_PORT || 3000;

const startServer = async () => {
  try {
    // Autenticar a conexão com o banco de dados
    await sequelize.authenticate();
    console.log(
      '{SERVER} Conexão com o banco de dados estabelecida com sucesso.',
    );

    // Sincronizar todos os modelos com o banco de dados
    await sequelize.sync(); // Você pode passar { alter: true } se desejar ajustar as tabelas existentes
    console.log('{SERVER} Modelos sincronizados com o banco de dados.');

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`{SERVER} Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      '{SERVER} Erro ao conectar ou sincronizar com o banco de dados:',
      error,
    );
    process.exit(1); // Encerrar o processo com erro
  }
};

// Iniciar o servidor
startServer();
