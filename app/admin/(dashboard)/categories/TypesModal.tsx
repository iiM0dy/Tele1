"use client";

import { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete, MdEdit, MdSearchOff } from "react-icons/md";
import { createType, updateType, deleteType, getTypes } from "../../../../lib/type-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../../context/LanguageContext";

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
    image?: string | null;
    _count?: {
        products: number;
    };
}

export default function TypesModal({ isOpen, onClose, brand }: TypesModalProps) {
    const { t } = useLanguage();
    const [types, setTypes] = useState<Type[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
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
            toast.error(result.error || t('admin.types.failedToSave'));
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setName("");
        setImage("");
        setIsEditing(null);
    };

    const handleEdit = (type: Type) => {
        setName(type.name);
        setImage(type.image || "");
        setIsEditing(type.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.types.confirmDelete'))) return;
        const result = await deleteType(id);
        if (result.success) {
            toast.success(t('admin.types.deleted'));
            fetchTypes();
        } else {
            toast.error(result.error || t('admin.types.failedToSave'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !name) return;
        setIsSubmitting(true);
        try {
            const data = { name, image, subCategoryId: brand.id };
            const result = isEditing
                ? await updateType(isEditing, data)
                : await createType(data);

            if (result.success) {
                toast.success(isEditing ? t('admin.types.updated') : t('admin.types.created'));
                resetForm();
                fetchTypes();
            } else {
                toast.error(result.error || t('admin.types.failedToSave'));
            }
        } catch (error) {
            console.error("Error saving type:", error);
            toast.error(t('admin.errorGeneric'));
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
                            {brand?.name} - {t('admin.types.title')}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-all" aria-label={t('admin.close')}>
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white/2 p-4 rounded-2xl border border-white/5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">{t('admin.types.name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-white/20"
                                placeholder={t('admin.types.namePlaceholder')}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">{t('admin.imageUrl')}</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-white/20"
                                placeholder={t('admin.types.imagePlaceholder')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>{t('admin.updating')}</span>
                                </div>
                            ) : (
                                isEditing ? t('admin.types.update') : t('admin.types.add')
                            )}
                        </button>
                    </form>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-sm font-medium text-white/60">{t('admin.types.title')}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {isLoading ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20">
                                    <span className="animate-spin h-10 w-10 border-2 border-white/10 border-t-accent rounded-full mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('admin.types.loading')}</p>
                                </div>
                            ) : types.length === 0 ? (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                    <p className="text-white/20">{t('admin.types.notFound')}</p>
                                </div>
                            ) : (
                                types.map((type) => (
                                    <div
                                        key={type.id}
                                        className="group relative flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
                                    >
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/20 shrink-0">
                                            <img
                                                src={type.image || ""}
                                                alt={type.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate">{type.name}</h4>
                                            <p className="text-xs text-white/40 mt-1">
                                                {type._count?.products || 0} {t('admin.products')}
                                            </p>
                                        </div>

                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-md p-1.5 rounded-xl border border-white/10 translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(type)}
                                                className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                title={t('admin.edit')}
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(type.id)}
                                                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title={t('admin.delete')}
                                            >
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
        </div>
    );
}
