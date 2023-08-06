<script lang="ts">
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { t } from 'svelte-i18n'
</script>

<svelte:head>
  <meta name="description" content="{ $t('seo.description') }"/>
  <meta name="og:description" content="{ $t('seo.description') }"/>
</svelte:head>

<div class="min-h-screen w-full h-full bg-gray-900 text-gray-100">
  <slot />
</div>