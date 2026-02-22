"use client";

import { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete, MdEdit, MdSearchOff } from "react-icons/md";
import { createType, updateType, deleteType, getTypes } from "../../../../lib/type-actions";
import { toast } from "react-hot-toast";

interface TypesModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand: {
        id: string;
        name: string;
    } | null;
}

interface Type {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

export default function TypesModal({ isOpen, onClose, brand }: TypesModalProps) {
    const [types, setTypes] = useState<Type[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && brand) {
            fetchTypes();
        } else {
            resetForm();
            setTypes([]);
        }
    }, [isOpen, brand]);

    const fetchTypes = async () => {
        if (!brand) return;
        setIsLoading(true);
        const result = await getTypes(brand.id);
        if (result.success) {
            setTypes(result.types || []);
        } else {
            toast.error(result.error || "Failed to fetch types");
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setName("");
        setIsEditing(null);
    };

    const handleEdit = (type: Type) => {
        setName(type.name);
        setIsEditing(type.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this type?")) return;
        const result = await deleteType(id);
        if (result.success) {
            toast.success("Type deleted");
            fetchTypes();
        } else {
            toast.error(result.error || "Failed to delete type");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !name) return;
        setIsSubmitting(true);
        try {
            const data = { name, subCategoryId: brand.id };
            const result = isEditing
                ? await updateType(isEditing, data)
                : await createType(data);

            if (result.success) {
                toast.success(isEditing ? "Type updated" : "Type created");
                resetForm();
                fetchTypes();
            } else {
                toast.error(result.error || "Failed to save type");
            }
        } catch (error) {
            console.error("Error saving type:", error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-[#202126] rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col max-h-[85vh]">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/1">
                    <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                            {brand?.name} - Types
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-all">
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white/2 p-4 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold text-white/40 tracking-wider">Type Name</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Parfume, Lotion..."
                                    required
                                    className="flex-1 h-12 px-4 rounded-xl border border-white/5 bg-white/2 text-white text-sm outline-none focus:border-accent/30"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 h-12 rounded-xl bg-accent text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                                >
                                    {isEditing ? "Update" : "Add"}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 h-12 rounded-xl bg-white/5 text-white/60 text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin h-6 w-6 border-2 border-white/10 border-t-accent rounded-full" />
                            </div>
                        ) : types.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-white/40">
                                <MdSearchOff size={32} />
                                <p className="text-xs mt-2 uppercase tracking-widest font-bold">No types found</p>
                            </div>
                        ) : (
                            types.map((type) => (
                                <div key={type.id} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl group hover:border-accent/20 transition-all">
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-tight">{type.name}</h4>
                                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">
                                            {type._count?.products || 0} Products
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEdit(type)} className="p-2 text-white/60 hover:text-accent">
                                            <MdEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(type.id)} className="p-2 text-white/60 hover:text-red-500">
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
