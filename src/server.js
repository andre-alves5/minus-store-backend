import app from './app';

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta 8080: http://localhost:${process.env.PORT}`
  );
});
