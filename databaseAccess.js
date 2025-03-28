import mysql from 'mysql2/promise';

// define the connection to the mysql server
const HOST = 'localhost';
const PORT = 0;
const USER = 'root';
const PASSWORD = '';
const DATABASE = '';
const CONNECTION_LIMIT = 5;
const QUEUE_LIMIT = 0;

// establish connection
const pool = mysql.createPool({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: CONNECTION_LIMIT,
    queueLimit: QUEUE_LIMIT,
})

// insert entity into database
export async function insertEntity(name, fat, cholesterol, sodium, carbohydrate, protein) {
    try {
        // establish query
        const sql = 'INSERT INTO foods (name, fat, cholesterol, sodium, carbohydrate, protein) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, fat, cholesterol, sodium, carbohydrate, protein];
        // execute query
        const [result] = await pool.execute(sql, values);
        
        // TODO: return ID of inserted entity
    } catch (error) {
        console.error('Error insterting entity:', error);
    }
}

// delete entity from database
export async function deleteEntity(id) {
    try {
        // establish & execute query
        const sql = 'DELETE FROM foods WHERE id = ?';
        const [result] = await pool.execute(sql, id);
    } catch (error) {
        console.error('Error deleting entity:', error);
    }
}

// retrieve all entities in database
export async function getAllEntities() {
    try {
        // establish & execute query
        const sql = 'SELECT * FROM foods';
        const [rows] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error retrieving entities:', error);
    }
}