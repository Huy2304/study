export function slugify(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 170);
}

export function formatNewsDate(value: Date | string | number | null | undefined) {
    if (value == null || value === "") return "Không xác định";

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "Không xác định";

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
    }).format(date);
}
