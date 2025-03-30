package me.apollointhehouse

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import java.io.File

val baseDir: String = File("backend-kotlin")
    .takeIf { it.exists() }
    ?.absolutePath
    ?: File(".").absolutePath

fun main() {
    embeddedServer(Netty, port = 5000) {
        routing {
            module()
        }
    }.start(wait = true)
}

fun Application.module() {
    configureHTTP()
    configureRouting()
}
