import { createFileRoute } from '@tanstack/react-router'
import { GoogleSheetManager } from '~/components/GoogleSheetManager'
// import { CourtneyCarousel } from '~/components/CourtneyCarousel'
export const Route = createFileRoute('/test')({
  component: Test,
})

function Test() {
  return (
    <div className="p-2 flex justify-center pt-6">
      <GoogleSheetManager />
    </div>
  )
}