<script lang="ts">
  import 'highlight.js/styles/a11y-dark.min.css'

  import { unified } from 'unified'
  import rehypeParse from 'rehype-parse'
  import rehypeStringify from 'rehype-stringify'
  import rehypeSanitize from 'rehype-sanitize'
  import rehypeHighlight from 'rehype-highlight'
  import { rehypeResolveMxc } from '@vospel/rehype-resolve-mxc'
  import { rehypeTwemojify } from '@vospel/rehype-twemojify'

  import { client } from '../../../matrix'

  export let body: string = ''

  let sanitizedBody = ''
  $: {
      try {
        // console.log('body', body);
        // TODO: only allow mxc images, only allow links opened in new tab

        ((async () => {
          sanitizedBody = String(await unified()
            .use(rehypeParse)
            .use(rehypeResolveMxc, { matrixClient: client })
            .use(rehypeSanitize, {
              tagNames: ['strong', 'i', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'sup', 'sub', 'div', 'span', 'summary'],
              strip: ['script'],
              attributes: {
                'a': [
                  'href',
                ],
                'img': [
                  'src',
                  'dataMxEmoticon',
                ],
                'code': [
                  ['className', /^language-./]
                ],
                '*': [
                  'alt',
                  'height',
                  'width',
                  'id',
                ]
              },
            })
            .use(rehypeHighlight)
            .use(rehypeTwemojify)
            .use(rehypeStringify)
            .process(body))
        })())
      } catch(e) {
        console.error(e)
      }
  }

</script>

<p class="font-400 break-all formatted-style">
  {@html sanitizedBody}
</p>

<style>

.formatted-style > :global(:first-child) {
  @apply mt-0;
}

.formatted-style > :global(:last-child) {
  @apply mb-0;
}

.formatted-style > :global(*) {
  @apply mb-4 mt-2;
}

.formatted-style :global(h1),
.formatted-style :global(h2),
.formatted-style :global(h3),
.formatted-style :global(h4),
.formatted-style :global(h5),
.formatted-style :global(h6) {
  @apply pb-1 font-semibold;
}

.formatted-style :global(h1) {
  @apply text-3xl;
}

.formatted-style :global(h2) {
  @apply text-2xl;
}

.formatted-style :global(h3) {
  @apply text-xl;
}

.formatted-style :global(h4) {
  @apply text-lg;
}

.formatted-style :global(code) {
  @apply bg-gray-700 rounded-sm px-0.5 py-0.25 leading-6;
}

.formatted-style :global(pre) {
  @apply mb-4;
}

.formatted-style :global(pre) > :global(code) {
  @apply bg-gray-700 rounded-sm px-4 py-2 max-w-[70ch] block overflow-auto;
}

.formatted-style :global(blockquote) {
  @apply border-l-4 border-gray-700 pl-2 italic;
}

.formatted-style :global(ul) {
  @apply list-disc pl-4;
}

.formatted-style :global(ol) {
  @apply list-decimal pl-4;
}

.formatted-style :global(li ul) {
  @apply list-circle;
}

.formatted-style :global(li li ul) {
  @apply list-square;
}

.formatted-style :global(li + li) {
  @apply mt-1;
}

.formatted-style :global([data-mx-emoticon]),
.formatted-style :global([data-lb-twemoji]) {
  @apply h-8;
}
</style>