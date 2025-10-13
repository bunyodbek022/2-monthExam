import pool from "../config/config.js";

class CRUD {
    // CREATE
    async create(info, tableName) {
        const keys = Object.keys(info);
        const values = Object.values(info);

        const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, values);
        console.log(`${tableName} yaratildi ✅`);
        return result.rows[0];
    }
    // GET
    async get(tableName) {
        const result = await pool.query(`SELECT * FROM $1`, [tableName]);
        return result.rows;
    }
    // UPDATE
    async update(id, info, tableName) {
        const fields = []
        const values = []
        let idx = 1
        const tableCheck = await pool.query(`Select * from ${tableName} where id = $1;`, [id])
        if (tableCheck.rows.length === 0) {
            return 404  // not found
        }
        for (const [key, value] of Object.entries(info)) {
                fields.push(`${key}=$${idx}`);
                values.push(value);
                idx++;
        }
        if (fields.length === 0) {
            return 400 //  message: "No valid fields to update"
        }
        values.push(id)
        const updatedInfo = await pool.query(`Update ${tableName} SET ${fields.join(", ")} where id = $${idx} Returning *`, values);
        return updatedInfo;
    }

    //DELETE
    async delete(id, tableName) {
        const tableCheck = await pool.query(`Select * from ${tableName} where id = $1;`, [id])
        if (tableCheck.rows.length === 0) {
            return 404;
        }
        const deleted = await pool.query(`Delete from ${tableName} where id = $1 RETURNING *;`, [id])
        return deleted;
    }

    async search(queryKeys,queryValues, name ) {
        const conditions = queryKeys.map((key, i) => `${key} ILIKE $${i + 1}`);
        const sql = `SELECT * FROM ${name} WHERE ${conditions.join(" AND ")}`;
        const values = queryValues.map(value => `%${value}%`);
        const result = await pool.query(sql, values);
        return result;

    }

    async paginate(tableName, limit, offset) {
        const paginated = await pool.query(`Select * from $1 order by id limit $2 offset $3`, [tableName, limit, offset]);
        return paginated.rows;

    }
}



export const Crud = new CRUD();

