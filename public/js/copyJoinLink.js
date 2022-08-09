const copyToClipboard = () => {
  const copyText = document.getElementById("link-text").innerText;
  navigator.clipboard.writeText(copyText);
};