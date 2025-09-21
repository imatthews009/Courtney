import { createFileRoute } from '@tanstack/react-router'
import { CourtneyCarousel, CourtneyList } from '~/components/CourtneyCarousel'
export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2 flex justify-center pt-6">
      <CourtneyCarousel list={CourtneyList} />
    </div>
  )
}
