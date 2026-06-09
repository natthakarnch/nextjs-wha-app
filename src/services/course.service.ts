export async function getCourses() {
  const response = await fetch('https://api.codingthailand.com/api/course');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}
