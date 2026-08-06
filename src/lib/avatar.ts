const GRADIENTS = [
  'from-teal-700 to-emerald-900',
  'from-sky-700 to-blue-900',
  'from-violet-700 to-purple-900',
  'from-rose-700 to-red-900',
  'from-amber-700 to-orange-900',
  'from-cyan-700 to-teal-900',
  'from-indigo-700 to-slate-900',
  'from-fuchsia-700 to-pink-900',
] as const

export function projectGradient(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GRADIENTS[hash % GRADIENTS.length]
}

export function projectInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}
