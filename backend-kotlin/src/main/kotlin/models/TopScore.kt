package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class TopScore(
    val score: Int,
    val name: String
)