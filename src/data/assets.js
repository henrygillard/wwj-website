export const logos = {
  blackTransparent: '/logos/logo-black.png',
  whiteTransparent: '/logos/logo-white.png',
}

// Recap video — hosted on S3. Still used as the muted autoplay loop behind the
// hero; a YouTube iframe can't serve that role without a large JS cost.
export const recapVideo = {
  src: 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com/recap.mp4',
  title: 'WWJ Recap',
}

// Promo video — YouTube. Powers the "Watch Us Live" section and the VideoObject
// schema. Poster is a local copy of the YouTube thumbnail so the section costs
// no third-party request until the visitor actually hits play.
export const promoVideo = {
  id: 'Is1TqI3tu2I',
  title: 'Wrestle With Jimmy - Weezer Tribute Promo Video',
  description:
    "Promo reel for Wrestle With Jimmy, Austin's Weezer cover band — live footage from venues across Austin, TX.",
  uploadDate: '2026-08-19',
  duration: 'PT51S',
  poster: '/thumbs/promo-poster.webp',
  posterWidth: 1280,
  posterHeight: 720,
  watchUrl: 'https://www.youtube.com/watch?v=Is1TqI3tu2I',
  embedUrl: 'https://www.youtube.com/embed/Is1TqI3tu2I',
  channelUrl: 'https://www.youtube.com/@WrestleWithJimmy-f1b',
}
