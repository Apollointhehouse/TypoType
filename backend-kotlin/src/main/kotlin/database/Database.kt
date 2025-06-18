package me.apollointhehouse.database

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.getValue
import kotlinx.coroutines.Dispatchers
import me.apollointhehouse.baseDir
import me.apollointhehouse.models.Score
import me.apollointhehouse.models.RegisterUser
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

val database = Database.connect(
    url = "jdbc:sqlite:${baseDir}/data.db",
    driver = "org.sqlite.JDBC",
)

val userService = UserService(database)
val scoreService = ScoreService(database)

suspend fun <T> dbQuery(block: suspend () -> T): T =
    newSuspendedTransaction(Dispatchers.IO, database) { block() }

// Sets up routes for API calls to DB
fun Routing.dbRouting() {
    post("/api/users") {
        val register = call.receive<RegisterUser>()
        val user = userService.create(register.name)
        call.respond(HttpStatusCode.Created, user)
    }

    get("/api/users/{user_id}") {
        val id: Int by call.parameters

        val user = userService.getUser(id) ?: return@get call.respond(
            status = HttpStatusCode.NotFound,
            message = "User not found"
        )

        call.respond(user)
    }

    get("/api/users") {
        val users = userService.getAllUsers()
        call.respond(users)
    }

    post("/api/scores") {
        val score = call.receive<Score>()

        println("Adding score: $score")
        scoreService.create(score)
        call.respond(HttpStatusCode.Created, score)
    }

    get("/api/scores") {
        call.respond(
            HttpStatusCode.Created,
            scoreService.getTopScores()
        )
    }
}
