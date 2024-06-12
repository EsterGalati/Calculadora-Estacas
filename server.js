const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());  // Adiciona o middleware CORS

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Ester67f!',
    database: 'calculadora_banco'
};

let db;

async function connectToDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Conexão estabelecida!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerra o processo em caso de erro na conexão
    }
}

connectToDatabase();

// Middleware para lidar com erros assíncronos
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Rotas para perfis de usuários
app.post('/api/usuarios', asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'INSERT INTO usuarios (name, email, phone) VALUES (?, ?, ?)';
    const [result] = await db.execute(sql, [name, email, phone]);
    res.send({ message: 'Usuário criado com sucesso!', userId: result.insertId });
}));

app.get('/api/usuarios/:id', asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const [result] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [userId]);
    res.send(result);
}));

app.put('/api/usuarios/:id', asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone } = req.body;
    await db.execute('UPDATE usuarios SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, userId]);
    res.send('Detalhes do usuário atualizados com sucesso!');
}));

app.delete('/api/usuarios/:id', asyncHandler(async (req, res) => {
    const userId = req.params.id;
    await db.execute('DELETE FROM usuarios WHERE id = ?', [userId]);
    res.send('Usuário excluído com sucesso!');
}));

// Rotas para histórico
app.post('/api/historico', asyncHandler(async (req, res) => {
    const { userId, tipoSolo, profundidade, nspt, categoriaEstaca, tipoEstaca, diametroEstaca, metodo, R, Rp, Rl } = req.body;
    const sql = 'INSERT INTO historico (user_id, tipoSolo, profundidade, nspt, categoriaEstaca, tipoEstaca, diametroEstaca, metodo, R, Rp, Rl, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await db.execute(sql, [userId, tipoSolo, profundidade, nspt, categoriaEstaca, tipoEstaca, diametroEstaca, metodo, R, Rp, Rl, new Date()]);
    res.send('Histórico salvo com sucesso!');
}));

app.get('/api/historico/:userId', asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const [result] = await db.execute('SELECT * FROM historico WHERE user_id = ?', [userId]);
    res.send(result);
}));

app.delete('/api/historico/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    await db.execute('DELETE FROM historico WHERE id = ?', [id]);
    res.send('Entrada do histórico excluída com sucesso!');
}));

// Rotas para anotações
app.post('/api/anotacoes', asyncHandler(async (req, res) => {
    const { userId, content } = req.body;
    const sql = 'INSERT INTO anotacoes (user_id, content, date) VALUES (?, ?, ?)';
    await db.execute(sql, [userId, content, new Date()]);
    res.send('Anotação salva com sucesso!');
}));

app.get('/api/anotacoes/:userId', asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const [result] = await db.execute('SELECT * FROM anotacoes WHERE user_id = ?', [userId]);
    res.send(result);
}));

app.delete('/api/anotacoes/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    await db.execute('DELETE FROM anotacoes WHERE id = ?', [id]);
    res.send('Anotação excluída com sucesso!');
}));

// Middleware para lidar com erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
