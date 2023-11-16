<script lang="ts">
  import { decryptAttachment } from 'matrix-encrypt-attachment'
  import { client } from '../../../matrix';
  import type { IEncryptedFile } from 'matrix-js-sdk';
  import { onMount } from 'svelte';

  export let alt: string
  export let file: IEncryptedFile
  
  let imageSrc: Promise<string>

  onMount(() => {
    const url = client.mxcUrlToHttp(file.url)
    if (!url) return
    imageSrc = fetch(url)
      .then((result) => {
        return result.arrayBuffer()
      }).then((arrayBuffer) => {
        return decryptAttachment(arrayBuffer, file)
      })
      .then((data) => {
        return URL.createObjectURL(new Blob([data], { type: file.mimetype }))
      })
  })
</script>

{#await imageSrc}
  Decrypting...
{:then src} 
  <img src={src} alt={alt} />
{:catch}
  Decryption error
{/await}