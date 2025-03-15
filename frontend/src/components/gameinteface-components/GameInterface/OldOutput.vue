<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ prompt: string; input: string }>();

function* stringGenerator(str) {
    for (let char of str) {
        yield char;
    }
}

const outputSegments = computed(() => {
    const segments: { char: string; class: string }[] = [];
    let i = 0;
    let p = 0;
    let lastSpaceIndex = -1;

    for (; i < props.input.length; i++) {
        const inputChar = props.input[i];
        let promptChar = props.prompt[p];

        if (inputChar == " " && promptChar != " ") {
            do {
                segments.push({ char: props.prompt[p], class: "missing" });
                promptChar = props.prompt[p];
                p++;
            } while (promptChar != " " && p < props.prompt.length)
        }
        else if (inputChar.toLowerCase() === promptChar.toLowerCase()) {
            segments.push({ char: inputChar, class: "correct" });
            p++;
        } else if (promptChar === " " && inputChar !== " ") {
            segments.push({ char: inputChar, class: "extra" });

        } else {
            segments.push({ char: promptChar || " ", class: "incorrect" });
            p++;
        }

        if (segments[segments.length - 1].char === " ") {
            lastSpaceIndex = segments.length - 1;
        }
    }

    for (; p < props.prompt.length; p++) {
        segments.push({ char: props.prompt[p], class: "missing" });
    }

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
    <p>{{ input }}</p>
    <p>{{ prompt }}</p>
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
