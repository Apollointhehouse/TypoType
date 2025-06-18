package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class CaptchaResponse(val success: Boolean)