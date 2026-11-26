import { useState, useEffect, useRef } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    // Локальная копия данных (чтобы можно было редактировать имена)
    const [data, setData] = useState<IItem[]>(() => [...props.initialData]);

    // Какой элемент сейчас редактируется
    const [editingId, setEditingId] = useState<number | null>(null);
    // Текущее значение в инпуте
    const [editValue, setEditValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    // При изменении сортировки пересортировываем данные.
    // Благодаря key={item.id} React сохранит состояние редактирования.
    useEffect(() => {
        setData((prev) => {
            const sorted = [...prev].sort((a, b) =>
                props.sorting === 'ASC' ? a.id - b.id : b.id - a.id,
            );
            return sorted;
        });
    }, [props.sorting]);

    // Фокус на инпут при начале редактирования
    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const startEditing = (item: IItem) => {
        setEditingId(item.id);
        setEditValue(item.name);
    };

    const save = () => {
        if (editingId === null) return;

        setData((prev) =>
            prev.map((item) =>
                item.id === editingId ? { ...item, name: editValue } : item,
            ),
        );
        setEditingId(null);
    };

    const cancel = () => {
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            save();
        } else if (e.key === 'Escape') {
            cancel();
        }
    };

    return (
        <div>
            {data.map((item) => (
                <div key={item.id}>
                    {editingId === item.id ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <span
                            onClick={() => startEditing(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
