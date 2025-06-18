package me.apollointhehouse.database

import me.apollointhehouse.models.UserResponse
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class UserService(database: Database) {
    object Users : Table() {
        val id = integer("id").autoIncrement()
        val name = varchar("name", length = 50)

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    suspend fun create(username: String): UserResponse = dbQuery {
        Users
            .insert { it[name] = username }
            .let { UserResponse(it[Users.name], it[Users.id]) }
    }

    suspend fun getUser(id: Int): UserResponse? = dbQuery {
        Users
            .selectAll()
            .where { Users.id eq id }
            .map { UserResponse(it[Users.name], it[Users.id]) }
            .firstOrNull()
    }

    suspend fun getID(name: String): Int = dbQuery {
        Users
            .selectAll()
            .where { Users.name eq name }
            .map { it[Users.id] }
            .first()
    }

    suspend fun getAllUsers(): List<UserResponse> = dbQuery {
        Users
            .selectAll()
            .map { UserResponse(it[Users.name], it[Users.id]) }
    }
}