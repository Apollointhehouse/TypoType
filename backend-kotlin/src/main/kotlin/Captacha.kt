package me.apollointhehouse

// Variables
const val CAPTCHA_LENGTH = 12

// Generates captcha
fun generate_captcha(): String =
    (0..CAPTCHA_LENGTH).joinToString("") { chars.random().toString() }

// Check whether captcha is right or wrong
//fun checkCaptcha(inputCaptcha: String): Boolean = inputCaptcha == captchaString
