<template>
    <div>
        <h1>CAPTCHA Verification</h1>
        <div class="captcha-box">
            <!-- Render CAPTCHA question -->
            <div v-html="captchaQuestion"></div>
            <input type="text" v-model="userAnswer" placeholder="Enter your answer" />
        </div>
        <button @click="submitCaptcha">Submit</button>
        <div v-if="captchaVerified" class="captcha-success">CAPTCHA Verified!</div>
        <div v-if="captchaError" class="captcha-error">Invalid CAPTCHA. Please try again.</div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        // Reactive state variables using ref
        const captchaQuestion = ref('');
        const userAnswer = ref('');
        const captchaVerified = ref(false);
        const captchaError = ref(false);

        // Fetch CAPTCHA question from the backend
        const fetchCaptcha = async () => {
            const response = await fetch('http://localhost:5000/api/captcha');
            console.log(response)
            captchaQuestion.value = await response.text(); // Store question in reactive state
        };

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
                    body: `userAnswer=${encodeURIComponent(userAnswer.value)}`, // Send plain text data
                });
                const data = await response.text();
                console.log(data)

                if (data.success) {
                    console.log(true)
                    captchaVerified.value = true;
                    captchaError.value = false;
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

        // Return the state and methods to the template
        return {
            captchaQuestion,
            userAnswer,
            captchaVerified,
            captchaError,
            submitCaptcha,
        };
    },
};
</script>

<style scoped>
.captcha-success {
    color: green;
}

.captcha-error {
    color: red;
}

.captcha-box {
    margin-top: 20px;
}

.captcha-box {
  margin-bottom: 20px; /* Increased margin for the CAPTCHA box */
}

button {
  margin-bottom: 20px; /* Increased margin for the submit button */
}

.captcha-success {
  margin-top: 20px; /* Increased margin for success message */
}
</style>