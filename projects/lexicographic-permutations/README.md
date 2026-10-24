# Lexicographic permutations: recursion and backtracking

A small algorithm exercise demonstrating character-index tracking with a bitmask, recursive generation, and the critical backtracking step that clears a used bit after returning from recursion.

## Files

- `permutations.c`: the C programming exercise with **exactly one added line** inside the recursive search, `bitmask &= ~(1 << i);`.
- `sample-output.txt`: verified output for the supplied seven-character input `bcehitz`, containing 5,040 lexicographically sorted lines.
- Portfolio demo: `/permutations-demo`, using an independently written JavaScript implementation for browser interactivity.

## Run locally

```sh
gcc -std=gnu89 -o permutations permutations.c
printf 'bcehitz\n' | ./permutations > output.txt
cmp output.txt sample-output.txt
```

The C source intentionally retains the exercise's original style and structure to show the single-line fix. The legacy `main()` declaration and unused local variables produce compiler warnings with `-Wall -Wextra`; they were not changed because this example is specifically about a one-line debugging correction. The single-line user-supplied input is not production data.

The exercise material is shown as a debugging illustration, not represented as an independently devised challenge or as client work. For duplicate input characters, the positional algorithm outputs repeated strings because it permutes character indices. There are at most 7 input characters, so the browser demonstration generates at most 5,040 lines.

## Verification

The C program was compiled and run with the supplied input. Output was compared byte-for-byte with this file and independently checked against Python `itertools.permutations`. Count: 5,040; distinct: 5,040 for this input; sorted: yes. This does not certify performance for inputs outside the exercise's stated bounds.
