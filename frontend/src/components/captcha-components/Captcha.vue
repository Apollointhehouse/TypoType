<template>
    <div class="flex flex-col items-center justify-center min-h-screen font-sans">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6">CAPTCHA Verification</h1>

        <div class="bg-white p-8 rounded-lg shadow-lg mb-6 w-80 comic-sans">
            <!-- Render CAPTCHA image -->
            <img :src="captchaImageUrl" :alt="captchaQuestion"
                class="w-full max-w-xs mx-auto mb-6 border-2 border-gray-300 rounded-md" />
            <!-- User input field for CAPTCHA -->
            <input type="text" v-model="userAnswer" placeholder="Enter your answer"
                class="w-full p-3 text-lg border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Loading icon, visible only when isLoading is true -->
        <div v-if="isLoading" class="loading">Loading<span>.</span><span>.</span><span>.</span><span>.</span><span>.</span></div>

        <button @click="submitCaptcha"
            class="w-48 p-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">Submit</button>

        <div v-if="captchaError" class="text-red-600 font-bold mt-4">Invalid CAPTCHA. Please try again.</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


// Reactive state variables using ref
const captchaQuestion = ref(' ');
const userAnswer = ref('');
const captchaError = ref(false);
const isLoading = ref(false);
const captchaImageUrl = ref('') // To remove console warnings

// Fetch CAPTCHA question from the backend
const fetchCaptcha = async () => {
    const response = await fetch('http://localhost:5000/api/captcha');

    captchaQuestion.value = await response.text() // Store question in reactive state
}

// Submit CAPTCHA answer to backend for validation
const submitCaptcha = async () => {
    if (!userAnswer.value) {
        alert('Please answer the CAPTCHA question!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/captcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Change the content type
            },
            body: `userAnswer=${encodeURIComponent(userAnswer.value)}&captchaQuestion=${encodeURIComponent(captchaQuestion.value)}`, // Send plain text data
        });
        const data = await response.json();

        if (data.success) {
            captchaError.value = false;

            isLoading.value = true;
            // Redirect to the success page using Vue Router
            setTimeout(() => {
                isLoading.value = false;
                router.push('/');
            }, 20000);
        } else {
            captchaError.value = true;
        }
    } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        captchaError.value = true;
    }
};

// Fetch CAPTCHA question when component mounts
onMounted(() => {
    fetchCaptcha();
});


</script>

<style scoped>
.loading {
font-size: 20px;
font-family: Arial, sans-serif;
display: inline-block;
}

.loading span {
animation: dots 1.5s infinite;
}

.loading span:nth-child(1) {
animation-delay: 0s;
}

.loading span:nth-child(2) {
animation-delay: 0.25s;
}

.loading span:nth-child(3) {
animation-delay: 0.5s;
}

.loading span:nth-child(4) {
animation-delay: 0.75s;
}

.loading span:nth-child(5) {
animation-delay: 1s;
}

@keyframes dots {
0% {
    opacity: 0;
}
50% {
    opacity: 1;
}
100% {
    opacity: 0;
}
}

.captcha-box img {
    margin: 10px;
}

.captcha-error {
    color: red;
}

.captcha-box {
    margin-bottom: 20px;
}

button {
    margin-bottom: 20px;
}

.captcha-success {
    margin-bottom: 20px;
}
</style>