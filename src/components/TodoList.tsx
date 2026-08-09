import { useEffect, useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TodoList() {
    const [todos, setTodos] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const stored = window.localStorage.getItem("studyfocus-todos");
            const parsed = stored ? JSON.parse(stored) : [];

            return Array.isArray(parsed)
                ? parsed.filter(
                      (todo): todo is string => typeof todo === "string"
                  )
                : [];
        } catch {
            return [];
        }
    });
    const [inputValue, setInputValue] = useState("");
    const [completed, setCompleted] = useState<Set<number>>(() => {
        if (typeof window === "undefined") return new Set();

        try {
            const stored = window.localStorage.getItem(
                "studyfocus-completed"
            );
            const parsed = stored ? JSON.parse(stored) : [];

            return new Set(
                Array.isArray(parsed)
                    ? parsed.filter(Number.isInteger)
                    : []
            );
        } catch {
            return new Set();
        }
    });

    useEffect(() => {
        window.localStorage.setItem("studyfocus-todos", JSON.stringify(todos));
        window.localStorage.setItem(
            "studyfocus-completed",
            JSON.stringify(Array.from(completed))
        );
        window.dispatchEvent(new Event("studyhay-todos"));
    }, [todos, completed]);

    const addTodo = () => {
        if (inputValue.trim()) {
            setTodos([...todos, inputValue.trim()]);
            setInputValue('');
        }
    };

    const toggleComplete = (index: number) => {
        const newCompleted = new Set(completed);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompleted(newCompleted);
    };

    const deleteTodo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
        setCompleted(prev => {
            return new Set(
                [...prev]
                    .filter(completedIndex => completedIndex !== index)
                    .map(completedIndex =>
                        completedIndex > index
                            ? completedIndex - 1
                            : completedIndex
                    )
            );
        });
    };

    return (
        <div className="fixed bottom-24 left-4 right-4 top-24 z-40 overflow-y-auto sm:left-auto sm:right-6 sm:w-80">
            {/* Glass card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <span className="text-yellow-400">Việc hôm nay</span>
                    <span className="text-sm text-white/60">({completed.size}/{todos.length})</span>
                </h3>

                {/* Input thêm task */}
                <div className="flex gap-2 mb-5">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                        placeholder="Add a new task..."
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-white/50"
                    />
                    <Button
                        onClick={addTodo}
                        size="icon"
                        className="h-11 w-11 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:from-purple-600 hover:to-pink-600"
                    >
                        <Plus size={20} />
                    </Button>
                </div>

                {/* Danh sách task */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {todos.length === 0 ? (
                        <p className="text-white/40 text-center py-8 text-sm">
                            No tasks yet. Enjoy your focus time!
                        </p>
                    ) : (
                        todos.map((todo, index) => (
                            <div
                                key={index}
                                className={`group flex items-center gap-3 p-3 rounded-xl transition-all
                  ${completed.has(index)
                                    ? 'bg-white/5 line-through text-white/50'
                                    : 'bg-white/10 hover:bg-white/15'
                                }`}
                            >
                                <button
                                    onClick={() => toggleComplete(index)}
                                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                    ${completed.has(index)
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                                        : 'border-white/40 hover:border-white/80'
                                    }`}
                                >
                                    {completed.has(index) && <Check size={14} className="text-white" />}
                                </button>

                                <span className="flex-1 text-white">{todo}</span>

                                <button
                                    onClick={() => deleteTodo(index)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg opacity-100 transition hover:bg-white/20 sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <Trash2 size={16} className="text-white/60" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
