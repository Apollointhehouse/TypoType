package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class Score(val name: String, val score: Int)