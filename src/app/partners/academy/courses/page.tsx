import type { Metadata } from "next";
import { CourseCatalogScreen } from "@/domains/partnerships/academy/03-courses/ui/screens/CourseCatalogScreen";

export const metadata: Metadata = {
  title: "Courses • SISO Partner Academy",
  description: "Searchable catalog of academy courses, progress, and related assets.",
};

import { getCourseSummaries } from "@/domains/partnerships/academy/03-courses/application/course-service";

export const dynamic = 'force-dynamic';

export default async function AcademyCoursesPage() {
  const courses = await getCourseSummaries().catch(() => []);
  return <CourseCatalogScreen courses={courses} />;
}
