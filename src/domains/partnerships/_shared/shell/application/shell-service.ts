import { cache } from "react";
import { mobileTabs, quickActionEntries } from "./tab-registry";

export const getMobileNavData = cache(async () => {
    return {
        tabs: mobileTabs,
        quickActions: quickActionEntries,
    };
});
