export default function PageTitle({ children }) {
  return (
    <div className="text-left font-serif text-6xl font-medium tracking-normal break-words text-gray-900 lg:leading-snug xl:text-8xl 2xl:text-9xl 2xl:leading-tight dark:text-gray-100">
      {children}
    </div>
  )
}
