package me.apollointhehouse.database

import me.apollointhehouse.models.Score
import me.apollointhehouse.models.TopScore
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
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
        val id = userService.getID(score.name)

        Scores.insert { col ->
            col[Scores.userId] = id
            col[Scores.score] = score.score
        }[Scores.id]
    }

    suspend fun getTopScores() = dbQuery {
        Scores
            .join(
                UserService.Users,
                JoinType.INNER,
                additionalConstraint = { Scores.userId eq UserService.Users.id }
            )
            .select(Scores.id, Scores.userId, Scores.score, UserService.Users.name, Scores.timestamp)
            .orderBy(Scores.score, order = SortOrder.DESC)
            .limit(20)
            .map { TopScore(it[Scores.score], it[UserService.Users.name]) }
    }
}