export interface SyncedTodo {
    id: string;
    content: string;
    completed: boolean;
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

export async function listTodos(): Promise<
    SyncedTodo[]
> {
    return readJson(
        await fetch("/api/todos", {
            cache: "no-store",
        })
    );
}

export async function createTodo(
    content: string
): Promise<SyncedTodo> {
    return readJson(
        await fetch("/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        })
    );
}

export async function updateTodo(
    id: string,
    input: {
        content?: string;
        completed?: boolean;
    }
): Promise<SyncedTodo> {
    return readJson(
        await fetch(`/api/todos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })
    );
}

export async function deleteTodo(
    id: string
): Promise<void> {
    await readJson(
        await fetch(`/api/todos/${id}`, {
            method: "DELETE",
        })
    );
}
