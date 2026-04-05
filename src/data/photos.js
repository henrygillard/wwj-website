// Google Drive thumbnail URL helper
const thumb = (id, size = 'w600') =>
  `https://drive.google.com/thumbnail?id=${id}&sz=${size}`

export const promoPhotos = [
  { id: '1SGh4QJI9_w12Y3RishfjLgNQaVv5Owgo', label: 'DSC01907' },
  { id: '1_sSuf_NWYvnm_U97ZrXmiqO2FLEB9xWu', label: 'DSC01908' },
  { id: '1j3neqQTIamVSvufHZ0wal76upqOHp58Y', label: 'DSC01909' },
  { id: '1BJPPk9Olt6KdvIAWuKwomaIbFvr2Bglj', label: 'DSC01910' },
  { id: '1FD46T2syTwWszBpPB7hD6V-BDkFY-F2U', label: 'DSC01911' },
  { id: '1Ap6yrGffdqxHSJCpV3PWk-1GRjnkWR-5', label: 'DSC01912' },
  { id: '1Znj2BkGhPPz1fPUbVEzadLoX2292A26h', label: 'DSC01913' },
  { id: '1dpS5d18sufI0ClAQxKCMFtkkcLuXIjnU', label: 'DSC01914' },
  { id: '1h5kB7jVrQhfyjUFELfc4bNmDN8bj1EOK', label: 'DSC01915' },
  { id: '1ZtFYLDRjofI_kuIsA-jehKdnnYpStDT8', label: 'DSC01916' },
  { id: '1oX0JNkPyfc3nba_61OeKhHvy87K6iI0I', label: 'DSC01917' },
  { id: '1cl4dGrnWvx4bo5jWRNBGQVLRjGjswfbv', label: 'DSC01918' },
  { id: '1jBOYH2pXXKNMY_2Xh48sBHUy7D3YnH7p', label: 'DSC01919' },
  { id: '1GhPqNtPuO-II-9btHselGfwbOkG-a0Bu', label: 'DSC01920' },
  { id: '1LwB9IiNTYesRwyTXFfJxxm_ddlgyC3wP', label: 'DSC01921' },
  { id: '1kQyUHLpZEuA-SEUHF6dWAdRd-ebcIsOD', label: 'DSC01922' },
  { id: '1jllq5aybFSqNAZUANH4syqDvTfuFe5tw', label: 'DSC01923' },
  { id: '11xojwJEwtXvQG7iBlroN0cu32qnbajif', label: 'DSC01924' },
  { id: '1089HxZ5HA4C2gAIDlT1QllSvbwHpRJqP', label: 'DSC01925' },
  { id: '1q-U6fP0zMnwLVivuX_SYXkO241p1NqPk', label: 'DSC01926' },
].map((p) => ({
  ...p,
  src: thumb(p.id),
  fullSrc: thumb(p.id, 'w1600'),
  group: 'promo',
}))

export const livePhotos = [
  { id: '10Gsf1Oxe0UfrbsGVEaqXWndZbuNFKmbL', label: 'a' },
  { id: '1-IuJXv8GAqft1avQcNdqEaKafVqzZU5Z', label: 'ab' },
  { id: '1-4wsHgA-u_HkUcFgxnS1haxpk5B2uK66', label: 'abb' },
  { id: '1-GfiCja6VDizfqwqTo8LC0jRKjjxH0nY', label: 'IMG_6506' },
  { id: '1-xEGPWtJA7AiGVxScmfExp5vy6rFUgdC', label: 'IMG_6509' },
  { id: '1-YtxZuU_h-HQJyxLGCMtajlnHrAOBuj2', label: 'IMG_6510' },
  { id: '10TupnzorQgjoaS_RvOq1lrENKpLrJqbP', label: 'IMG_6511' },
  { id: '10kY6Vl_XK5O3vCe5GGg8cws6DKcJc-NS', label: 'IMG_6512' },
  { id: '10LWYlM_KzFyMJNp0YW2And1W77gsIi05', label: 'IMG_6514' },
  { id: '1-IhetowvOw6JcOzONYLicKsZ81oWkHP8', label: 'IMG_6515' },
  { id: '1-YsbqmblN516urap5b1ChfB8_X4214bD', label: 'IMG_6516' },
].map((p) => ({
  ...p,
  src: thumb(p.id),
  fullSrc: thumb(p.id, 'w1600'),
  group: 'live',
}))

export const allPhotos = [...promoPhotos, ...livePhotos]
