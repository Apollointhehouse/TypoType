package me.apollointhehouse

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import me.apollointhehouse.models.Score
import org.jetbrains.exposed.sql.Database

val database = Database.connect(
    url = "jdbc:sqlite:$baseDir/data.db",
    driver = "org.sqlite.JDBC",
)

val userService = UserService(database)
val scoreService = ScoreService(database)

// Sets up routes for API calls to DB
fun Routing.configureDatabases() {
    post("/api/users") {
        val exposedUser = call.receive<ExposedUser>()
        val user = userService.create(exposedUser)
        call.respond(HttpStatusCode.Created, user)
    }

    get("/api/users/{user_id}") {
        val id = call.parameters["user_id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)
        val user = userService.getUser(id)

        call.respond(user ?: HttpStatusCode.NotFound)
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
