import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseProgramScreen } from "@/domains/partnerships/academy/03-courses/ui/subpages/CourseProgramScreen";
import {
  getCourseModules,
  getCourseSummaries,
  getCourseProgramHero,
} from "@/domains/partnerships/academy/03-courses/application/course-service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "SISO Partner Academy • Course",
};

export async function generateStaticParams() {
  try {
    const programs = await getCourseSummaries();
    return programs.map(({ id }) => ({ courseId: id }));
  } catch {
    return [];
  }
}

export default async function CourseProgramPage(props: any) {
  const { courseId } = await props?.params;
  const program = await getCourseProgramHero(courseId);
  if (!program) {
    notFound();
  }
  const modulesPromise = getCourseModules(courseId);
  return <CourseProgramScreen program={program} modulesPromise={modulesPromise} />;
}
