import pool from "../config/config.js";

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

    async getOne(tableName, id) {
        this.validateTableName(tableName);
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
            values.push(value);
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
    // Search
    async search(queryKeys, queryValues, name) {
        const conditions = queryKeys.map((key, i) => `${key} ILIKE $${i + 1}`);
        const sql = `SELECT * FROM ${name} WHERE ${conditions.join(" AND ")}`;
        const values = queryValues.map(value => `%${value}%`);
        const result = await pool.query(sql, values);
        return result;

    }
    // Paginate
    async paginate(tableName, limit, offset) {
        this.validateTableName(tableName);
        const paginated = await pool.query(`Select * from ${tableName} order by id limit $1 offset $2`, [limit, offset]);
        return paginated.rows;

    }

    async checkId(tableName, id) {
        this.validateTableName(tableName);
        const check = await pool.query(`Select * from ${tableName} where id=$1`, [id]);
        return check.rows.length ? check.rows[0] : 404;
    }
}



export const baseClass = new BaseClass();

