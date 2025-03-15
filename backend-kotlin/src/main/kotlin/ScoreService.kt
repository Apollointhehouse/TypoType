package me.apollointhehouse

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import me.apollointhehouse.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class ExposedScore(val id: Int, val name: String, val userId: Int, val score: Int, val timestamp: Int)

class ScoreService(database: Database) {
    object Scores : Table() {
        val id = integer("id").autoIncrement()
        val name = varchar("name", length = 50)
        val userId = integer("user_id").references(id)
        val score = integer("score")
        val timestamp = datetime("timestamp")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Scores)
        }
    }

    suspend fun create(score: ScorePost): Int = dbQuery {
        Scores.insert {
            it[userId] = score.id
        }[Scores.id]
    }

    suspend fun getAll(): List<ScoreGet> = dbQuery {
        Scores.selectAll().toList().map { ScoreGet(it[Scores.userId], it[Scores.score]) }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
