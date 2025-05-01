const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));


app.get('/clients', async (req, res) => {
    const [rows] = await db.query('select * from clients');
    res.json(rows);
});

app.post('/clients', async (req, res) => {
    const {nom, prenom, email} = req.body;
    const [result] = await db.query('insert into clients set ?', {nom, prenom, email});
    res.json({id: result.insertId});
});

app.get('/clients/search', async (req, res) => {
    const term = `%${req.query.term}%`;
    const [rows] = await db.query('select * from clients where nom like ? or prenom like ? or email like ?', [term, term, term]);
    res.json(rows);
});

app.get('/produits', async (req, res) => {
    const [rows] = await db.query('select * from produits');
    res.json(rows);
});

app.post('/produits', async (req, res) => {
    const {nom, prix, stock} = req.body;
    const [result] = await db.query('insert into produits set ?', {nom, prix, stock});
    res.json({id: result.insertId});
});

app.get('/produits/search', async (req, res) => {
    const term = `%${req.query.term}%`;
    const [rows] = await db.query('select * from produits where nom like ? or description like ?', [term, term]);
    res.json(rows);
});

app.get('/commandes', async (req, res) => {
    const [rows] = await db.query(`
        select c.id, cl.nom as client_nom, p.nom as produit_nom, c.date_commande 
        from commandes c
        join clients cl on c.client_id = cl.id
        join produits p on c.produit_id = p.id
    `);
    res.json(rows);
});

app.post('/commandes', async (req, res) => {
    const {client_id, produit_id} = req.body;
    const [result] = await db.query('insert into commandes set ?', {
        client_id,
        produit_id,
        date_commande: new Date()
    });
    res.json({id: result.insertId});
});

app.get('/commandes/search', async (req, res) => {
    const term = `%${req.query.term}%`;
    const [rows] = await db.query(`
        select c.id, cl.nom as client_nom, p.nom as produit_nom 
        from commandes c
        join clients cl on c.client_id = cl.id
        join produits p on c.produit_id = p.id
        where cl.nom like ? or p.nom like ?
    `, [term, term]);
    res.json(rows);
});
app.delete('/clients/:id', async (req, res) => {
    try {
        await db.query('delete from clients where id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

app.delete('/produits/:id', async (req, res) => {
    try {
        await db.query('delete from produits where id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

app.delete('/commandes/:id', async (req, res) => {
    try {
        await db.query('delete from commandes where id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});
app.listen(3000, () => console.log('Serveur démarré'));