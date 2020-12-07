const convertToBuffer = async(reader, cb) => {
  const buffer = await Buffer.from(reader.result)
  cb(buffer)
}

export const handleUpload = (e, cb) => {
  e.preventDefault()
  const file = e.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => convertToBuffer(reader, cb)
}

