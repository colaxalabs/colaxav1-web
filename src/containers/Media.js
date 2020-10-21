import { createMedia } from '@artsy/fresnel'

const AppMedia = createMedia({
  breakpoints: {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1192
  },
})

const { Media, MediaContextProvider } = AppMedia

export { Media, MediaContextProvider }

