package me.apollointhehouse

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import me.apollointhehouse.models.Score
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Serializable
data class ExposedScore(
    val id: Int,
    val name: String,
    val userId: Int,
    val score: Int,
    val timestamp: String
)

class ScoreService(database: Database) {
    object Scores : Table() {
        val id = integer("id").autoIncrement()
        val userId = integer("user_id").references(id)
        val score = integer("score")
        val timestamp = datetime("timestamp").default(LocalDateTime.now())

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Scores)
        }
    }

    suspend fun create(score: Score): Int = dbQuery {
        Scores.insert { col ->
            col[Scores.userId] = score.id
            col[Scores.score] = score.score
        }[Scores.id]
    }

    suspend fun getTopScores() = dbQuery {
        val formatter = DateTimeFormatter.ofPattern("YYYY-MM-DD HH:MM:SS")

        Scores
            .selectAll()
            .orderBy(Scores.score, order = SortOrder.DESC)
            .limit(20)
            .map {
                listOf(
                    it[Scores.id],
                    it[Scores.userId],
                    it[Scores.score],
                    it[Scores.timestamp].format(formatter)
                ).toJsonElement()
            }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
