package me.apollointhehouse

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.receive
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

// Generates keys based on ASCII
val chars  = 'a'..'z'

// Maps the shuffled keys into the dictionary
val keyMap get() =
    (chars zip chars.shuffled()).toMap()

fun Application.configureRouting() {
    routing {
        get("/api/prompts") {
            val files = File("backend-kotlin/prompts").listFiles()
            val file = files.random()
            call.respondText(file.readText(), status = HttpStatusCode.OK)
        }

        get("/api/keymaps") {
            call.respond(keyMap)
        }

        post("/api/captcha") {
            call.respond(captcha)
        }

        get("/api/captcha") {
            call.respond(checkCaptcha(call.receive()))
        }
    }
}
