"use client";

import { useEffect } from "react";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export function EarningsNavSync() {
    const { setActiveDrawerSection, setActiveTab } = useMobileNavigation();
    useEnsureFloatingNavButton();

    useEffect(() => {
        // Sync navigation state on mount
        setActiveDrawerSection("growth");
        setActiveTab("quick-actions");
    }, [setActiveDrawerSection, setActiveTab]);

    return null;
}

function useEnsureFloatingNavButton() {
    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        const previous = root.dataset.hideFloatingNavButton;

        if (previous === "true") {
            delete root.dataset.hideFloatingNavButton;
        }

        return () => {
            if (previous === "true") {
                root.dataset.hideFloatingNavButton = previous;
            }
        };
    }, []);
}
