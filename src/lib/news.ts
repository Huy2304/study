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

export function formatNewsDate(value: Date) {
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
    }).format(value);
}
