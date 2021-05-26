import mongoose from 'mongoose';

class DataBase {
  constructor() {
    this.mongoDataBase();
  }
  mongoDataBase() {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Conexão com MongoDB realizada com sucesso!');
      })
      .catch((error) => {
        console.log(
          `Erro: Conexão com MongoDB não foi realizada com sucesso: ${error}`
        );
      });
  }
}

export default new DataBase();
