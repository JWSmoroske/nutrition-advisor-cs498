import mysql from 'mysql2/promise';

// define the connection to the mysql server
// TOOD: migrate to .env for security
const HOST = 'localhost';
const PORT = 3306;
const USER = 'root';
const PASSWORD = 'Cadmium*Thulium3306';
const DATABASE = 'nutrition_db';
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

// map columnID to correct column of database
const columnMap = {
    0: 'id',    // unused
    1: 'name',
    2: 'calories',
    3: 'fat',
    4: 'cholesterol',
    5: 'sodium',
    6: 'carbohydrate',
    7: 'protein'
}

// insert entity into database
export async function insertEntity(name, calories, fat, cholesterol, sodium, carbohydrate, protein) {
    try {
        // establish & execute query
        const sql = 'INSERT INTO `foods` (`name`, `calories`, `fat`, `cholesterol`, `sodium`, `carbohydrate`, `protein`) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [name, calories, fat, cholesterol, sodium, carbohydrate, protein];
        const [result, fields] = await pool.execute(sql, values);
        
        return result.insertId;
    } catch (error) {
        console.error('Error insterting entity:', error);
        return false;
    }
}

// delete entity from database
export async function deleteEntity(id) {
    try {
        // establish & execute query
        const sql = 'DELETE FROM `foods` WHERE `id` = ?';
        const [result, fields] = await pool.execute(sql, id);
        return true;
    } catch (error) {
        console.error('Error deleting entity:', error);
        return false;
    }
}

// update value of column for entity in database
export async function updateEntity(entityID, columnID, newVal) {
    try {
        // establish & execute query
        const sql = 'UPDATE `foods` SET ? = ? WHERE `id` = ? LIMIT 1';
        const values = [columnMap[columnID], newVal, entityID];
        const [result, fields] = await pool.execute(sql, values);
        return true;
    } catch (error) {
        console.error('Error updating entity:', error);
        return false;
    }
}

// retrieve all entities in database
export async function getAllEntities() {
    try {
        // establish & execute query
        const sql = 'SELECT * FROM `foods`';
        const [rows, fields] = await pool.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error retrieving entities:', error);
        return null;
    }
}