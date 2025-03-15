import random

key_map = {}

def get_keymap():
    # Generates keys based on ASCII
    key_list = [chr(i) for i in range(97, 123)]

    # Generates the dictionary
    for v in key_list:
        key_map[v] = ""

    # Shuffles the alphabet for dictionary values
    random.shuffle(key_list)

    # Maps the shuffled keys into the dictionary
    iteration = 0
    for keys in key_map:
        key_map[keys] = key_list[iteration]
        iteration += 1
    return key_map


# To check the keys and values assignment
get_keymap()
for i in key_map:
    print(f"Key: {i} | Value: {key_map[i]}")
