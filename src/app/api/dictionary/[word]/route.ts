import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface DictionaryDefinition {
    definition?: unknown;
    example?: unknown;
}

interface DictionaryMeaning {
    partOfSpeech?: unknown;
    definitions?: unknown;
}

interface DictionaryPhonetic {
    text?: unknown;
    audio?: unknown;
}

interface DictionaryEntry {
    word?: unknown;
    phonetic?: unknown;
    phonetics?: unknown;
    meanings?: unknown;
}

function asText(value: unknown, maxLength = 500) {
    return typeof value === "string"
        ? value.trim().slice(0, maxLength)
        : "";
}

export async function GET(
    _request: Request,
    context: { params: Promise<{ word: string }> }
) {
    const { word } = await context.params;
    const normalizedWord = word.trim().toLowerCase();

    if (!/^[a-z]+(?:[- ][a-z]+)*$/.test(normalizedWord)) {
        return NextResponse.json(
            { error: "Chỉ hỗ trợ tra từ tiếng Anh" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
                normalizedWord
            )}`,
            {
                next: { revalidate: 60 * 60 * 24 * 7 },
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (response.status === 404) {
            return NextResponse.json(
                { error: "Không tìm thấy từ này trong từ điển" },
                { status: 404 }
            );
        }

        if (!response.ok) {
            throw new Error("Dictionary API unavailable");
        }

        const payload = (await response.json()) as unknown;
        const entry = Array.isArray(payload)
            ? (payload[0] as DictionaryEntry | undefined)
            : undefined;

        if (!entry) {
            return NextResponse.json(
                { error: "Không tìm thấy dữ liệu từ điển" },
                { status: 404 }
            );
        }

        const phonetics = Array.isArray(entry.phonetics)
            ? (entry.phonetics as DictionaryPhonetic[])
            : [];
        const phonetic =
            phonetics.map((item) => asText(item.text, 100)).find(Boolean) ??
            asText(entry.phonetic, 100);
        const audio =
            phonetics
                .map((item) => asText(item.audio, 500))
                .find((item) => item.startsWith("https://")) ?? "";
        const meanings = Array.isArray(entry.meanings)
            ? (entry.meanings as DictionaryMeaning[])
            : [];
        const definitions = meanings
            .flatMap((meaning) => {
                const entries = Array.isArray(meaning.definitions)
                    ? (meaning.definitions as DictionaryDefinition[])
                    : [];

                return entries.slice(0, 2).map((definition) => ({
                    partOfSpeech: asText(meaning.partOfSpeech, 40),
                    definition: asText(definition.definition),
                    example: asText(definition.example),
                }));
            })
            .filter((definition) => definition.definition)
            .slice(0, 4);

        return NextResponse.json(
            {
                word: asText(entry.word, 100) || normalizedWord,
                phonetic,
                audio,
                definitions,
            },
            {
                headers: {
                    "Cache-Control":
                        "public, s-maxage=86400, stale-while-revalidate=604800",
                },
            }
        );
    } catch {
        return NextResponse.json(
            { error: "Không thể kết nối từ điển lúc này" },
            { status: 502 }
        );
    }
}
