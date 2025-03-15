import random

key_map = {
    "a": "",
    "b": "",
    "c": "",
    "d": "",
    "e": "",
    "f": "",
    "g": "",
    "h": "",
    "i": "",
    "j": "",
    "k": "",
    "l": "",
    "m": "",
    "n": "",
    "o": "",
    "p": "",
    "q": "",
    "r": "",
    "s": "",
    "t": "",
    "u": "",
    "v": "",
    "w": "",
    "x": "",
    "y": "",
    "z": "",
}

def get_keymap():
    # Generates keys based on ASCII
    key_list = [chr(i) for i in range(97, 123)]
    random.shuffle(key_list)

    # Maps the shuffled keys into the dictionary
    iteration = 0
    for keys in key_map:
        key_map[keys] = key_list[iteration]
        iteration += 1
    return key_map

# To check the keys and values assignment
 
#for i in key_map:
#    print(f"Key: {i} | Value: {key_map[i]}")
