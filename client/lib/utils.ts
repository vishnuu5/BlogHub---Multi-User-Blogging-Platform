export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ")
  }
  
  export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  export function truncate(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + "..." : text
  }
  
  export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }
  