package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class User(val name: String, val id: Int)
