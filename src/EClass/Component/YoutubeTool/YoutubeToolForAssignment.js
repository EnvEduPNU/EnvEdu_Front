function YoutubeToolForAssignment({ data }) {
  return (
    <iframe
      title="youtube"
      type="text/html"
      width="100%"
      height="305"
      src={data.url}
    />
  );
}

export default YoutubeToolForAssignment;
