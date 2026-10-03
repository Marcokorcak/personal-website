// GitHub project Pages serves this site below /personal-website/.
// Leave the environment variable unset for ordinary local development.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string): string {
  return `${basePath}${path}`;
}
