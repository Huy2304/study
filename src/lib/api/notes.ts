export interface SyncedNote {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

async function readJson(response: Response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error ?? "Yêu cầu thất bại"
        );
    }

    return data;
}

export async function listNotes(): Promise<
    SyncedNote[]
> {
    return readJson(
        await fetch("/api/notes", {
            cache: "no-store",
        })
    );
}

export async function createNote(input: {
    title: string;
    content: string;
}): Promise<SyncedNote> {
    return readJson(
        await fetch("/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })
    );
}

export async function updateNote(
    id: string,
    input: {
        title?: string;
        content?: string;
    }
): Promise<SyncedNote> {
    return readJson(
        await fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })
    );
}

export async function deleteNote(
    id: string
): Promise<void> {
    await readJson(
        await fetch(`/api/notes/${id}`, {
            method: "DELETE",
        })
    );
}
