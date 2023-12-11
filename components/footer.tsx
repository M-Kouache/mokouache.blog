import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row items-center font-bold">
            Mohamed Kouache <span className="bg-red-500 px-1 rounded-lg ml-2 text-white font-thin" >🇲🇦 </span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
