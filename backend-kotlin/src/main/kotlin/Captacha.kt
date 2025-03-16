package me.apollointhehouse

// Variables
const val CAPTCHA_LENGTH = 12

// Generates captcha
val captcha: String get() =
    (0..CAPTCHA_LENGTH)
        .joinToString("") { chars.random().toString() }
        .also { currCaptcha = it }

private var currCaptcha = ""

// Check whether captcha is right or wrong
fun checkCaptcha(inputCaptcha: String): Boolean = inputCaptcha == currCaptcha
