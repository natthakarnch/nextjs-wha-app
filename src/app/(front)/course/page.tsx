import FeaturesCourse from "@/components/features-course";
import { getCourses } from "@/services/course.service";

// http://localhost:3000/course
export default async function CoursePage() {
  const courseResponse = await getCourses();

  return (
    <main>
      {
        courseResponse.data.length > 0 && <FeaturesCourse courses={courseResponse.data} />
      }
    </main>
  );
}