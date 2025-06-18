package me.apollointhehouse.models

import kotlinx.serialization.Serializable

@Serializable
data class UserResponse(val name: String, val id: Int)
