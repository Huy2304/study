export type MathDifficulty = "easy" | "medium" | "hard";

export interface MathProblem {
    id: string;
    question: string;
    answer: number;
    options: number[];
    difficulty: MathDifficulty;
    explanation: string;
}

export const DAILY_CHALLENGE_QUESTION_COUNT = 10;

const DAILY_DIFFICULTIES: MathDifficulty[] = [
    "easy",
    "easy",
    "medium",
    "medium",
    "medium",
    "hard",
    "medium",
    "hard",
    "hard",
    "hard",
];

type Random = () => number;

function randomInteger(
    random: Random,
    minimum: number,
    maximum: number
) {
    return (
        Math.floor(random() * (maximum - minimum + 1)) +
        minimum
    );
}

function shuffle<T>(items: T[], random: Random) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [
            shuffled[swapIndex],
            shuffled[index],
        ];
    }

    return shuffled;
}

export function generateMathProblem(
    difficulty: MathDifficulty,
    random: Random = Math.random,
    grade?: number
): MathProblem {
    const normalizedGrade = grade
        ? Math.min(12, Math.max(1, Math.trunc(grade)))
        : undefined;
    const gradeNumberLimit =
        normalizedGrade === undefined
            ? Number.POSITIVE_INFINITY
            : normalizedGrade <= 1
              ? 10
              : normalizedGrade <= 2
                ? 20
                : normalizedGrade <= 3
                  ? 50
                  : normalizedGrade <= 5
                    ? 100
                    : normalizedGrade <= 8
                      ? 200
                      : 1_000;
    const minNumber =
        difficulty === "easy"
            ? 1
            : difficulty === "medium"
              ? 10
              : 20;
    const defaultMaxNumber =
        difficulty === "easy"
            ? 20
            : difficulty === "medium"
              ? 50
              : 100;
    const maxNumber = Math.max(
        minNumber,
        Math.min(defaultMaxNumber, gradeNumberLimit)
    );
    const operations =
        difficulty === "hard"
            ? ["+", "-", "*", "/"]
            : difficulty === "medium"
              ? ["+", "-", "*"]
              : ["+", "-"];

    const operation =
        operations[Math.floor(random() * operations.length)];
    let firstNumber: number;
    let secondNumber: number;

    if (operation === "*") {
        firstNumber = randomInteger(random, 2, 12);
        secondNumber = randomInteger(random, 2, 12);
    } else if (operation === "/") {
        secondNumber = randomInteger(random, 2, 10);
        firstNumber =
            secondNumber * randomInteger(random, 2, 12);
    } else {
        firstNumber = randomInteger(random, minNumber, maxNumber);
        secondNumber = randomInteger(random, minNumber, maxNumber);

        if (operation === "-") {
            [firstNumber, secondNumber] = [
                Math.max(firstNumber, secondNumber),
                Math.min(firstNumber, secondNumber),
            ];
        }
    }

    const answer =
        operation === "+"
            ? firstNumber + secondNumber
            : operation === "-"
              ? firstNumber - secondNumber
              : operation === "*"
                ? firstNumber * secondNumber
                : firstNumber / secondNumber;

    const symbol =
        operation === "*"
            ? "×"
            : operation === "/"
              ? "÷"
              : operation;
    const options = new Set<number>([answer]);
    const range = Math.max(5, Math.ceil(Math.abs(answer) * 0.25));

    while (options.size < 4) {
        const candidate =
            answer + randomInteger(random, -range, range);

        if (candidate >= 0 && candidate !== answer) {
            options.add(candidate);
        }
    }

    return {
        id: `${difficulty}-${firstNumber}-${operation}-${secondNumber}-${answer}`,
        question: `${firstNumber} ${symbol} ${secondNumber}`,
        answer,
        options: shuffle(Array.from(options), random),
        difficulty,
        explanation: `${firstNumber} ${symbol} ${secondNumber} = ${answer}`,
    };
}

function createSeededRandom(seed: string): Random {
    let value = 2_166_136_261;

    for (let index = 0; index < seed.length; index += 1) {
        value ^= seed.charCodeAt(index);
        value = Math.imul(value, 16_777_619);
    }

    return () => {
        value += 0x6d2b79f5;
        let result = value;
        result = Math.imul(result ^ (result >>> 15), result | 1);
        result ^=
            result +
            Math.imul(result ^ (result >>> 7), result | 61);
        return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
    };
}

export function getChallengeDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(
        parts
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
}

export function getDailyChallengeGameMode(date = getChallengeDate()) {
    return `daily-${date}`;
}

export function createDailyChallenge(date = getChallengeDate()) {
    const random = createSeededRandom(`studyhay-math-${date}`);

    return DAILY_DIFFICULTIES.map((difficulty, index) => ({
        ...generateMathProblem(difficulty, random),
        id: `daily-${date}-${index}`,
    }));
}
