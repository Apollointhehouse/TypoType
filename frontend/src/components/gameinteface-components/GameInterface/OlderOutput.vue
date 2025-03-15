<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ prompt: string; input: string }>();

function* createStringGenerator(str: string) {
    for (let char of str) {
        yield char;
    }
}

const outputSegments = computed(() => {
    const segments: { char: string; class: string }[] = [];
    const inputIterable = createStringGenerator(props.input);
    const promptIterable = createStringGenerator(props.prompt);

    let lastSpaceIndex = -1;

    let promptPointer = promptIterable.next();

    for (const inputChar of inputIterable) {
        let promptChar = promptPointer.value || " ";

        if (inputChar === " " && promptChar !== " ") {
            do {
                segments.push({ char: promptChar, class: "missing" });

                promptPointer = promptIterable.next();
                promptChar = promptPointer.value || " ";
            } while (!promptPointer.done && promptChar !== " ");

            segments.push({ char: " ", class: "incorrect" });
            promptPointer = promptIterable.next();
        } else if (inputChar.toLowerCase() === promptChar.toLowerCase()) {
            segments.push({ char: inputChar, class: "correct" });

            promptPointer = promptIterable.next();
        } else if (promptChar === " " && inputChar !== " ") {
            segments.push({ char: inputChar, class: "extra" });
        } else {
            segments.push({ char: promptChar || " ", class: "incorrect" });

            promptPointer = promptIterable.next();
        }

        if (segments[segments.length - 1].char === " ") {
            lastSpaceIndex = segments.length - 1;
        }
    }

    // Handle remaining prompt characters after input is exhausted
    while (!promptPointer.done) {
        const promptChar = promptPointer.value || " ";
        segments.push({ char: promptChar, class: "missing" });

        promptPointer = promptIterable.next();
    }

    // Underline incorrect segments before the last space
    if (lastSpaceIndex !== -1) {
        for (let o = 0; o < lastSpaceIndex; o++) {
            if (segments[o].char !== " " && segments[o].class !== "correct") {
                segments[o].class += " underlined";
            }
        }
    }

    return segments;
});
</script>

<template>
    <p>{{ props.input }}</p>
    <p>{{ props.prompt }}</p>
    <p>
        <span v-for="(segment, index) in outputSegments" :key="index" :class="segment.class">
            {{ segment.char }}
        </span>
    </p>
</template>

<style scoped>
.correct {
    color: white;
}

.extra {
    color: lightcoral;
}

.incorrect {
    color: red;
}

.missing {
    color: grey;
}

.underlined {
    text-decoration: underline;
}
</style>
