<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ prompt: string; input: string }>();

function* createStringGenerator(str: string) {
    for (let char of str) {
        yield char;
    }
}

const generateOutput = computed(() => {
    let categorizedChars: { char: string; class: string }[] = [];
    const inputIterable = createStringGenerator(props.input);
    const promptIterable = createStringGenerator(props.prompt);

    let promptPointer = promptIterable.next();

    // categorize input characters, using prompt characters to validate the categorizations
    for (const inputChar of inputIterable) {
        let promptChar = promptPointer.done ? " " : promptPointer.value;

        if (inputChar === " " && promptChar !== " ") {
            // snap to next word in prompt if user inputs space while a word is incomplete, categorize skipped words as missing
            do {
                categorizedChars.push({ char: promptChar, class: "missing" });

                promptPointer = promptIterable.next();
                promptChar = promptPointer.value;
            } while (!promptPointer.done && promptChar !== " ");

            categorizedChars.push({ char: promptChar, class: "" }); // push terminating " " TODO: make class for whitespace, instead of ""
            promptPointer = promptIterable.next();
        } else if (promptChar === " " && inputChar !== " ") {
            // categorize as extra if user is inputting a word longer than the prompt word
            categorizedChars.push({ char: inputChar, class: "extra" });
        } else if (inputChar.toLowerCase() === promptChar.toLowerCase()) {
            // categorize as correct if the user inputs the right letter
            categorizedChars.push({ char: inputChar, class: "correct" });

            promptPointer = promptIterable.next();
        } else {
            // categorize as incorrect if user inputs the wrong letter
            categorizedChars.push({ char: promptChar, class: "incorrect" });

            promptPointer = promptIterable.next();
        }
    }

    // categorize remaining prompt characters
    while (!promptPointer.done) {
        categorizedChars.push({ char: promptPointer.value, class: "missing" });
        promptPointer = promptIterable.next();
    }

    // categorize characters in incorrect words with "underlined"
    const lastSpaceIndex = props.input.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
        for (let i = 0; i < lastSpaceIndex; i++) {
            if (categorizedChars[i].char !== " " && categorizedChars[i].class !== "correct") {
                categorizedChars[i].class += " underlined";
            }
        }
    }

    // remove duplicate extras -> EXPERIMENTAL
    // let extraCount = 0; // To track consecutive "extra" elements

    // categorizedChars = categorizedChars.filter((categorizedChar, index) => {
    //     if (categorizedChar.class.includes("extra")) {
    //         extraCount++;
    //         // Only include the "extra" if there have been 5 or fewer consecutive extras
    //         if (extraCount <= 7) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         extraCount = 0; // Reset extraCount when a non-"extra" element is encountered
    //         return true; // Always include non-"extra" elements
    //     }
    // });

    console.log(categorizedChars);
    return categorizedChars;
});
</script>

<template>
    <p>{{ props.input }}</p>
    <p>{{ props.prompt }}</p>
    <p>
        <span v-for="(value, index) in generateOutput" :key="index" :class="value.class">
            {{ value.char }}
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
