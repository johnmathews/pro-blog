const IframeEmbed = ({ src, type = 'youtube' }) => {
  if (type === 'amazon') {
    return (
      <>
        <div className="relative mt-3 mb-5" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            src={src}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </>
    )
  }
  if (type === 'youtube') {
    return (
      <>
        <div className="relative mt-3 mb-5" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            src={src}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </>
    )
  }
  return (
    <>
      <div className="relative mt-3 mb-5" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          src={src}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </>
  )
}

export default IframeEmbed
