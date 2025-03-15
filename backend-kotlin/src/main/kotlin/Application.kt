package me.apollointhehouse

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*

fun main(args: Array<String>) {
    embeddedServer(Netty, port = 5000) {
        routing {
            module()
        }
    }.start(wait = true)
}

fun Application.module() {
    configureHTTP()
    configureRouting()
    configureDatabases()
}
