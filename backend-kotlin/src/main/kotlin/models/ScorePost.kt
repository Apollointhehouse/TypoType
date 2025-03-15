package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class ScorePost(val id: Int, val score: Int)