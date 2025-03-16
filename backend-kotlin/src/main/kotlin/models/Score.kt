package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class Score(val id: Int, val score: Int)