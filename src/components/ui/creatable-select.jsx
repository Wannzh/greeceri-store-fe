import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

/**
 * CreatableSelect - A combobox that allows selecting from options OR typing custom values
 * Uses portal to avoid overflow clipping issues
 */
export function CreatableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Pilih atau ketik...",
    className,
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Sync input value with external value
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    // Filter options based on input
    useEffect(() => {
        if (!inputValue) {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter(
                (opt) =>
                    opt.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                    opt.value.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [inputValue, options]);

    // Calculate dropdown position when open
    useEffect(() => {
        if (open && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [open]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (open && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, [open]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setOpen(true);
    };

    const handleSelect = (optValue) => {
        setInputValue(optValue);
        onChange(optValue);
        setOpen(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim()) {
                onChange(inputValue.trim());
                setOpen(false);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (inputValue.trim() && inputValue !== value) {
                onChange(inputValue.trim());
            }
        }, 200);
    };

    const isCustomValue = inputValue && !options.some((o) => o.value === inputValue);

    const dropdownContent = open && (
        <div
            ref={dropdownRef}
            className="fixed rounded-md border bg-white shadow-xl max-h-72 overflow-y-auto"
            style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: Math.max(dropdownPosition.width, 280),
                zIndex: 9999,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            }}
        >
            {/* Custom value hint */}
            {isCustomValue && (
                <div
                    className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-green-50 border-b bg-green-50/50 sticky top-0"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(inputValue.trim());
                    }}
                >
                    <Plus className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-green-700">
                        Tambah "<span className="font-semibold">{inputValue}</span>"
                    </span>
                </div>
            )}

            {/* Options list */}
            <div className="py-1">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                        <div
                            key={opt.value}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-100 transition-colors",
                                value === opt.value && "bg-primary/10 text-primary"
                            )}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(opt.value);
                            }}
                        >
                            <Check
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    value === opt.value ? "opacity-100 text-primary" : "opacity-0"
                                )}
                            />
                            <span className="truncate">{opt.label}</span>
                        </div>
                    ))
                ) : !isCustomValue ? (
                    <div className="px-3 py-4 text-sm text-center text-gray-500">
                        Tidak ada hasil. Ketik untuk menambah satuan baru.
                    </div>
                ) : null}
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Input Field */}
            <div
                className={cn(
                    "flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    open && "ring-2 ring-ring ring-offset-2"
                )}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                />
                <ChevronsUpDown
                    className="h-4 w-4 shrink-0 text-gray-400 cursor-pointer ml-2"
                    onClick={() => {
                        setOpen(!open);
                        if (!open) inputRef.current?.focus();
                    }}
                />
            </div>

            {/* Portal Dropdown - renders outside of overflow containers */}
            {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
        </div>
    );
}
