package me.apollointhehouse

import kotlinx.coroutines.Dispatchers
import me.apollointhehouse.UserService.Users
import me.apollointhehouse.models.Score
import me.apollointhehouse.models.TopScore
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

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
        Scores
            .join(
                Users,
                JoinType.INNER,
                additionalConstraint = { Scores.userId eq Users.id }
            )
            .select(Scores.id, Scores.userId, Scores.score, Users.name, Scores.timestamp)
            .orderBy(Scores.score, order = SortOrder.DESC)
            .limit(20)
            .map { TopScore(it[Scores.score], it[Users.name]) }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
