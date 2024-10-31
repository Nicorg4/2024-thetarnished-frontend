import { Image, ImageContainer } from './components'
import logo from '../../assets/Logo transparent.png'

const Logo = ({ onClick }: { onClick?: () => void }) => {  return (
    <ImageContainer onClick={onClick}>
        <Image src={logo} alt="Logo" />
    </ImageContainer>
  )
}

export default Logo
