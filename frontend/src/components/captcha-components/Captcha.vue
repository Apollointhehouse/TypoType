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
const captchaVerified = ref(false);
const captchaError = ref(false);

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
            console.log(true)
            captchaVerified.value = true;
            captchaError.value = false;

            // Redirect to the success page using Vue Router
            router.push('/');
        } else {
            console.log(false)
            captchaVerified.value = false;
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