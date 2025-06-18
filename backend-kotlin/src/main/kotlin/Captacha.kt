package me.apollointhehouse

import me.apollointhehouse.models.CaptchaResponse

const val CAPTCHA_LENGTH = 12

val captcha: String get() =
    (0..CAPTCHA_LENGTH)
        .joinToString("") { chars.random().toString() }

fun checkCaptcha(question: String, answer: String) = CaptchaResponse(question == answer)