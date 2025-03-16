package me.apollointhehouse

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import me.apollointhehouse.models.*
import org.jetbrains.exposed.sql.Database
import java.io.File

val dbLocation: String = if (File("kotlin-backend").exists())
    File("kotlin-backend/data.db").absolutePath
else
    File("data.db").absolutePath

val database = Database.connect(
    url = "jdbc:sqlite:$dbLocation",
    driver = "org.sqlite.JDBC",
)

val userService = UserService(database)
val scoreService = ScoreService(database)

fun Application.configureDatabases() {
    routing {
        post("/api/users") {
            val user = call.receive<ExposedUser>()
            println(user)
            val id = userService.create(user)
            println("id $id")
            call.respond(HttpStatusCode.Created, User(user.name, id))
        }

        post("/api/scores") {
            val score = call.receive<Score>()
            println("Adding score: $score")
            scoreService.create(score)
            call.respond(HttpStatusCode.Created)
        }

        get("/api/scores") {
            call.respond(
                HttpStatusCode.Created,
                scoreService.getTopScores()
            )
        }
    }
}
