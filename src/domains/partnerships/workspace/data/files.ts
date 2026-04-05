import type { WorkspaceFile } from "../domain/files";

export const mockFiles: WorkspaceFile[] = [
  { id: "file-1", name: "Partner Handbook.pdf", sizeKb: 240, uploadedAt: "2025-11-20", type: "pdf" },
  { id: "file-2", name: "Q4 Roadmap.pptx", sizeKb: 5120, uploadedAt: "2025-11-18", type: "pptx" },
];
