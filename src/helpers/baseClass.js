import pool from "../config/config.js";
import bcript from "bcrypt"
import validator from "validator"
class BaseClass {
    validateTableName(name) {
        if (!/^[a-z_]+$/i.test(name)) {
            throw new Error("Invalid table name");
        }
    }
    // CREATE
    async create(info, tableName) {
        this.validateTableName(tableName);
        const keys = Object.keys(info);
        const values = Object.values(info);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, values);
        console.log(`${tableName} yaratildi`);
        return result.rows[0];
    }
    // GET_All
    async get(tableName) {
        this.validateTableName(tableName);
        const result = await pool.query(`SELECT * FROM ${tableName}`);
        return result.rows;
    }
    // GET_ONE
    async getOne(tableName, id) {
        this.validateTableName(tableName);
        if (!validator.isUUID(id)) {
            return 400
        }
        const result = await pool.query(`Select * from ${tableName} where id = $1`, [id]);
        return result.rows.length ? result.rows[0] : 404;
    }
    // UPDATE
    async update(id, info, tableName) {
        this.validateTableName(tableName);
        const fields = []
        const values = []
        let idx = 1
        const tableCheck = await pool.query(`Select * from ${tableName} where id = $1;`, [id])
        if (tableCheck.rows.length === 0) {
            return 404
        }
        for (const [key, value] of Object.entries(info)) {
            fields.push(`${key}=$${idx}`);
            if (key === "password") {
                const hashedPassword = await bcript.hash(value, 10);
                values.push(hashedPassword);
            } else {
                values.push(value);
            }
            idx++;
        }
        if (fields.length === 0) {
            return 400
        }
        values.push(id)
        const updatedInfo = await pool.query(`Update ${tableName} SET ${fields.join(", ")} where id = $${idx} Returning *`, values);
        return updatedInfo;
    }

    //DELETE
    async delete(id, tableName) {
        this.validateTableName(tableName);
        const tableCheck = await pool.query(`Select * from ${tableName} where id = $1;`, [id])
        if (tableCheck.rows.length === 0) {
            return 404;
        }
        const deleted = await pool.query(`Delete from ${tableName} where id = $1 RETURNING *;`, [id])
        return deleted.rows[0];
    }
    // Search and paginate
    async searchAndPaginate(searchQuery, tableName, limit, offset) {
        this.validateTableName(tableName);
        const { rows: columns } = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1
  `, [tableName]);
        const conditions = columns.map(c => `${c.column_name}::text ILIKE $1`);
        let sql = `SELECT * FROM ${tableName}`;

        const values = [];
        if (searchQuery) {
            sql += ` WHERE ${conditions.join(" OR ")}`;
            values.push(`%${searchQuery}%`);
        }
        
         if (limit) {
            sql += ` LIMIT $${values.length + 1}`;
            values.push(parseInt(limit, 10));
        }

        if (offset) {
            sql += ` OFFSET $${values.length + 1}`;
            values.push(parseInt(offset, 10));
        }

        const result = await pool.query(sql, values);
        return result.rows;
    }


    async checkId(tableName, id) {
        this.validateTableName(tableName);
        const check = await pool.query(`Select * from ${tableName} where id=$1`, [id]);
        return check.rows.length ? check.rows[0] : 404;
    }

    async isDoublicate(tableName, info) {
        this.validateTableName(tableName);
        const conditions = Object.keys(info).map((k, i) => `LOWER(${k}::text) = LOWER($${i + 1}::text)`).join(" AND ");
        const values = Object.values(info).map(v => String(v).trim());
        const result = await pool.query(`SELECT * FROM ${tableName} WHERE ${conditions}`, values);

        if (result.rows.length === 0) {
            return 404;
        }
        return 409;
    }
}


export const baseClass = new BaseClass();

