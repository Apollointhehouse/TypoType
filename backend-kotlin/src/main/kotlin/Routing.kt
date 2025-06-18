package me.apollointhehouse

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import me.apollointhehouse.database.dbRouting
import me.apollointhehouse.models.PromptText
import java.io.File

// Generates keys based on ASCII
val chars  = 'a'..'z'

// Maps the shuffled keys into the dictionary
val keyMap get() =
    (chars zip chars.shuffled()).toMap()

fun Application.configureRouting() {
    routing {
        dbRouting()

        get("/api/prompts") {
            val files = File("$baseDir/prompts").listFiles()
            val file = files.random()
            call.respond(PromptText(file.readText()))
        }

        get("/api/keymaps") {
            call.respond(keyMap)
        }

        get("/api/captcha") {
            call.respond(captcha)
        }

        post("/api/captcha") {
            val params = call.receiveParameters()

            val captchaQuestion: String by params
            val userAnswer: String by params

            call.respond(checkCaptcha(captchaQuestion, userAnswer))
        }
    }
}
