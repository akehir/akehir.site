export function copyToClipboard(str: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  } else {
    const el = this.document.createElement('textarea');
    el.classList.add('hidden');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    this.document.body.appendChild(el);
    el.select();
    this.document.execCommand('copy');
    this.document.body.removeChild(el);
  }
}
