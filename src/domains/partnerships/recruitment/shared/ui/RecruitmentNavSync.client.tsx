"use client";

import { useEffect } from "react";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export function RecruitmentNavSync() {
    const { setActiveDrawerSection } = useMobileNavigation();

    useEffect(() => {
        setActiveDrawerSection("recruitment");
    }, [setActiveDrawerSection]);

    return null;
}
