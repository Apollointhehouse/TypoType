package me.apollointhehouse

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import me.apollointhehouse.models.PromptText
import java.io.File

// Generates keys based on ASCII
val chars  = 'a'..'z'

// Maps the shuffled keys into the dictionary
val keyMap get() =
    (chars zip chars.shuffled()).toMap()

fun Application.configureRouting() {
    routing {
        configureDatabases()

        // Prompts
        get("/api/prompts") {
            val files = File("$baseDir/prompts").listFiles()
            val file = files.random()
            call.respond(PromptText(file.readText()))
        }

        // Keymap
        get("/api/keymaps") {
            call.respond(keyMap)
        }

        // Captcha
        post("/api/captcha") {
            call.respond(captcha)
        }

        get("/api/captcha") {
            call.respond(checkCaptcha(call.receive()))
        }
    }
}
