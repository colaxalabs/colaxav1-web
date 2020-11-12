export function sanitize(size) {
  const _size = size.split(' ')
  const newSize = new Intl.NumberFormat('en-US').format(_size[0])
  return `${newSize} ${_size[1]}`
}

