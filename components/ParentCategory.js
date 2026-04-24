import ChildCategory from '@/components/ChildCategory'

const ParentCategory = ({ catName, structuredCategories }) => {
  const niceCategory = catName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-')

  return (
    <div key={catName}>
      <div className="my-3 text-2xl font-bold text-gray-900 capitalize dark:text-gray-100">
        {niceCategory}
      </div>

      <div>
        {structuredCategories.map((category) => {
          return (
            <ChildCategory
              key={Object.keys(category)[0]}
              parentName={catName}
              category={category}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ParentCategory
